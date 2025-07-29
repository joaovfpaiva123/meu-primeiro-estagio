import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, Users, TrendingUp, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Meu Primeiro Estágio</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden md:block">
                Como Funciona
              </Button>
              <Button variant="ghost" className="hidden md:block">
                Templates
              </Button>
              <Button onClick={handleLogin} className="btn-primary">
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-muted opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Seu <span className="text-primary">primeiro currículo</span><br />
              criado por <span className="gradient-text">Inteligência Artificial</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ferramenta gratuita para universitários de exatas criarem currículos profissionais 
              otimizados com IA em minutos
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button onClick={handleLogin} size="lg" className="btn-primary text-lg px-8 py-4">
                Criar Meu Currículo Grátis
              </Button>
              <Button variant="outline" size="lg" className="btn-secondary text-lg px-8 py-4">
                Ver Templates
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-center">
              <div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Currículos Criados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Taxa de Aprovação</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">2min</div>
                <div className="text-sm text-muted-foreground">Tempo Médio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e rápido para criar seu currículo profissional
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="card-hover border-border p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Responda Perguntas Simples</h3>
                <p className="text-muted-foreground mb-6">
                  Informe seus dados básicos, universidade, curso e principais habilidades. 
                  Pode responder por texto ou áudio.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Nome completo e dados pessoais
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Universidade e curso
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Principais habilidades e projetos
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="card-hover border-border p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">IA Cria o Conteúdo</h3>
                <p className="text-muted-foreground mb-6">
                  Nossa inteligência artificial processa suas informações e cria 
                  um conteúdo profissional otimizado para recrutadores.
                </p>
                <div className="relative h-32 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-lg overflow-hidden flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="card-hover border-border p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Escolha o Template</h3>
                <p className="text-muted-foreground mb-6">
                  Selecione entre 3 templates profissionais e baixe seu currículo 
                  em PDF pronto para enviar.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-[3/4] bg-white rounded border-2 border-primary/50"></div>
                  <div className="aspect-[3/4] bg-muted rounded"></div>
                  <div className="aspect-[3/4] bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Pronto para criar seu primeiro currículo?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de universitários que já conseguiram seu primeiro estágio
          </p>
          
          <Button onClick={handleLogin} size="lg" className="btn-primary text-lg px-8 py-4">
            Começar Agora - É Grátis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              100% Gratuito
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              Sem cadastro complexo
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              Resultado em 2 minutos
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">Meu Primeiro Estágio</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Ferramenta gratuita para universitários de exatas criarem currículos profissionais com inteligência artificial.
              </p>
              <div className="text-sm text-muted-foreground">
                © 2024 Meu Primeiro Estágio. Todos os direitos reservados.
              </div>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Produto</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Suporte</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
