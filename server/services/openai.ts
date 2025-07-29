import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
  };
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear?: string;
    gpa?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  skills: {
    technical: string[];
    languages: string[];
    tools: string[];
  };
}

export async function generateResumeContent(
  userInput: {
    fullName: string;
    email: string;
    phone?: string;
    university: string;
    course: string;
    skills: string;
    relevantProject: string;
  },
  jobDescription?: string
): Promise<ResumeData> {
  try {
    const isJobSpecific = !!jobDescription;
    const jobContext = isJobSpecific 
      ? `\n\nPersonalize este currículo para a seguinte vaga:\n${jobDescription}`
      : '';

    const prompt = `Você é um especialista em criação de currículos para universitários de ciências exatas no Brasil. 
Crie um currículo profissional em português brasileiro baseado nas seguintes informações:

Nome: ${userInput.fullName}
Email: ${userInput.email}
Telefone: ${userInput.phone || 'Não informado'}
Universidade: ${userInput.university}
Curso: ${userInput.course}
Principais Habilidades: ${userInput.skills}
Projeto Relevante: ${userInput.relevantProject}${jobContext}

Instruções:
- Crie conteúdo profissional e otimizado para recrutadores
- Use linguagem formal mas acessível
- Destaque competências técnicas relevantes para ciências exatas
- Crie uma seção de resumo profissional impactante
- Organize as habilidades por categorias (técnicas, ferramentas, idiomas)
- Elabore descrições detalhadas do projeto mencionado
- Se necessário, infira experiências acadêmicas típicas (monitoria, iniciação científica, etc.)
- Mantenha o foco em resultados e impacto
${isJobSpecific ? '- Personalize o conteúdo para a vaga específica mencionada' : ''}

Retorne APENAS um objeto JSON no formato especificado sem texto adicional.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em criação de currículos. Responda sempre em JSON válido no formato especificado."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Resposta vazia da API OpenAI");
    }

    const resumeData = JSON.parse(content) as ResumeData;
    
    // Validate essential fields
    if (!resumeData.personalInfo || !resumeData.summary || !resumeData.skills) {
      throw new Error("Estrutura de dados incompleta retornada pela IA");
    }

    return resumeData;
  } catch (error) {
    console.error("Erro ao gerar conteúdo do currículo:", error);
    throw new Error(`Falha ao gerar conteúdo do currículo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function enhanceResumeForJob(
  existingResume: ResumeData,
  jobDescription: string
): Promise<ResumeData> {
  try {
    const prompt = `Você é um especialista em otimização de currículos. 
Personalize o seguinte currículo para a vaga específica:

CURRÍCULO ATUAL:
${JSON.stringify(existingResume, null, 2)}

DESCRIÇÃO DA VAGA:
${jobDescription}

Instruções:
- Mantenha todas as informações verdadeiras do candidato
- Reordene e destaque habilidades mais relevantes para a vaga
- Ajuste o resumo profissional para alinhar com a posição
- Reescreva descrições de projetos/experiências para destacar aspectos relevantes
- Adicione palavras-chave da descrição da vaga quando apropriado
- Mantenha a estrutura JSON original

Retorne APENAS o JSON atualizado sem texto adicional.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em otimização de currículos. Responda sempre em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Resposta vazia da API OpenAI");
    }

    return JSON.parse(content) as ResumeData;
  } catch (error) {
    console.error("Erro ao personalizar currículo:", error);
    throw new Error(`Falha ao personalizar currículo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function generateImprovementSuggestions(userProfile: any): Promise<string[]> {
  try {
    const prompt = `Baseado no perfil do usuário, sugira 5-7 maneiras específicas de como este universitário de ciências exatas pode melhorar seu currículo:

PERFIL DO USUÁRIO:
${JSON.stringify(userProfile, null, 2)}

Forneça sugestões práticas e acionáveis, como:
- Projetos para desenvolver
- Habilidades para aprender
- Experiências para buscar
- Certificações relevantes
- Atividades extracurriculares

Retorne um array JSON de strings com as sugestões.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um conselheiro de carreira especializado em ciências exatas. Responda sempre em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Resposta vazia da API OpenAI");
    }

    const result = JSON.parse(content);
    return result.suggestions || [];
  } catch (error) {
    console.error("Erro ao gerar sugestões:", error);
    throw new Error(`Falha ao gerar sugestões: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}
