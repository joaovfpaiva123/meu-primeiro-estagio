import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { onboardingSchema, type OnboardingData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { FileText, Mic, MicOff, Upload, ArrowLeft, ArrowRight } from "lucide-react";
import OnboardingForm from "@/components/OnboardingForm";
import AudioRecorder from "@/components/AudioRecorder";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      university: "",
      course: "",
      skills: "",
      relevantProject: "",
      hasExistingResume: false,
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      return await apiRequest("POST", "/api/onboarding", formData);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Seu perfil foi criado com sucesso. Redirecionando para o dashboard...",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao criar perfil. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: OnboardingData) => {
    onboardingMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Meu Primeiro Estágio</span>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Passo {currentStep} de 4</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="progress-bar" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <OnboardingForm 
                    form={form}
                    step="initial"
                    title="Você já possui um currículo que deseja aprimorar?"
                  />
                )}

                {currentStep === 2 && (
                  <OnboardingForm 
                    form={form}
                    step="personal"
                    title="Conte-nos sobre você"
                  />
                )}

                {currentStep === 3 && (
                  <OnboardingForm 
                    form={form}
                    step="academic"
                    title="Informações Acadêmicas"
                  />
                )}

                {currentStep === 4 && (
                  <OnboardingForm 
                    form={form}
                    step="experience"  
                    title="Experiência e Projetos"
                  />
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={onboardingMutation.isPending}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {onboardingMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Criando perfil...</span>
                        </>
                      ) : (
                        <>
                          <span>Finalizar</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
