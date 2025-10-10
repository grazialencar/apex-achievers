import { useState } from "react";
import { RankingHeader } from "@/components/RankingHeader";
import { Podium } from "@/components/Podium";
import { SellerList } from "@/components/SellerList";
import { NotificationPopup, NotificationType } from "@/components/NotificationPopup";

// Mock data - será substituído por dados reais do backend
const mockSellers = [
  {
    id: "1",
    name: "Carlos Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    value: 185000,
    goal: 150000,
  },
  {
    id: "2",
    name: "Ana Costa",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    value: 172000,
    goal: 150000,
  },
  {
    id: "3",
    name: "Roberto Oliveira",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
    value: 158000,
    goal: 150000,
  },
  {
    id: "4",
    name: "Juliana Santos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana",
    value: 142000,
    goal: 150000,
  },
  {
    id: "5",
    name: "Pedro Almeida",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    value: 135000,
    goal: 150000,
  },
  {
    id: "6",
    name: "Mariana Lima",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana",
    value: 128000,
    goal: 150000,
  },
  {
    id: "7",
    name: "Felipe Souza",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe",
    value: 115000,
    goal: 150000,
  },
];

const Ranking = () => {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  const campaignData = {
    name: "Campanha de Vendas - Outubro 2024",
    startDate: "01/10/2024",
    endDate: "31/10/2024",
    teamGoal: 1000000,
    teamProgress: mockSellers.reduce((sum, seller) => sum + seller.value, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <RankingHeader
        campaignName={campaignData.name}
        startDate={campaignData.startDate}
        endDate={campaignData.endDate}
        teamGoal={campaignData.teamGoal}
        teamProgress={campaignData.teamProgress}
      />

      <div className="py-12">
        <Podium sellers={mockSellers} />
        <SellerList sellers={mockSellers} />
      </div>

      <NotificationPopup
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default Ranking;
