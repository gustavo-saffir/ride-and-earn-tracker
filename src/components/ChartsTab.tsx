import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyRecord } from "@/pages/Index";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";

interface ChartsTabProps {
  records: DailyRecord[];
}

export function ChartsTab({ records }: ChartsTabProps) {
  const last7Days = records
    .slice(0, 7)
    .reverse()
    .map((record) => ({
      date: new Date(record.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      receita: record.revenue,
      custos: record.fuel + record.variableCosts,
      lucro: record.netProfit,
    }));

  const weeklyData = (() => {
    const weeks: { [key: string]: { receita: number; custos: number; lucro: number } } = {};
    
    records.forEach((record) => {
      const date = new Date(record.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { receita: 0, custos: 0, lucro: 0 };
      }
      
      weeks[weekKey].receita += record.revenue;
      weeks[weekKey].custos += record.fuel + record.variableCosts;
      weeks[weekKey].lucro += record.netProfit;
    });

    return Object.entries(weeks)
      .map(([semana, data]) => ({ semana, ...data }))
      .slice(0, 4)
      .reverse();
  })();

  if (records.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Adicione registros para visualizar os gráficos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-card hover:shadow-hover transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evolução Diária (Últimos 7 dias)
          </CardTitle>
          <CardDescription>Acompanhe o desempenho dos últimos dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                name="Receita"
              />
              <Line
                type="monotone"
                dataKey="custos"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="Custos"
              />
              <Line
                type="monotone"
                dataKey="lucro"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Lucro"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-hover transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Comparação Semanal
          </CardTitle>
          <CardDescription>Compare o desempenho das últimas semanas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="semana" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="receita" fill="hsl(var(--success))" name="Receita" />
              <Bar dataKey="custos" fill="hsl(var(--destructive))" name="Custos" />
              <Bar dataKey="lucro" fill="hsl(var(--primary))" name="Lucro" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
