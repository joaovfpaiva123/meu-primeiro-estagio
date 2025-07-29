import { UseFormReturn } from "react-hook-form";
import { OnboardingData } from "@shared/schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Mic } from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import { useState } from "react";

interface OnboardingFormProps {
  form: UseFormReturn<OnboardingData>;
  step: "initial" | "personal" | "academic" | "experience";
  title: string;
}

export default function OnboardingForm({ form, step, title }: OnboardingFormProps) {
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  if (step === "initial") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        </div>
        
        <FormField
          control={form.control}
          name="hasExistingResume"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-4">
                <Card 
                  className={`cursor-pointer transition-all ${!field.value ? 'border-primary bg-primary/5' : 'border-border'}`}
                  onClick={() => field.onChange(false)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox checked={!field.value} onChange={() => field.onChange(false)} />
                      <div>
                        <h3 className="font-semibold">Não, quero criar do zero</h3>
                        <p className="text-sm text-muted-foreground">
                          Vamos criar seu primeiro currículo profissional com IA
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${field.value ? 'border-primary bg-primary/5' : 'border-border'}`}
                  onClick={() => field.onChange(true)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox checked={field.value} onChange={() => field.onChange(true)} />
                      <div>
                        <h3 className="font-semibold">Sim, tenho um currículo existente</h3>
                        <p className="text-sm text-muted-foreground">
                          Faça upload para que possamos melhorá-lo com IA
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("hasExistingResume") && (
          <FormField
            control={form.control}
            name="existingResumeFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload do Currículo Existente</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Clique ou arraste seu currículo aqui
                    </p>
                    <Button type="button" variant="outline">
                      Escolher Arquivo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    );
  }

  if (step === "personal") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: João Silva Santos" 
                    className="form-input"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="joao@exemplo.com" 
                    className="form-input"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(11) 99999-9999" 
                  className="form-input"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  if (step === "academic") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Universidade *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: USP, UFRJ, UFMG..." 
                    className="form-input"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curso *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Selecione seu curso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="engenharia-computacao">Engenharia da Computação</SelectItem>
                    <SelectItem value="ciencia-computacao">Ciência da Computação</SelectItem>
                    <SelectItem value="engenharia-civil">Engenharia Civil</SelectItem>
                    <SelectItem value="engenharia-eletrica">Engenharia Elétrica</SelectItem>
                    <SelectItem value="engenharia-mecanica">Engenharia Mecânica</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="quimica">Química</SelectItem>
                    <SelectItem value="estatistica">Estatística</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Principais Habilidades *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Python, JavaScript, React, Machine Learning, Análise de Dados..." 
                  rows={3}
                  className="form-input resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  if (step === "experience") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        </div>

        <FormField
          control={form.control}
          name="relevantProject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descreva um projeto relevante *</FormLabel>
              <div className="flex items-center space-x-4 mb-3">
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAudioRecorder(!showAudioRecorder)}
                  className="flex items-center space-x-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Gravar áudio</span>
                </Button>
                <span className="text-sm text-muted-foreground">ou digite abaixo</span>
              </div>
              
              {showAudioRecorder && (
                <div className="mb-4">
                  <AudioRecorder 
                    onTranscription={(text) => {
                      field.onChange(text);
                      setShowAudioRecorder(false);
                    }}
                  />
                </div>
              )}
              
              <FormControl>
                <Textarea 
                  placeholder="Descreva um projeto acadêmico, pesquisa, iniciação científica ou projeto pessoal. Inclua tecnologias usadas, objetivos e resultados..." 
                  rows={6}
                  className="form-input resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  return null;
}
