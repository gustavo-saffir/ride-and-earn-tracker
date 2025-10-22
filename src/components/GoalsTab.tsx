import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DailyRecord } from "@/pages/Index";
import { Target, Calendar, TrendingUp, Lightbulb, Coffee } from "lucide-react";

interface GoalsTabProps {
  records: DailyRecord[];
}

export function GoalsTab({ records }: GoalsTabProps) {
  const WEEKLY_GOAL = 1000;

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
  const daysUntilSunday = 7 - now.getDay();
  const workingDaysLeft = daysUntilSunday === 7 ? 0 : Math.max(daysUntilSunday - 1, 0);
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
            Acompanhe seu progresso em direção à meta de R$ 1.000/semana
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
          <CardDescription>Trabalhe 5-6 dias com folga no domingo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-secondary rounded-lg flex justify-between items-center">
              <span className="font-medium">Segunda a Quinta</span>
              <span className="text-primary font-bold">R$ 160-180/dia</span>
            </div>
            <div className="p-3 bg-secondary rounded-lg flex justify-between items-center">
              <span className="font-medium">Sexta</span>
              <span className="text-primary font-bold">R$ 180-220/dia</span>
            </div>
            <div className="p-3 bg-gradient-success text-white rounded-lg flex justify-between items-center">
              <span className="font-medium">Sábado (Melhor dia!)</span>
              <span className="font-bold">R$ 200-250/dia</span>
            </div>
            <div className="p-3 bg-gradient-primary text-white rounded-lg flex justify-between items-center">
              <Coffee className="h-5 w-5" />
              <span className="font-medium">Domingo - Dia de Folga!</span>
              <span className="font-bold">Descanso</span>
            </div>
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
