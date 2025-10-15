import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLessonAI } from '@/hooks/useLessonAI';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Loader2, PlayCircle } from 'lucide-react';
import { trilhaPrincipal } from "@/data/trilhaPrincipal";
import { subjects } from "@/data/subjects";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/api/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Helper para extrair o ID do vídeo do YouTube de vários formatos de URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      }
      // Checa também por URLs de embed
      const pathParts = urlObj.pathname.split('/');
      if (pathParts[1] === 'embed') {
        return pathParts[2];
      }
    }
  } catch (e) {
    console.error("URL do YouTube inválida:", url, e);
    return null;
  }
  return null;
};

interface Video {
  title: string;
  url: string;
}

const Lesson = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const educationalLevel = localStorage.getItem('userEducationalLevel') || 'Ensino Médio';

  const [userFocus, setUserFocus] = useState('Conhecimentos Gerais');
  const [isLoadingFocus, setIsLoadingFocus] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchUserFocus = async () => {
      if (isAuthenticated) {
        setIsLoadingFocus(true);
        try {
          const response = await apiClient.get('/users/me/');
          if (response.data.profile && response.data.profile.focus) {
            setUserFocus(response.data.profile.focus);
          }
        } catch (error) {
          console.error("Failed to fetch user focus", error);
        } finally {
          setIsLoadingFocus(false);
        }
      } else {
        setIsLoadingFocus(false);
      }
    };
    fetchUserFocus();
  }, [isAuthenticated]);

  const trilhaBloco = trilhaPrincipal.flatMap(n => n.blocos).find(b => b.id === subjectId);
  const subjectInfo = subjects.find(s => s.id === subjectId);

  let displayTitle: string;
  let subjectForAI: string;

  if (trilhaBloco) { // It's a trail game
    if (trilhaBloco.tipo === 'foco') {
      displayTitle = userFocus;
      subjectForAI = userFocus;
    } else {
      displayTitle = trilhaBloco.titulo;
      subjectForAI = trilhaBloco.titulo;
    }
  } else if (subjectInfo) { // It's a subject game
    displayTitle = subjectInfo.name;
    subjectForAI = subjectInfo.name;
  } else {
    displayTitle = subjectId || 'Tópico Desconhecido';
    subjectForAI = subjectId || 'Conhecimentos Gerais';
  }
  
  const { generatedLesson, loading: isLoadingLesson, error, refetch } = useLessonAI(subjectForAI, educationalLevel, !isLoadingFocus);

  if (isLoadingFocus || isLoadingLesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            {isLoadingFocus ? "Buscando suas preferências..." : `Gerando sua aula de ${displayTitle}...`}
          </h2>
          <Progress value={null} className="h-3 w-full animate-pulse" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Erro ao gerar a aula</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="game" onClick={refetch}>Tentar Novamente</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </Link>

        <main className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
                Aula de {displayTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {generatedLesson?.lesson}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vídeos Sugeridos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedLesson?.videos && generatedLesson.videos.map((video, index) => {
                const videoId = getYouTubeVideoId(video.url);
                if (!videoId) {
                  return (
                    <div key={index} className="p-4 border rounded-lg text-red-500">
                      <p>Link de vídeo inválido: {video.url}</p>
                    </div>
                  );
                }
                return (
                  <div key={index} className="cursor-pointer group" onClick={() => setSelectedVideo(video)}>
                    <div className="relative aspect-video overflow-hidden rounded-lg border shadow-lg mb-2">
                      <img src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm text-center">{video.title}</h3>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button size="lg" className="bg-gradient-knowledge shadow-glow" onClick={() => navigate(`/game/${subjectId}`)}>
              Iniciar Quiz
            </Button>
          </div>
        </main>
      </div>

      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl w-full p-0 border-0">
            <DialogHeader className="p-4">
              <DialogTitle>{selectedVideo.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Vídeo sobre {selectedVideo.title}. O player do YouTube está incorporado abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(selectedVideo.url)}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Lesson;
