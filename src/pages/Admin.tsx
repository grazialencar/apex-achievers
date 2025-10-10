import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trophy, Users } from "lucide-react";
import logo from "@/assets/logo.png";
import { useToast } from "@/hooks/use-toast";

const mockVendors = [
  { id: "1", name: "Carlos Silva" },
  { id: "2", name: "Ana Costa" },
  { id: "3", name: "Roberto Oliveira" },
  { id: "4", name: "Juliana Santos" },
  { id: "5", name: "Pedro Almeida" },
  { id: "6", name: "Mariana Lima" },
  { id: "7", name: "Felipe Souza" },
];

const Admin = () => {
  const { toast } = useToast();
  const [rankingName, setRankingName] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [metricType, setMetricType] = useState<"monetary" | "points">("monetary");
  const [hasGoals, setHasGoals] = useState(false);
  const [hasPrizes, setHasPrizes] = useState(false);
  const [individualGoal, setIndividualGoal] = useState("");
  const [teamGoal, setTeamGoal] = useState("");
  const [prizes, setPrizes] = useState({ first: "", second: "", third: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rankingName || selectedVendors.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome do ranking e selecione pelo menos um participante.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ranking criado com sucesso!",
      description: `${rankingName} foi criado com ${selectedVendors.length} participantes.`,
    });

    // Reset form
    setRankingName("");
    setSelectedVendors([]);
    setHasGoals(false);
    setHasPrizes(false);
    setIndividualGoal("");
    setTeamGoal("");
    setPrizes({ first: "", second: "", third: "" });
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={logo} alt="Alencar Corretora" className="h-12" />
          <h1 className="text-3xl font-bold text-gold">Painel Administrativo</h1>
        </div>

        <Card className="bg-card border-gold/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nome do Ranking */}
            <div className="space-y-2">
              <Label htmlFor="ranking-name" className="text-lg font-semibold text-gold">
                Nome do Ranking
              </Label>
              <Input
                id="ranking-name"
                placeholder="Ex: Campanha de Vendas - Outubro"
                value={rankingName}
                onChange={(e) => setRankingName(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            {/* Participantes */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Selecionar Participantes
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {mockVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center space-x-3 bg-background/50 p-3 rounded-lg border border-border hover:border-gold/50 transition-colors"
                  >
                    <Checkbox
                      id={vendor.id}
                      checked={selectedVendors.includes(vendor.id)}
                      onCheckedChange={() => toggleVendor(vendor.id)}
                    />
                    <label
                      htmlFor={vendor.id}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {vendor.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipo de Métrica */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gold">Tipo de Métrica</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={metricType === "monetary" ? "default" : "outline"}
                  onClick={() => setMetricType("monetary")}
                  className="flex-1"
                >
                  Valor Monetário (R$)
                </Button>
                <Button
                  type="button"
                  variant={metricType === "points" ? "default" : "outline"}
                  onClick={() => setMetricType("points")}
                  className="flex-1"
                >
                  Pontuação/Volume
                </Button>
              </div>
            </div>

            {/* Metas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-gold">Adicionar Metas?</Label>
                <Switch checked={hasGoals} onCheckedChange={setHasGoals} />
              </div>
              {hasGoals && (
                <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-gold/30">
                  <div className="space-y-2">
                    <Label>Meta Individual</Label>
                    <Input
                      placeholder="Ex: 150000"
                      value={individualGoal}
                      onChange={(e) => setIndividualGoal(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta da Equipe</Label>
                    <Input
                      placeholder="Ex: 1000000"
                      value={teamGoal}
                      onChange={(e) => setTeamGoal(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Premiação */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-gold flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Adicionar Premiação?
                </Label>
                <Switch checked={hasPrizes} onCheckedChange={setHasPrizes} />
              </div>
              {hasPrizes && (
                <div className="space-y-3 pl-4 border-l-2 border-gold/30">
                  <div className="space-y-2">
                    <Label>1º Lugar</Label>
                    <Input
                      placeholder="Ex: iPhone 15 Pro + Viagem"
                      value={prizes.first}
                      onChange={(e) => setPrizes({ ...prizes, first: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>2º Lugar</Label>
                    <Input
                      placeholder="Ex: iPad + Vale Compras"
                      value={prizes.second}
                      onChange={(e) => setPrizes({ ...prizes, second: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>3º Lugar</Label>
                    <Input
                      placeholder="Ex: Apple Watch"
                      value={prizes.third}
                      onChange={(e) => setPrizes({ ...prizes, third: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Duração */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Término</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-gold text-primary font-bold text-lg h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Ranking
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
