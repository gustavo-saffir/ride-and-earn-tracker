import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "@/components/DashboardTab";
import { RecordsTab } from "@/components/RecordsTab";
import { ChartsTab } from "@/components/ChartsTab";
import { GoalsTab } from "@/components/GoalsTab";
import { Car } from "lucide-react";

export interface DailyRecord {
  id: string;
  date: string;
  revenue: number;
  fuel: number;
  variableCosts: number;
  netProfit: number;
}

const Index = () => {
  const [records, setRecords] = useState<DailyRecord[]>(() => {
    const stored = localStorage.getItem("driver-records");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("driver-records", JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<DailyRecord, "id">) => {
    const newRecord = {
      ...record,
      id: crypto.randomUUID(),
    };
    setRecords([newRecord, ...records]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-primary text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Controle Financeiro</h1>
              <p className="text-sm opacity-90">Gerencie seus ganhos como motorista</p>
            </div>
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
            <RecordsTab records={records} />
          </TabsContent>

          <TabsContent value="charts">
            <ChartsTab records={records} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalsTab records={records} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
