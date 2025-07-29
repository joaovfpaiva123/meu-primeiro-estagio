# Meu Primeiro Estágio

## Overview

This is a full-stack web application called "Meu Primeiro Estágio" (My First Internship) - an AI-powered resume generator designed specifically for university students in exact sciences (Engineering, Computer Science, etc.). The application helps students create professional resumes using artificial intelligence and provides job-specific customization features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and better development experience
- **Styling**: Tailwind CSS with Shadcn/ui component library for consistent, modern UI components
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth integration with OpenID Connect for seamless user authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definition between client and server located in `/shared/schema.ts`

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions for scalability
- **User Management**: Automatic user creation/updates on authentication
- **Admin Access**: Role-based access control with admin flag

### AI Integration
- **Provider**: OpenAI GPT-4o for resume content generation
- **Features**: 
  - Resume content generation from user input
  - Job-specific resume customization
  - Improvement suggestions based on user profile

### Resume Generation
- **PDF Generation**: jsPDF for client-side PDF creation
- **Templates**: Multiple resume templates (Modern, Creative, Professional)
- **Customization**: Job-specific resume enhancement based on job descriptions

### File Upload System
- **Handler**: Multer middleware for multipart form data
- **Storage**: Memory storage with 5MB file size limit
- **Support**: PDF and image files with OCR text extraction capability

## Data Flow

### User Onboarding Flow
1. User authenticates via Replit Auth
2. Initial onboarding form collects basic information
3. Optional existing resume upload for enhancement
4. AI processes user data to generate structured resume content
5. User selects from available templates
6. PDF generation and storage in database

### Resume Customization Flow
1. User provides job description (text, PDF, or image)
2. OCR extraction for non-text inputs
3. AI analyzes job requirements against user profile
4. Enhanced resume generated with job-specific optimizations
5. New resume version stored with job-specific flag

### Admin Dashboard Flow
1. Admin authentication verification
2. User statistics and analytics display
3. Lead management and user data overview

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **openai**: AI integration for content generation
- **jspdf**: PDF generation library

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations located in `/migrations`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access key
- `SESSION_SECRET`: Session encryption secret
- `REPL_ID`: Replit environment identifier

### Production Configuration
- **Static Assets**: Served from `dist/public`
- **API Routes**: Mounted under `/api` prefix
- **Session Storage**: PostgreSQL for horizontal scalability
- **Database Migrations**: Automated via Drizzle Kit

### Development Setup
- **Hot Reload**: Vite HMR for frontend development
- **File Watching**: tsx for backend TypeScript execution
- **Database Push**: `npm run db:push` for schema updates
- **Environment**: NODE_ENV-based configuration switching

The application follows a monorepo structure with shared TypeScript schemas and utilities, enabling type safety across the full stack while maintaining clear separation of concerns between frontend, backend, and shared code.