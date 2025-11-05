import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Target, Award, Heart, Lightbulb, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Aprendizado Gamificado",
      description: "Transformamos o estudo em uma experiência divertida e envolvente através de jogos educativos.",
      color: "knowledge"
    },
    {
      icon: Target,
      title: "Foco na Prática",
      description: "Milhares de questões práticas para fixar o conhecimento e testar suas habilidades.",
      color: "growth"
    },
    {
      icon: Award,
      title: "Sistema de Conquistas",
      description: "Ganhe pontos, desbloqueie medalhas e suba no ranking enquanto aprende.",
      color: "intellect"
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Conecte-se com outros estudantes, compartilhe conhecimento e cresça junto.",
      color: "wisdom"
    }
  ];

  const team = [
    {
      name: "Renã Eliakim",
      role: "CEO & Fundador",
      description: "Desenvolvedor Full-Stack."
    },
    {
      name: "Luã Hayalla",
      role: "CTO",
      description: "Desenvolvedor Front-End apaixonado por criar interfaces intuitivas e responsivas"
    },
    {
      name: "Thavynne Silva",
      role: "Diretora Pedagógica",
      description: "Doutora em Educação, responsável por todo o conteúdo educacional da plataforma."
    },
    {
      name: "Pedro Costa",
      role: "Designer UX/UI",
      description: "Especialista em design de interfaces educacionais intuitivas e acessíveis."
    },
    {
      name: "Diego Morgado",
      role: "Gestora de Conteúdo",
      description: "Coordena a criação de materiais didáticos e curadoria de conteúdo educacional."
    },
    {
      name: "Hellon Alves",
      role: "Desenvolvedor Backend",
      description: "Arquiteto de sistemas escaláveis e especialista em infraestrutura de dados."
    },
    {
      name: "Mirla Santos",
      role: "Analista de Dados",
      description: "Transforma métricas de aprendizado em insights valiosos para melhorar a plataforma."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const cardsToShow = 3;
  const maxSlide = team.length - cardsToShow;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-primary rounded-full shadow-glow">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre o{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Skillio
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Revolucionando a educação através da gamificação, tornando o aprendizado 
              mais divertido, eficiente e acessível para todos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white shadow-orange-glow">
                  <Users className="mr-2 h-5 w-5" />
                  Junte-se a Nós
                </Button>
              </Link>
              <Link to="/subjects">
                <Button variant="outline" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explorar Disciplinas
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nossa{" "}
                <span className="bg-gradient-wisdom bg-clip-text text-transparent">
                  Missão
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Democratizar o acesso à educação de qualidade, criando uma plataforma 
                que torna o aprendizado envolvente, personalizado e eficaz para estudantes 
                de todas as idades e níveis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-elevated transition-shadow bg-card/80 backdrop-blur-sm">
                    <div className={`mx-auto w-16 h-16 bg-gradient-${feature.color} rounded-full flex items-center justify-center mb-4 shadow-${feature.color === 'knowledge' ? 'glow' : feature.color === 'growth' ? 'cyan-glow' : feature.color === 'intellect' ? 'golden-glow' : 'orange-glow'}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nossos{" "}
                <span className="bg-gradient-intellect bg-clip-text text-transparent">
                  Valores
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-knowledge rounded-full flex items-center justify-center mb-4 shadow-glow">
                  <Lightbulb className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-knowledge">Inovação</h3>
                <p className="text-muted-foreground">
                  Sempre buscando novas formas de tornar o aprendizado mais eficiente e divertido.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-growth rounded-full flex items-center justify-center mb-4 shadow-cyan-glow">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">Inclusão</h3>
                <p className="text-muted-foreground">
                  Educação acessível e de qualidade para todos, independente de origem ou condição.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-wisdom rounded-full flex items-center justify-center mb-4 shadow-orange-glow">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-wisdom">Paixão</h3>
                <p className="text-muted-foreground">
                  Movidos pela paixão de transformar vidas através da educação e do conhecimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nossa{" "}
                <span className="bg-gradient-growth bg-clip-text text-transparent">
                  Equipe
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Conheça as pessoas apaixonadas por educação que tornam o EdGame possível.
              </p>
            </div>

            {/* Carrossel */}
            <div className="relative">
              {/* Botão Anterior */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-glow transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Container do Carrossel */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)` }}
                >
                  {team.map((member, index) => (
                    <div 
                      key={index} 
                      className="w-full md:w-1/3 flex-shrink-0 px-4"
                    >
                      <Card className="p-6 text-center hover:shadow-elevated transition-shadow bg-card/80 backdrop-blur-sm h-full">
                        <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center shadow-glow">
                          <Users className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                        <p className="text-primary font-medium mb-3">{member.role}</p>
                        <p className="text-muted-foreground text-sm">{member.description}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão Próximo */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary hover:bg-primary/90 text-white rounded-full p-3 shadow-glow transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Próximo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Transformar
              </span>
              {" "}seu Aprendizado?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a milhares de estudantes que já descobriram uma nova forma de aprender.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white shadow-orange-glow">
                <BookOpen className="mr-2 h-5 w-5" />
                Começar Agora - É Grátis!
              </Button>
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
};

export default About;