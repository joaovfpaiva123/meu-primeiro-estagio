import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateResumeContent, enhanceResumeForJob, generateImprovementSuggestions } from "./services/openai";
import { generateResumePDF, RESUME_TEMPLATES } from "./services/pdfGenerator";
import { onboardingSchema, jobCustomizationSchema } from "@shared/schema";
import multer from 'multer';
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Onboarding routes
  app.post('/api/onboarding', isAuthenticated, upload.single('existingResume'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = onboardingSchema.parse(req.body);
      
      // Update user with additional info
      await storage.upsertUser({
        id: userId,
        email: data.email,
        firstName: data.fullName.split(' ')[0],
        lastName: data.fullName.split(' ').slice(1).join(' '),
        university: data.university,
        course: data.course,
        skills: data.skills,
      });

      // Create user profile
      const profileData = {
        userId,
        personalInfo: {
          fullName: data.fullName,
          email: data.email,
          phone: req.body.phone,
        },
        education: [{
          institution: data.university,
          degree: 'Graduação',
          field: data.course,
        }],
        projects: [{
          name: 'Projeto Relevante',
          description: data.relevantProject,
          technologies: data.skills.split(',').map((s: string) => s.trim()),
        }],
        skills: {
          technical: data.skills.split(',').map((s: string) => s.trim()),
        }
      };

      const profile = await storage.createUserProfile(profileData);

      // Generate AI resume content
      const resumeContent = await generateResumeContent({
        fullName: data.fullName,
        email: data.email,
        phone: req.body.phone,
        university: data.university,
        course: data.course,
        skills: data.skills,
        relevantProject: data.relevantProject,
      });

      // Create first resume
      const resume = await storage.createResume({
        userId,
        title: 'Currículo Geral',
        content: resumeContent,
        templateId: 'modern',
        isJobSpecific: false,
      });

      res.json({ 
        message: 'Onboarding completed successfully',
        profile,
        resume
      });
    } catch (error) {
      console.error('Onboarding error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  });

  // Resume routes
  app.get('/api/resumes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getUserResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      res.status(500).json({ message: 'Failed to fetch resumes' });
    }
  });

  app.get('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json(resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      res.status(500).json({ message: 'Failed to fetch resume' });
    }
  });

  app.post('/api/resumes/:id/generate-pdf', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { templateId } = req.body;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      const pdfBuffer = await generateResumePDF(resume.content as any, templateId || resume.templateId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  });

  app.post('/api/resumes/job-specific', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = jobCustomizationSchema.parse(req.body);
      
      // Get user's general resume or profile
      const userResumes = await storage.getUserResumes(userId);
      const generalResume = userResumes.find(r => !r.isJobSpecific);
      
      if (!generalResume) {
        return res.status(400).json({ message: 'No general resume found' });
      }

      // Enhance resume for specific job
      const enhancedContent = await enhanceResumeForJob(
        generalResume.content as any,
        data.jobDescription
      );

      // Create job-specific resume
      const jobResume = await storage.createResume({
        userId,
        title: `Vaga - ${data.jobTitle}`,
        content: enhancedContent,
        templateId: generalResume.templateId,
        isJobSpecific: true,
        jobDescription: data.jobDescription,
      });

      res.json(jobResume);
    } catch (error) {
      console.error('Error creating job-specific resume:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  });

  app.delete('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      await storage.deleteResume(req.params.id);
      res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(500).json({ message: 'Failed to delete resume' });
    }
  });

  // Profile routes
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  });

  app.get('/api/improvement-suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      const suggestions = await generateImprovementSuggestions(profile);
      res.json({ suggestions });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      res.status(500).json({ message: 'Failed to generate suggestions' });
    }
  });

  // Template routes
  app.get('/api/templates', (req, res) => {
    res.json(RESUME_TEMPLATES.map(({ generate, ...template }) => template));
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const [userCount, resumeCount, users] = await Promise.all([
        storage.getUserCount(),
        storage.getResumeCount(),
        storage.getAllUsers()
      ]);
      
      res.json({
        userCount,
        resumeCount,
        users: users.slice(0, 50) // Limit to recent 50 users
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
