import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLessonAI } from '@/hooks/useLessonAI';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { trilhaPrincipal } from "@/data/trilhaPrincipal";
import { subjects } from "@/data/subjects";

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

const Lesson = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const educationalLevel = localStorage.getItem('userEducationalLevel') || 'Ensino Médio';

  const trilhaBloco = trilhaPrincipal.flatMap(n => n.blocos).find(b => b.id === subjectId);
  const subjectInfo = subjects.find(s => s.id === subjectId);

  let displayTitle: string;
  let subjectForAI: string;

  if (trilhaBloco) { // It's a trail game
    const userFocus = localStorage.getItem('userFocus') || 'Conhecimentos Gerais';
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
  
  const { generatedLesson, loading, error, refetch } = useLessonAI(subjectForAI, educationalLevel);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Gerando sua aula de {displayTitle}...</h2>
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
          <CardContent className="space-y-8">
            {generatedLesson?.videos && generatedLesson.videos.map((video, index) => {
              const videoId = getYouTubeVideoId(video.url);
              if (!videoId) {
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-red-500">Não foi possível carregar o vídeo a partir do link: {video.url}</p>
                  </div>
                );
              }
              return (
                <div key={index}>
                  <h3 className="font-semibold text-lg mb-3">{video.title}</h3>
                  <div className="aspect-video overflow-hidden rounded-lg border shadow-lg mb-2">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Não consegue ver o vídeo? Clique aqui para abrir no YouTube.
                  </a>
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
  );
};

export default Lesson;
