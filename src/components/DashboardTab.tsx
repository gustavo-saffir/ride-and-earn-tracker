import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DailyRecord } from "@/pages/Index";
import { toast } from "sonner";
import { TrendingUp, Fuel, DollarSign, Wallet } from "lucide-react";

interface DashboardTabProps {
  records: DailyRecord[];
  onAddRecord: (record: Omit<DailyRecord, "id">) => void;
}

export function DashboardTab({ records, onAddRecord }: DashboardTabProps) {
  const [revenue, setRevenue] = useState("");
  const [fuel, setFuel] = useState("");
  const [variableCosts, setVariableCosts] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const revenueNum = parseFloat(revenue) || 0;
    const fuelNum = parseFloat(fuel) || 0;
    const variableCostsNum = parseFloat(variableCosts) || 0;
    const netProfit = revenueNum - fuelNum - variableCostsNum;

    onAddRecord({
      date: new Date().toISOString(),
      revenue: revenueNum,
      fuel: fuelNum,
      variableCosts: variableCostsNum,
      netProfit,
    });

    toast.success("Registro adicionado com sucesso!", {
      description: `Lucro líquido: R$ ${netProfit.toFixed(2)}`,
    });

    setRevenue("");
    setFuel("");
    setVariableCosts("");
  };

  const todayRecords = records.filter(
    (r) => new Date(r.date).toDateString() === new Date().toDateString()
  );

  const todayTotal = todayRecords.reduce((sum, r) => sum + r.netProfit, 0);
  const todayRevenue = todayRecords.reduce((sum, r) => sum + r.revenue, 0);
  const todayCosts = todayRecords.reduce((sum, r) => sum + r.fuel + r.variableCosts, 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-card hover:shadow-hover transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Registro Diário
          </CardTitle>
          <CardDescription>Adicione suas receitas e despesas do dia</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Receita (R$)</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel">Combustível (R$)</Label>
              <Input
                id="fuel"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable">Custos Variáveis (R$)</Label>
              <Input
                id="variable"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={variableCosts}
                onChange={(e) => setVariableCosts(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-primary">
              Adicionar Registro
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Resumo de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Receita Total</span>
              <span className="text-xl font-bold text-success">
                R$ {todayRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Custos Totais</span>
              <span className="text-xl font-bold text-destructive">
                R$ {todayCosts.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-primary rounded-lg text-white">
              <span className="font-semibold">Lucro Líquido</span>
              <span className="text-2xl font-bold">
                R$ {todayTotal.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Últimos Registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            {records.slice(0, 5).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum registro ainda
              </p>
            ) : (
              <div className="space-y-2">
                {records.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                  >
                    <span className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span
                      className={`font-semibold ${
                        record.netProfit >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      R$ {record.netProfit.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
