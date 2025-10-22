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
import { UserSettings } from "@/pages/Index";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

const DAYS = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
];

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: SettingsDialogProps) {
  const [weeklyGoal, setWeeklyGoal] = useState(settings.weeklyGoal.toString());
  const [dayOff, setDayOff] = useState(settings.dayOff.toString());

  const handleSave = () => {
    const goal = parseFloat(weeklyGoal);
    if (isNaN(goal) || goal <= 0) {
      toast.error("Meta semanal inválida");
      return;
    }

    onSave({
      weeklyGoal: goal,
      dayOff: parseInt(dayOff),
    });

    toast.success("Configurações salvas com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Personalize sua meta semanal e dia de folga
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="weekly-goal">Meta Semanal (R$)</Label>
            <Input
              id="weekly-goal"
              type="number"
              step="0.01"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(e.target.value)}
              placeholder="1000.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day-off">Dia de Folga</Label>
            <Select value={dayOff} onValueChange={setDayOff}>
              <SelectTrigger id="day-off">
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
