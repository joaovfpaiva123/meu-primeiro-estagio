import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Eye, Download, Sparkles } from "lucide-react";

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
}

interface ResumeTemplatesProps {
  onTemplateSelect: (templateId: string) => void;
  selectedTemplateId?: string;
  showPreview?: boolean;
  allowDownload?: boolean;
  resumeData?: any;
}

export default function ResumeTemplates({ 
  onTemplateSelect, 
  selectedTemplateId, 
  showPreview = false,
  allowDownload = false,
  resumeData 
}: ResumeTemplatesProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
  };

  const handlePreview = (templateId: string) => {
    setPreviewTemplate(templateId);
    // In a real implementation, this would open a modal with template preview
  };

  const handleDownload = async (templateId: string) => {
    if (!resumeData) return;
    
    try {
      const response = await fetch(`/api/resumes/${resumeData.id}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `curriculo-${templateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Escolha seu Template</h3>
          <p className="text-muted-foreground">Selecione o design que mais combina com seu perfil</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-[3/4] w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Escolha seu Template</h3>
        <p className="text-muted-foreground">
          Selecione o design que mais combina com seu perfil profissional
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {templates?.map((template: ResumeTemplate) => (
          <Card 
            key={template.id} 
            className={`card-hover cursor-pointer transition-all ${
              selectedTemplateId === template.id 
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                : 'border-border'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{template.name}</span>
                    {selectedTemplateId === template.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>
                
                {template.id === 'modern' && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-white rounded border shadow-sm mb-4 overflow-hidden relative group">
                {/* Simulated resume content based on template type */}
                {template.id === 'modern' && (
                  <div className="p-2 text-xs text-gray-800">
                    <div className="bg-gray-800 text-white p-2 mb-2 rounded-sm">
                      <div className="font-bold">JOÃO SILVA</div>
                      <div className="text-xs">joao@email.com | (11) 99999-9999</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-orange-500 text-xs">RESUMO</div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      
                      <div className="font-semibold text-orange-500 text-xs mt-2">EDUCAÇÃO</div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      
                      <div className="font-semibold text-orange-500 text-xs mt-2">PROJETOS</div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                )}
                
                {template.id === 'clean' && (
                  <div className="p-2 text-xs text-gray-800">
                    <div className="border-b border-gray-300 pb-1 mb-2">
                      <div className="font-bold text-sm">JOÃO SILVA</div>
                      <div className="text-xs text-gray-600">joao@email.com</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-xs">RESUMO</div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      
                      <div className="font-semibold text-xs mt-2">EDUCAÇÃO</div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                      
                      <div className="font-semibold text-xs mt-2">PROJETOS</div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                )}
                
                {template.id === 'professional' && (
                  <div className="p-2 text-xs text-gray-800">
                    <div className="bg-gray-700 text-white p-1 mb-2">
                      <div className="font-bold text-sm">JOÃO SILVA</div>
                      <div className="text-xs">joao@email.com</div>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-orange-500 text-white px-1 py-0.5 text-xs font-semibold">
                        RESUMO PROFISSIONAL
                      </div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      
                      <div className="bg-gray-700 text-white px-1 py-0.5 text-xs font-semibold mt-2">
                        FORMAÇÃO
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                      
                      <div className="bg-gray-700 text-white px-1 py-0.5 text-xs font-semibold mt-2">
                        PROJETOS
                      </div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {showPreview && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template.id);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {allowDownload && resumeData && (
                    <Button
                      size="sm"
                      className="btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(template.id);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Selection Button */}
              <Button
                className={`w-full transition-all ${
                  selectedTemplateId === template.id
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect(template.id);
                }}
              >
                {selectedTemplateId === template.id ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Selecionado
                  </>
                ) : (
                  'Selecionar Template'
                )}
              </Button>

              {/* Template Features */}
              <div className="mt-3 space-y-1">
                {template.id === 'modern' && (
                  <>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Design contemporâneo
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Ideal para tech
                    </div>
                  </>
                )}
                
                {template.id === 'clean' && (
                  <>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Layout minimalista
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Foco no conteúdo
                    </div>
                  </>
                )}
                
                {template.id === 'professional' && (
                  <>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Formato tradicional
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Versátil para qualquer setor
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedTemplateId && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span>Template selecionado: {templates?.find((t: ResumeTemplate) => t.id === selectedTemplateId)?.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
