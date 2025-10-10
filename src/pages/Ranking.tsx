import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RankingHeader } from "@/components/RankingHeader";
import { Podium } from "@/components/Podium";
import { SellerList } from "@/components/SellerList";
import { NotificationPopup, NotificationType } from "@/components/NotificationPopup";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";

interface Seller {
  id: string;
  name: string;
  value: number;
  goal?: number;
}

const Ranking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/admin");
      return;
    }
    fetchRankingData();
    
    const channel = supabase
      .channel('sales-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => {
        fetchRankingData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchRankingData = async () => {
    try {
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (!campaign) return;

      const { data: campaignSellers } = await supabase
        .from('campaign_sellers')
        .select('seller_id, individual_goal, profiles(name)')
        .eq('campaign_id', id);

      const sellersWithSales = await Promise.all(
        (campaignSellers || []).map(async (cs: any) => {
          const { data: sales } = await supabase
            .from('sales')
            .select('value')
            .eq('campaign_id', id)
            .eq('seller_id', cs.seller_id);

          const totalValue = sales?.reduce((sum, sale) => sum + Number(sale.value), 0) || 0;

          return {
            id: cs.seller_id,
            name: cs.profiles.name,
            value: totalValue,
            goal: cs.individual_goal ? Number(cs.individual_goal) : undefined,
          };
        })
      );

      sellersWithSales.sort((a, b) => b.value - a.value);
      setSellers(sellersWithSales);
      setCampaignData(campaign);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <p className="text-white text-xl">Campanha não encontrada</p>
      </div>
    );
  }

  const teamProgress = sellers.reduce((sum, seller) => sum + seller.value, 0);

  return (
    <div className="min-h-screen bg-gradient-primary">
      {!isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={toggleFullscreen} variant="outline" size="icon">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      )}

      <RankingHeader
        campaignName={campaignData.name}
        startDate={new Date(campaignData.start_date).toLocaleDateString('pt-BR')}
        endDate={new Date(campaignData.end_date).toLocaleDateString('pt-BR')}
        teamGoal={campaignData.team_goal ? Number(campaignData.team_goal) : undefined}
        teamProgress={teamProgress}
      />

      <div className="py-12">
        <Podium sellers={sellers} />
        <SellerList sellers={sellers} />
      </div>

      <NotificationPopup
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default Ranking;
