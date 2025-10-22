import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardTab } from "@/components/DashboardTab";
import { RecordsTab } from "@/components/RecordsTab";
import { ChartsTab } from "@/components/ChartsTab";
import { GoalsTab } from "@/components/GoalsTab";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Car, Settings } from "lucide-react";

export interface DailyRecord {
  id: string;
  date: string;
  revenue: number;
  fuel: number;
  fuelType?: "gasoline" | "ethanol" | "cng";
  kilometers?: number;
  fuelEfficiency?: number;
  variableCosts: number;
  netProfit: number;
}

export interface UserSettings {
  weeklyGoal: number;
  dayOff: number; // 0-6 (Sunday-Saturday)
}

const Index = () => {
  const [records, setRecords] = useState<DailyRecord[]>(() => {
    const stored = localStorage.getItem("driver-records");
    return stored ? JSON.parse(stored) : [];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const stored = localStorage.getItem("driver-settings");
    return stored ? JSON.parse(stored) : { weeklyGoal: 1000, dayOff: 0 };
  });

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("driver-records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("driver-settings", JSON.stringify(settings));
  }, [settings]);

  const addRecord = (record: Omit<DailyRecord, "id">) => {
    const newRecord = {
      ...record,
      id: crypto.randomUUID(),
    };
    setRecords([newRecord, ...records]);
  };

  const updateRecord = (id: string, updatedRecord: Omit<DailyRecord, "id">) => {
    setRecords(records.map(record => 
      record.id === id ? { ...updatedRecord, id } : record
    ));
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Controle Financeiro</h1>
                <p className="text-sm opacity-90">Gerencie seus ganhos como motorista</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="records">Registros</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab records={records} onAddRecord={addRecord} />
          </TabsContent>

          <TabsContent value="records">
            <RecordsTab 
              records={records} 
              onUpdateRecord={updateRecord}
              onDeleteRecord={deleteRecord}
            />
          </TabsContent>

          <TabsContent value="charts">
            <ChartsTab records={records} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalsTab records={records} settings={settings} />
          </TabsContent>
        </Tabs>
      </main>

      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
};

export default Index;
