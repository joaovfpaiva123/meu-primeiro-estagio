import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Square, Play, Pause, Trash2 } from "lucide-react";

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
  maxDuration?: number; // in seconds, default 300 (5 minutes)
}

export default function AudioRecorder({ onTranscription, maxDuration = 300 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      toast({
        title: "Gravação iniciada",
        description: "Fale naturalmente sobre seu projeto...",
      });

    } catch (error) {
      toast({
        title: "Erro ao acessar microfone",
        description: "Verifique se você permitiu o acesso ao microfone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast({
        title: "Gravação finalizada",
        description: "Você pode ouvir o áudio ou transcrever para texto.",
      });
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setIsPaused(false);
    
    toast({
      title: "Gravação excluída",
      description: "Você pode gravar novamente se desejar.",
    });
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast({
        title: "Nenhum áudio encontrado",
        description: "Grave um áudio primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsTranscribing(true);

    try {
      // Convert webm to wav for better compatibility
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Falha na transcrição');
      }

      const { text } = await response.json();
      
      if (text && text.trim()) {
        onTranscription(text.trim());
        toast({
          title: "Transcrição realizada",
          description: "O texto foi adicionado ao formulário.",
        });
      } else {
        toast({
          title: "Áudio não compreendido",
          description: "Tente gravar novamente falando mais claramente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na transcrição",
        description: "Não foi possível transcrever o áudio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingTime / maxDuration) * 100;

  return (
    <Card className="border-primary/20 bg-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Recording Status */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isRecording 
                ? 'bg-red-500/20 animate-pulse' 
                : audioBlob 
                ? 'bg-green-500/20' 
                : 'bg-primary/20'
            }`}>
              {isRecording ? (
                <Mic className="w-8 h-8 text-red-500" />
              ) : audioBlob ? (
                <Mic className="w-8 h-8 text-green-500" />
              ) : (
                <MicOff className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="text-lg font-semibold">
              {isRecording ? 'Gravando...' : audioBlob ? 'Gravação concluída' : 'Pronto para gravar'}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {isRecording ? (
                `${formatTime(recordingTime)} / ${formatTime(maxDuration)}`
              ) : audioBlob ? (
                `Duração: ${formatTime(recordingTime)}`
              ) : (
                `Máximo: ${formatTime(maxDuration)}`
              )}
            </div>
          </div>

          {/* Progress Bar for Recording */}
          {isRecording && (
            <div className="space-y-2">
              <Progress 
                value={progressPercentage} 
                className="progress-bar"
              />
              <div className="text-xs text-center text-muted-foreground">
                {progressPercentage >= 90 && "Tempo quase esgotado!"}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center space-x-3">
            {!audioBlob ? (
              <>
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Iniciar Gravação</span>
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Square className="w-4 h-4" />
                    <span>Parar</span>
                  </Button>
                )}
              </>
            ) : (
              <>
                {!isPlaying ? (
                  <Button
                    onClick={playAudio}
                    variant="outline"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isPaused ? 'Continuar' : 'Reproduzir'}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={pauseAudio}
                    variant="outline"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pausar</span>
                  </Button>
                )}
                
                <Button
                  onClick={transcribeAudio}
                  disabled={isTranscribing}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isTranscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transcrevendo...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Converter para Texto</span>
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={deleteRecording}
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:border-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Audio Element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => {
                setIsPlaying(false);
                setIsPaused(false);
              }}
              className="hidden"
            />
          )}

          {/* Help Text */}
          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>💡 Dica: Fale claramente e descreva seu projeto com detalhes</p>
            <p>Mencione tecnologias usadas, objetivos e resultados obtidos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
