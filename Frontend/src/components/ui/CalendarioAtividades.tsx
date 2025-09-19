import * as React from 'react';
import { DayPicker, type DayContentProps } from 'react-day-picker';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Tipos de dados
type Activity = {
  date: Date;
  type: 'pratica' | 'falha';
};

// Função para gerar dados mockados
const generateMockData = (): Activity[] => {
  const data: Activity[] = [];
  const today = new Date();
  for (let i = 0; i < 90; i++) { // Gerar dados para os últimos 90 dias
    const date = new Date();
    date.setDate(today.getDate() - i);
    const random = Math.random();
    if (random < 0.6) { // 60% de chance de ter praticado
      data.push({ date, type: 'pratica' });
    } else if (random < 0.8) { // 20% de chance de ter falhado
      data.push({ date, type: 'falha' });
    }
  }
  return data;
};

// Função para calcular estatísticas
const calculateStats = (activities: Activity[]) => {
    const sortedActivities = [...activities].sort((a, b) => a.date.getTime() - b.date.getTime());
    let longestPracticeStreak = 0;
    let currentPracticeStreak = 0;
    let longestFailureStreak = 0;
    let currentFailureStreak = 0;
    const totalPracticeDays = activities.filter(a => a.type === 'pratica').length;
    let lastDate: Date | null = null;

    sortedActivities.forEach(activity => {
        const currentDate = new Date(activity.date.getFullYear(), activity.date.getMonth(), activity.date.getDate());
        const lastDateOnly = lastDate ? new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()) : null;

        if (activity.type === 'pratica') {
            if (lastDateOnly && (currentDate.getTime() - lastDateOnly.getTime()) / (1000 * 3600 * 24) === 1) {
                currentPracticeStreak++;
            } else {
                currentPracticeStreak = 1;
            }
            longestPracticeStreak = Math.max(longestPracticeStreak, currentPracticeStreak);
            currentFailureStreak = 0;
        } else if (activity.type === 'falha') {
            if (lastDateOnly && (currentDate.getTime() - lastDateOnly.getTime()) / (1000 * 3600 * 24) === 1) {
                currentFailureStreak++;
            } else {
                currentFailureStreak = 1;
            }
            longestFailureStreak = Math.max(longestFailureStreak, currentFailureStreak);
            currentPracticeStreak = 0;
        }
        lastDate = activity.date;
    });

    return { longestPracticeStreak, longestFailureStreak, totalPracticeDays };
};

function CustomDayContent(props: DayContentProps) {
    const { activeModifiers: modifiers, date } = props;
    const isOutside = modifiers.outside;

    return (
        <div className={cn("relative flex flex-col items-center justify-center w-full h-full", {
            "font-bold text-primary": modifiers.today && !isOutside
        })}>
            <span>{date.getDate()}</span>
            {!isOutside && (modifiers.practice || modifiers.failure) && (
                <div className="absolute -bottom-1">
                    <Flame className={cn(
                        "h-4 w-4",
                        modifiers.practice && "text-orange-500",
                        modifiers.failure && "text-sky-500"
                    )} />
                </div>
            )}
        </div>
    );
}

export const CalendarioAtividades = () => {
  const activities = React.useMemo(() => generateMockData(), []);
  const stats = React.useMemo(() => calculateStats(activities), [activities]);

  const practiceDays = activities.filter(a => a.type === 'pratica').map(a => a.date);
  const failureDays = activities.filter(a => a.type === 'falha').map(a => a.date);

  return (
    <Card className="p-4 sm:p-6 flex flex-col gap-4 col-span-1 md:col-span-2 bg-gradient-subtle shadow-elegant">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-primary">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
          Meu Calendário de Atividades
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex justify-center">
          <DayPicker
            mode="multiple"
            locale={ptBR}
            showOutsideDays
            fixedWeeks
            modifiers={{
              practice: practiceDays,
              failure: failureDays,
            }}
            classNames={{
                root: 'p-3',
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                  buttonVariants({ variant: 'outline' }),
                  'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-10 w-10 text-center text-sm p-0',
                day: 'h-10 w-10 p-0 font-normal',
                day_today: 'text-primary',
                day_outside: 'text-muted-foreground opacity-50',
                day_disabled: 'text-muted-foreground opacity-50',
                day_hidden: 'invisible',
            }}
            components={{
                DayContent: CustomDayContent,
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
          />
        </div>
        <div className="flex flex-col gap-4 justify-center lg:border-l lg:pl-6">
          <h3 className="text-lg font-semibold mb-2 text-center lg:text-left">Estatísticas de Atividade</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-500 flex-shrink-0" />
                <div>
                    <p className="font-bold text-2xl">{stats.longestPracticeStreak}</p>
                    <p className="text-sm text-muted-foreground">Maior sequência de práticas</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <Flame className="h-8 w-8 text-sky-500 flex-shrink-0" />
                <div>
                    <p className="font-bold text-2xl">{stats.longestFailureStreak}</p>
                    <p className="text-sm text-muted-foreground">Maior sequência de falhas</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                    <p className="font-bold text-2xl">{stats.totalPracticeDays}</p>
                    <p className="text-sm text-muted-foreground">Total de dias praticados</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};