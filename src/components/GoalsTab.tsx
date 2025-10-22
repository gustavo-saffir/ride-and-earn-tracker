import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DailyRecord, UserSettings } from "@/pages/Index";
import { Target, Calendar, TrendingUp, Lightbulb, Coffee } from "lucide-react";

interface GoalsTabProps {
  records: DailyRecord[];
  settings: UserSettings;
}

const DAYS_NAMES = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado"
];

export function GoalsTab({ records, settings }: GoalsTabProps) {
  const WEEKLY_GOAL = settings.weeklyGoal;
  const DAY_OFF = settings.dayOff;

  const getWeekRecords = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return records.filter((r) => new Date(r.date) >= startOfWeek);
  };

  const weekRecords = getWeekRecords();
  const weeklyTotal = weekRecords.reduce((sum, r) => sum + r.netProfit, 0);
  const progress = Math.min((weeklyTotal / WEEKLY_GOAL) * 100, 100);
  const remaining = Math.max(WEEKLY_GOAL - weeklyTotal, 0);

  const now = new Date();
  const currentDay = now.getDay();
  
  // Calculate days until next week starts
  const daysUntilWeekEnd = DAY_OFF >= currentDay 
    ? DAY_OFF - currentDay 
    : 7 - currentDay + DAY_OFF;
  
  // Calculate working days left (excluding day off)
  const workingDaysLeft = Math.max(daysUntilWeekEnd - (currentDay === DAY_OFF ? 0 : 0), 0);
  const dailyTarget = workingDaysLeft > 0 ? remaining / workingDaysLeft : 0;

  const motivationalMessage = () => {
    if (progress >= 100) return "🎉 Meta atingida! Parabéns pelo excelente trabalho!";
    if (progress >= 80) return "💪 Quase lá! Mantenha o ritmo!";
    if (progress >= 60) return "🚀 Você está no caminho certo!";
    if (progress >= 40) return "⚡ Continue firme, você consegue!";
    return "🔥 Vamos lá! Cada corrida conta!";
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card bg-gradient-primary text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6" />
            Meta Semanal
          </CardTitle>
          <CardDescription className="text-white/90">
            Acompanhe seu progresso em direção à meta de R$ {WEEKLY_GOAL.toFixed(2)}/semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span className="font-bold">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <p className="text-sm opacity-90">Ganho Atual</p>
              <p className="text-2xl font-bold">R$ {weeklyTotal.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <p className="text-sm opacity-90">Falta para Meta</p>
              <p className="text-2xl font-bold">R$ {remaining.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur text-center">
            <p className="text-lg font-semibold">{motivationalMessage()}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Planejamento Semanal
          </CardTitle>
          <CardDescription>
            Trabalhe 6 dias com folga {DAY_OFF === 0 ? "no domingo" : `na ${DAYS_NAMES[DAY_OFF].toLowerCase()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              const isWeekend = day === 0 || day === 6;
              const isDayOff = day === DAY_OFF;
              const suggestedAmount = isDayOff 
                ? null 
                : isWeekend 
                  ? (WEEKLY_GOAL * 0.2).toFixed(0) + "-" + (WEEKLY_GOAL * 0.25).toFixed(0)
                  : (WEEKLY_GOAL * 0.14).toFixed(0) + "-" + (WEEKLY_GOAL * 0.16).toFixed(0);

              if (isDayOff) {
                return (
                  <div key={day} className="p-3 bg-gradient-primary text-white rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-5 w-5" />
                      <span className="font-medium">{DAYS_NAMES[day]} - Dia de Folga!</span>
                    </div>
                    <span className="font-bold">Descanso</span>
                  </div>
                );
              }

              return (
                <div 
                  key={day} 
                  className={isWeekend 
                    ? "p-3 bg-gradient-success text-white rounded-lg flex justify-between items-center"
                    : "p-3 bg-secondary rounded-lg flex justify-between items-center"
                  }
                >
                  <span className={isWeekend ? "font-medium" : "font-medium"}>
                    {DAYS_NAMES[day]} {isWeekend && day !== DAY_OFF ? "(Melhor dia!)" : ""}
                  </span>
                  <span className={isWeekend ? "font-bold" : "text-primary font-bold"}>
                    R$ {suggestedAmount}/dia
                  </span>
                </div>
              );
            })}
          </div>

          {workingDaysLeft > 0 && (
            <div className="mt-6 p-4 bg-accent/20 border-l-4 border-accent rounded-lg">
              <p className="font-semibold text-lg">
                Meta diária ajustada: R$ {dailyTarget.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Para atingir a meta semanal nos próximos {workingDaysLeft} dia(s) útil(eis)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Estratégias para Maximizar Ganhos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-card border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Horários de Pico
            </h4>
            <p className="text-sm text-muted-foreground">
              Foque em horários de rush: 7h-9h, 12h-14h e 18h-20h. Fins de semana são melhores
              para corridas mais longas e maior faturamento.
            </p>
          </div>

          <div className="p-4 bg-gradient-card border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Economia de Combustível
            </h4>
            <p className="text-sm text-muted-foreground">
              Mantenha velocidade constante, calibre os pneus semanalmente e planeje rotas
              eficientes. Isso pode reduzir seus custos em até 20%.
            </p>
          </div>

          <div className="p-4 bg-gradient-card border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Manutenção Preventiva
            </h4>
            <p className="text-sm text-muted-foreground">
              Use o domingo para revisar o veículo, lavar o carro e planejar a semana. Um carro
              bem cuidado reduz custos e aumenta avaliações positivas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
