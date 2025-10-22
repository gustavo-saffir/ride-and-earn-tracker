import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyRecord } from "@/pages/Index";
import { Calendar, TrendingUp } from "lucide-react";

interface RecordsTabProps {
  records: DailyRecord[];
}

export function RecordsTab({ records }: RecordsTabProps) {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");

  const getFilteredRecords = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case "day":
        return records.filter(
          (r) => new Date(r.date).toDateString() === today.toDateString()
        );
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return records.filter((r) => new Date(r.date) >= weekAgo);
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return records.filter((r) => new Date(r.date) >= monthAgo);
      default:
        return records;
    }
  };

  const filteredRecords = getFilteredRecords();
  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.revenue, 0);
  const totalCosts = filteredRecords.reduce((sum, r) => sum + r.fuel + r.variableCosts, 0);
  const totalProfit = filteredRecords.reduce((sum, r) => sum + r.netProfit, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-success text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Custos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">R$ {totalCosts.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-primary text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {totalProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Histórico de Registros
          </CardTitle>
          <CardDescription>Visualize seus registros por período</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Hoje</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum registro encontrado neste período
                </p>
              ) : (
                filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 bg-gradient-card border rounded-lg space-y-2 hover:shadow-card transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {new Date(record.date).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={`text-xl font-bold ${
                          record.netProfit >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        R$ {record.netProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Receita</p>
                        <p className="font-semibold text-success">R$ {record.revenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Combustível</p>
                        <p className="font-semibold text-destructive">R$ {record.fuel.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Custos Var.</p>
                        <p className="font-semibold text-destructive">
                          R$ {record.variableCosts.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
