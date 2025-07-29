import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  Target, 
  Lightbulb,
  Calendar,
  Star,
  ExternalLink 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Resume } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [improvementDialogOpen, setImprovementDialogOpen] = useState(false);

  const { data: resumes = [], isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
    enabled: !!user,
  });

  const { data: suggestions = [] } = useQuery<string[]>({
    queryKey: ["/api/improvement-suggestions"],
    enabled: !!user,
  });

  const createJobResumeMutation = useMutation({
    mutationFn: async (data: { jobTitle: string; jobDescription: string; companyName?: string }) => {
      return await apiRequest("POST", "/api/resumes/job-specific", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      setJobDialogOpen(false);
      toast({
        title: "Sucesso!",
        description: "Currículo personalizado criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao criar currículo personalizado.",
        variant: "destructive",
      });
    },
  });

  const downloadPdfMutation = useMutation({
    mutationFn: async ({ resumeId, templateId }: { resumeId: string; templateId?: string }) => {
      const response = await fetch(`/api/resumes/${resumeId}/generate-pdf`, {
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
      a.download = `curriculo-${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "PDF baixado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao baixar PDF.",
        variant: "destructive",
      });
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return await apiRequest("DELETE", `/api/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Sucesso!",
        description: "Currículo excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao excluir currículo.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleJobResumeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createJobResumeMutation.mutate({
      jobTitle: formData.get('jobTitle') as string,
      jobDescription: formData.get('jobDescription') as string,
      companyName: formData.get('companyName') as string,
    });
  };

  if (resumesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seus currículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Meu Primeiro Estágio</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Olá, {user?.firstName || 'Usuário'}!
              </span>
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seus Currículos</h1>
          <p className="text-muted-foreground">
            Você tem {resumes?.length || 0} currículo{(resumes?.length || 0) !== 1 ? 's' : ''} criado{(resumes?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Você tem alguma vaga em mente?</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary flex-1">
                    <Target className="w-4 h-4 mr-2" />
                    Sim, adaptar currículo para vaga
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Personalizar Currículo para Vaga</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleJobResumeSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="jobTitle">Título da Vaga *</Label>
                      <Input 
                        id="jobTitle"
                        name="jobTitle"
                        required
                        placeholder="Ex: Desenvolvedor Frontend Jr."
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input 
                        id="companyName"
                        name="companyName"
                        placeholder="Ex: Google, Microsoft, etc."
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobDescription">Descrição da Vaga *</Label>
                      <Textarea
                        id="jobDescription"
                        name="jobDescription"
                        required
                        rows={8}
                        placeholder="Cole aqui a descrição completa da vaga..."
                        className="form-input resize-none"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setJobDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={createJobResumeMutation.isPending}
                        className="btn-primary flex-1"
                      >
                        {createJobResumeMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Criando...
                          </>
                        ) : (
                          'Criar Currículo'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={improvementDialogOpen} onOpenChange={setImprovementDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="btn-secondary flex-1">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Não, quero melhorar meu perfil
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Sugestões para Melhorar seu Perfil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {suggestions?.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                        <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">{suggestion}</p>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Gerando sugestões personalizadas...</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Resume Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes?.map((resume: any) => (
            <Card key={resume.id} className="card-hover">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resume.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(resume.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </div>
                  </div>
                  <div className="w-12 h-16 bg-white rounded border shadow-sm flex-shrink-0"></div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-muted-foreground">Template {resume.templateId}</span>
                  </div>
                  
                  {resume.isJobSpecific ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Personalizado para vaga
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Currículo geral
                    </Badge>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadPdfMutation.mutate({ resumeId: resume.id })}
                    disabled={downloadPdfMutation.isPending}
                    size="sm"
                    className="btn-primary flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {downloadPdfMutation.isPending ? 'Baixando...' : 'Baixar PDF'}
                  </Button>
                  
                  <Button
                    onClick={() => deleteResumeMutation.mutate(resume.id)}
                    disabled={deleteResumeMutation.isPending}
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600 hover:border-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) || []}

          {/* Create New Card */}
          <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center text-center min-h-[280px] p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Criar Novo Currículo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Para uma vaga específica ou perfil geral
              </p>
              <Button 
                onClick={() => setJobDialogOpen(true)}
                className="text-primary hover:text-primary/80 font-medium"
                variant="ghost"
              >
                Começar agora
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {(!resumes || resumes.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum currículo encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro currículo para começar a aplicar para vagas
              </p>
              <Button onClick={() => setJobDialogOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Currículo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
