import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const { data: resumes } = useQuery({
    queryKey: ["/api/resumes"],
    enabled: !!user,
  });

  useEffect(() => {
    // If user doesn't have a profile, redirect to onboarding
    if (user && !isLoading && !profile) {
      setLocation("/onboarding");
    }
  }, [user, profile, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect to onboarding
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleGoToDashboard = () => {
    setLocation("/dashboard");
  };

  const handleCreateResume = () => {
    setLocation("/dashboard");
  };

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
              <Button onClick={handleGoToDashboard} variant="ghost">
                Meus Currículos
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo, {user?.firstName}! 👋
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Você tem {resumes?.length || 0} currículo{(resumes?.length || 0) !== 1 ? 's' : ''} criado{(resumes?.length || 0) !== 1 ? 's' : ''}
          </p>
          
          <Button onClick={handleCreateResume} size="lg" className="btn-primary text-lg px-8 py-4">
            <Plus className="w-5 h-5 mr-2" />
            Criar Novo Currículo
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{resumes?.length || 0}</h3>
              <p className="text-muted-foreground">Currículos Criados</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">95%</h3>
              <p className="text-muted-foreground">Taxa de Sucesso</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">1000+</h3>
              <p className="text-muted-foreground">Usuários Ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Resumes */}
        {resumes && resumes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Seus Currículos Recentes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.slice(0, 3).map((resume: any) => (
                <Card key={resume.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{resume.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Criado em {new Date(resume.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="w-12 h-16 bg-white rounded border shadow-sm"></div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Template {resume.templateId}
                      </div>
                      {resume.isJobSpecific && (
                        <div className="flex items-center text-sm text-primary">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          Personalizado para vaga
                        </div>
                      )}
                    </div>
                    
                    <Button onClick={handleGoToDashboard} className="w-full btn-primary">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Pronto para o próximo passo?</h2>
            <p className="text-muted-foreground mb-6">
              Crie currículos específicos para vagas ou melhore seu perfil profissional
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleGoToDashboard} size="lg" className="btn-primary">
                Acessar Dashboard
              </Button>
              <Button onClick={handleCreateResume} variant="outline" size="lg" className="btn-secondary">
                Criar Novo Currículo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
