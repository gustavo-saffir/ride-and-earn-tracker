import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DailyRecord } from "@/pages/Index";
import { toast } from "sonner";

interface EditRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: DailyRecord;
  onSave: (id: string, record: Omit<DailyRecord, "id">) => void;
}

const FUEL_PRICES = {
  gasoline: 5.89,
  ethanol: 3.99,
  cng: 4.50,
};

export function EditRecordDialog({
  open,
  onOpenChange,
  record,
  onSave,
}: EditRecordDialogProps) {
  const [revenue, setRevenue] = useState(record.revenue.toString());
  const [fuel, setFuel] = useState(record.fuel.toString());
  const [fuelType, setFuelType] = useState<"gasoline" | "ethanol" | "cng">(
    record.fuelType || "gasoline"
  );
  const [kilometers, setKilometers] = useState((record.kilometers || 0).toString());
  const [variableCosts, setVariableCosts] = useState(record.variableCosts.toString());

  const handleSave = () => {
    const revenueNum = parseFloat(revenue);
    const fuelNum = parseFloat(fuel);
    const kilometersNum = parseFloat(kilometers) || 0;
    const variableCostsNum = parseFloat(variableCosts);

    if (isNaN(revenueNum) || isNaN(fuelNum) || isNaN(variableCostsNum)) {
      toast.error("Valores inválidos");
      return;
    }

    const netProfit = revenueNum - fuelNum - variableCostsNum;
    const liters = kilometersNum > 0 ? fuelNum / FUEL_PRICES[fuelType] : 0;
    const fuelEfficiency = kilometersNum > 0 ? kilometersNum / liters : 0;

    onSave(record.id, {
      date: record.date,
      revenue: revenueNum,
      fuel: fuelNum,
      fuelType,
      kilometers: kilometersNum,
      fuelEfficiency,
      variableCosts: variableCostsNum,
      netProfit,
    });

    toast.success("Registro atualizado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Registro</DialogTitle>
          <DialogDescription>
            {new Date(record.date).toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-revenue">Receita (R$)</Label>
            <Input
              id="edit-revenue"
              type="number"
              step="0.01"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-fuel-type">Tipo de Combustível</Label>
            <Select value={fuelType} onValueChange={(v) => setFuelType(v as typeof fuelType)}>
              <SelectTrigger id="edit-fuel-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasolina</SelectItem>
                <SelectItem value="ethanol">Etanol</SelectItem>
                <SelectItem value="cng">GNV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-fuel">Combustível (R$)</Label>
            <Input
              id="edit-fuel"
              type="number"
              step="0.01"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-kilometers">Quilômetros Rodados</Label>
            <Input
              id="edit-kilometers"
              type="number"
              step="0.01"
              value={kilometers}
              onChange={(e) => setKilometers(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-variable">Custos Variáveis (R$)</Label>
            <Input
              id="edit-variable"
              type="number"
              step="0.01"
              value={variableCosts}
              onChange={(e) => setVariableCosts(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
