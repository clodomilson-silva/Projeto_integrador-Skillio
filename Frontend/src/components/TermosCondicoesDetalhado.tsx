import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Shield, Mail } from "lucide-react";

const TermosCondicoesDetalhado: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-4xl">
        <Card className="shadow-elevated bg-card/80 backdrop-blur-sm border-border/50">
          <div className="p-6 border-b border-border/50">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">Termos e Condições de Uso</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Última atualização: 11 de fevereiro de 2026
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)] px-6 py-4">
            <div className="space-y-6 pr-4">
              <section>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  Bem-vindo à plataforma <strong className="text-foreground">Skillio</strong>! 
                  Ao utilizar nossos serviços, você concorda com os seguintes termos e condições. 
                  Por favor, leia atentamente antes de prosseguir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">1.</span> Aceitação dos Termos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar e usar a plataforma Skillio, você aceita e concorda em estar vinculado 
                  a estes Termos e Condições de Uso. Se você não concordar com qualquer parte destes 
                  termos, não deve utilizar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">2.</span> Uso da Plataforma
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  O usuário deve utilizar a plataforma de forma ética e responsável:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Respeitar outros usuários e as regras de conduta estabelecidas</li>
                  <li>Não utilizar a plataforma para fins ilegais ou não autorizados</li>
                  <li>Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>Não tentar acessar áreas restritas ou comprometer a segurança do sistema</li>
                  <li>Fornecer informações verdadeiras e atualizadas durante o cadastro</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">3.</span> Proteção de Dados e Privacidade
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  A Skillio leva a sério a proteção de seus dados pessoais:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong className="text-foreground">Coleta de Dados:</strong> Coletamos dados pessoais apenas 
                    para fins de cadastro, personalização da experiência educacional e melhoria dos serviços
                  </li>
                  <li>
                    <strong className="text-foreground">Uso de Dados:</strong> Seus dados são utilizados 
                    exclusivamente para as finalidades informadas e nunca compartilhados com terceiros sem 
                    seu consentimento explícito
                  </li>
                  <li>
                    <strong className="text-foreground">Armazenamento:</strong> Implementamos medidas técnicas 
                    e organizacionais adequadas para proteger seus dados contra acesso não autorizado
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">4.</span> LGPD - Lei Geral de Proteção de Dados
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018). 
                  Como titular de dados, você tem os seguintes direitos:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Confirmar a existência de tratamento de seus dados pessoais</li>
                  <li>Acessar seus dados pessoais armazenados</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Revogar seu consentimento a qualquer momento</li>
                  <li>Obter informações sobre o compartilhamento de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">5.</span> Segurança da Conta
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Você é responsável por manter a confidencialidade de sua senha e conta. 
                  Recomendamos fortemente:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                  <li>Criar senhas fortes e únicas</li>
                  <li>Não compartilhar suas credenciais com terceiros</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                  <li>Fazer logout após usar dispositivos compartilhados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">6.</span> Conteúdo e Conduta
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  É estritamente proibido:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Publicar conteúdo ofensivo, difamatório, obsceno ou ilegal</li>
                  <li>Violar direitos autorais ou propriedade intelectual de terceiros</li>
                  <li>Assediar, intimidar ou discriminar outros usuários</li>
                  <li>Disseminar vírus, malware ou qualquer código malicioso</li>
                  <li>Realizar atividades fraudulentas ou enganosas</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  <strong className="text-foreground">Consequências:</strong> O descumprimento destas regras 
                  pode resultar em suspensão temporária ou exclusão permanente da conta, 
                  sem aviso prévio.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">7.</span> Propriedade Intelectual
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Todo o conteúdo presente na plataforma Skillio, incluindo textos, gráficos, 
                  logos, imagens, vídeos, áudios e software, é propriedade da Skillio ou de seus 
                  licenciadores e está protegido por leis de direitos autorais e propriedade intelectual.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">8.</span> Limitação de Responsabilidade
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Skillio não se responsabiliza por:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                  <li>Danos causados por uso indevido da plataforma</li>
                  <li>Informações fornecidas por terceiros ou outros usuários</li>
                  <li>Interrupções temporárias do serviço por manutenção ou falhas técnicas</li>
                  <li>Perda de dados resultante de problemas técnicos ou ações do usuário</li>
                  <li>Decisões tomadas com base no conteúdo educacional disponibilizado</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">9.</span> Modificações dos Termos
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação na plataforma. 
                  Recomendamos que você revise esta página periodicamente para se manter informado 
                  sobre eventuais atualizações.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="text-primary">10.</span> Lei Aplicável
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estes termos são regidos e interpretados de acordo com as leis da República 
                  Federativa do Brasil. Qualquer disputa relacionada a estes termos será 
                  submetida à jurisdição exclusiva dos tribunais brasileiros.
                </p>
              </section>

              <section className="border-t border-border/50 pt-6 mt-8">
                <h2 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contato e Suporte
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Para dúvidas, sugestões ou solicitações relacionadas a privacidade, 
                  uso de dados ou estes termos de uso:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                  <p className="text-foreground font-medium">Email:</p>
                  <a 
                    href="mailto:suporte@skillio.com.br" 
                    className="text-primary hover:underline"
                  >
                    suporte@skillio.com.br
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Responderemos sua solicitação em até 48 horas úteis.
                  </p>
                </div>
              </section>

              <section className="text-center pt-6 pb-4">
                <p className="text-sm text-muted-foreground">
                  Ao continuar usando a plataforma Skillio, você confirma que 
                  leu, entendeu e concordou com estes Termos e Condições.
                </p>
              </section>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-border/50 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Skillio. Todos os direitos reservados.
            </p>
            <Button onClick={() => navigate(-1)}>
              Voltar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermosCondicoesDetalhado;
