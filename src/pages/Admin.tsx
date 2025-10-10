import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trophy, Users } from "lucide-react";
import logo from "@/assets/logo.png";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [sellers, setSellers] = useState<any[]>([]);
  const [rankingName, setRankingName] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [metricType, setMetricType] = useState<"value" | "points">("value");
  const [hasGoals, setHasGoals] = useState(false);
  const [individualGoal, setIndividualGoal] = useState("");
  const [teamGoal, setTeamGoal] = useState("");
  const [hasPrizes, setHasPrizes] = useState(false);
  const [firstPrize, setFirstPrize] = useState("");
  const [secondPrize, setSecondPrize] = useState("");
  const [thirdPrize, setThirdPrize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    if (user) {
      fetchSellers();
    }
  }, [user, authLoading, navigate]);

  const fetchSellers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setSellers(data || []);
  };

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rankingName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para o ranking.",
        variant: "destructive",
      });
      return;
    }

    if (selectedVendors.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione ao menos um participante.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name: rankingName,
          start_date: startDate,
          end_date: endDate,
          metric_type: metricType,
          team_goal: hasGoals && teamGoal ? Number(teamGoal) : null,
          first_place_prize: hasPrizes ? firstPrize : null,
          second_place_prize: hasPrizes ? secondPrize : null,
          third_place_prize: hasPrizes ? thirdPrize : null,
          created_by: user?.id,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      const campaignSellers = selectedVendors.map(sellerId => ({
        campaign_id: campaign.id,
        seller_id: sellerId,
        individual_goal: hasGoals && individualGoal ? Number(individualGoal) : null,
      }));

      const { error: sellersError } = await supabase
        .from('campaign_sellers')
        .insert(campaignSellers);

      if (sellersError) throw sellersError;

      toast({
        title: "Ranking criado!",
        description: `O ranking "${rankingName}" foi criado com sucesso.`,
      });

      navigate(`/ranking/${campaign.id}`);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Alencar Corretora" className="h-12" />
            <h1 className="text-3xl font-bold text-gold">Painel Administrativo</h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        <Card className="bg-card border-gold/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
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

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Selecionar Participantes
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {sellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="flex items-center space-x-3 bg-background/50 p-3 rounded-lg border border-border hover:border-gold/50 transition-colors"
                  >
                    <Checkbox
                      id={seller.id}
                      checked={selectedVendors.includes(seller.id)}
                      onCheckedChange={() => toggleVendor(seller.id)}
                    />
                    <label
                      htmlFor={seller.id}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {seller.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gold">Tipo de Métrica</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={metricType === "value" ? "default" : "outline"}
                  onClick={() => setMetricType("value")}
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
                      value={firstPrize}
                      onChange={(e) => setFirstPrize(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>2º Lugar</Label>
                    <Input
                      placeholder="Ex: iPad + Vale Compras"
                      value={secondPrize}
                      onChange={(e) => setSecondPrize(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>3º Lugar</Label>
                    <Input
                      placeholder="Ex: Apple Watch"
                      value={thirdPrize}
                      onChange={(e) => setThirdPrize(e.target.value)}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              )}
            </div>

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
