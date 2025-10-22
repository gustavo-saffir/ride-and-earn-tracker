import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditRecordDialog } from "@/components/EditRecordDialog";
import { DailyRecord } from "@/pages/Index";
import { Calendar, Pencil, Trash2, Gauge } from "lucide-react";
import { toast } from "sonner";

interface RecordsTabProps {
  records: DailyRecord[];
  onUpdateRecord: (id: string, record: Omit<DailyRecord, "id">) => void;
  onDeleteRecord: (id: string) => void;
}

export function RecordsTab({ records, onUpdateRecord, onDeleteRecord }: RecordsTabProps) {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [editingRecord, setEditingRecord] = useState<DailyRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = () => {
    if (deletingId) {
      onDeleteRecord(deletingId);
      toast.success("Registro excluído com sucesso!");
      setDeletingId(null);
    }
  };

  const FUEL_LABELS = {
    gasoline: "Gasolina",
    ethanol: "Etanol",
    cng: "GNV",
  };

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
                    className="p-4 bg-gradient-card border rounded-lg space-y-3 hover:shadow-card transition-shadow"
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
                        <p className="text-muted-foreground">
                          Combustível ({record.fuelType ? FUEL_LABELS[record.fuelType] : "N/A"})
                        </p>
                        <p className="font-semibold text-destructive">R$ {record.fuel.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Custos Var.</p>
                        <p className="font-semibold text-destructive">
                          R$ {record.variableCosts.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {record.kilometers && record.fuelEfficiency ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <Gauge className="h-4 w-4" />
                        <span>
                          {record.kilometers.toFixed(0)} km rodados • {record.fuelEfficiency.toFixed(2)} km/L
                        </span>
                      </div>
                    ) : null}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRecord(record)}
                        className="flex-1"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingId(record.id)}
                        className="flex-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {editingRecord && (
        <EditRecordDialog
          open={!!editingRecord}
          onOpenChange={(open) => !open && setEditingRecord(null)}
          record={editingRecord}
          onSave={onUpdateRecord}
        />
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Registro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
