import jsPDF from 'jspdf';
import { ResumeData } from './openai';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  generate: (data: ResumeData) => jsPDF;
}

// Template 1: Modern Professional
function generateModernTemplate(data: ResumeData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Header with name and contact
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.personalInfo.name, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contactInfo = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.linkedIn,
    data.personalInfo.github
  ].filter(Boolean).join(' | ');
  doc.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });

  // Summary section
  yPosition += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO PROFISSIONAL', margin, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 10;

  // Education section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMAÇÃO ACADÊMICA', margin, yPosition);
  yPosition += 8;

  data.education.forEach(edu => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${edu.degree} em ${edu.field}`, margin, yPosition);
    yPosition += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${edu.institution} | ${edu.graduationYear || 'Em andamento'}`, margin, yPosition);
    yPosition += 8;
  });

  // Projects section
  yPosition += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJETOS', margin, yPosition);
  yPosition += 8;

  data.projects.forEach(project => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(project.name, margin, yPosition);
    yPosition += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const projectDesc = doc.splitTextToSize(project.description, pageWidth - 2 * margin);
    doc.text(projectDesc, margin, yPosition);
    yPosition += projectDesc.length * 4;
    
    if (project.technologies.length > 0) {
      doc.setFont('helvetica', 'italic');
      doc.text(`Tecnologias: ${project.technologies.join(', ')}`, margin, yPosition);
      yPosition += 8;
    }
  });

  // Skills section
  yPosition += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('HABILIDADES', margin, yPosition);
  yPosition += 8;

  if (data.skills.technical.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Técnicas:', margin, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.text(data.skills.technical.join(', '), margin + 20, yPosition);
    yPosition += 8;
  }

  if (data.skills.tools.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Ferramentas:', margin, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.text(data.skills.tools.join(', '), margin + 20, yPosition);
    yPosition += 8;
  }

  if (data.skills.languages.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Idiomas:', margin, yPosition);
    yPosition += 4;
    doc.setFont('helvetica', 'normal');
    doc.text(data.skills.languages.join(', '), margin + 20, yPosition);
  }

  return doc;
}

// Template 2: Clean Minimal
function generateCleanTemplate(data: ResumeData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 25;
  let yPosition = 40;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(data.personalInfo.name.toUpperCase(), margin, yPosition);
  
  yPosition += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.personalInfo.email, margin, yPosition);
  if (data.personalInfo.phone) {
    doc.text(data.personalInfo.phone, pageWidth - margin, yPosition, { align: 'right' });
  }

  // Line separator
  yPosition += 10;
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 4 + 15;

  // Education
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EDUCAÇÃO', margin, yPosition);
  yPosition += 8;

  data.education.forEach(edu => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(edu.degree, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(edu.graduationYear || 'Em andamento', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 4;
    
    doc.setFontSize(9);
    doc.text(`${edu.field} - ${edu.institution}`, margin, yPosition);
    yPosition += 10;
  });

  // Projects
  yPosition += 5;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJETOS', margin, yPosition);
  yPosition += 8;

  data.projects.forEach(project => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(project.name, margin, yPosition);
    yPosition += 5;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const projectDesc = doc.splitTextToSize(project.description, pageWidth - 2 * margin);
    doc.text(projectDesc, margin, yPosition);
    yPosition += projectDesc.length * 3 + 8;
  });

  return doc;
}

// Template 3: Professional Standard
function generateProfessionalTemplate(data: ResumeData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 25;

  // Header background
  doc.setFillColor(31, 41, 55); // Dark gray
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Name in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.personalInfo.name, margin, 25);
  
  // Contact info in white
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.personalInfo.email, margin, 35);
  if (data.personalInfo.phone) {
    doc.text(data.personalInfo.phone, margin, 42);
  }

  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  yPosition = 65;

  // Summary section with background
  doc.setFillColor(249, 115, 22); // Orange
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO PROFISSIONAL', margin + 5, yPosition);
  
  doc.setTextColor(0, 0, 0);
  yPosition += 12;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 4 + 15;

  // Other sections with similar styling...
  const sections = [
    { title: 'FORMAÇÃO', items: data.education },
    { title: 'PROJETOS', items: data.projects }
  ];

  sections.forEach(section => {
    doc.setFillColor(31, 41, 55);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 5, yPosition);
    
    doc.setTextColor(0, 0, 0);
    yPosition += 12;
    
    // Add section content based on type
    if (section.title === 'FORMAÇÃO') {
      data.education.forEach(edu => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${edu.degree} em ${edu.field}`, margin, yPosition);
        yPosition += 4;
        doc.setFont('helvetica', 'normal');
        doc.text(`${edu.institution} | ${edu.graduationYear || 'Em andamento'}`, margin, yPosition);
        yPosition += 8;
      });
    } else if (section.title === 'PROJETOS') {
      data.projects.forEach(project => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(project.name, margin, yPosition);
        yPosition += 4;
        doc.setFont('helvetica', 'normal');
        const desc = doc.splitTextToSize(project.description, pageWidth - 2 * margin);
        doc.text(desc, margin, yPosition);
        yPosition += desc.length * 3 + 8;
      });
    }
    
    yPosition += 5;
  });

  return doc;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Design limpo e contemporâneo, ideal para startups e empresas de tecnologia',
    generate: generateModernTemplate
  },
  {
    id: 'clean',
    name: 'Minimalista',
    description: 'Layout simples e elegante, foco no conteúdo',
    generate: generateCleanTemplate
  },
  {
    id: 'professional',
    name: 'Profissional',
    description: 'Formato tradicional com toques modernos, versátil para qualquer setor',
    generate: generateProfessionalTemplate
  }
];

export async function generateResumePDF(data: ResumeData, templateId: string): Promise<Buffer> {
  const template = RESUME_TEMPLATES.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error(`Template não encontrado: ${templateId}`);
  }

  try {
    const doc = template.generate(data);
    return Buffer.from(doc.output('arraybuffer'));
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error(`Falha ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}
