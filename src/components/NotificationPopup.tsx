import { useEffect, useState } from "react";
import { Trophy, Zap, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export type NotificationType = "overtake" | "individual_goal" | "team_goal";

interface NotificationData {
  type: NotificationType;
  message: string;
  sellerName?: string;
}

interface NotificationPopupProps {
  notification: NotificationData | null;
  onClose: () => void;
}

export const NotificationPopup = ({ notification, onClose }: NotificationPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case "overtake":
        return <Zap className="w-12 h-12 text-gold" />;
      case "individual_goal":
        return <Target className="w-12 h-12 text-gold" />;
      case "team_goal":
        return <Trophy className="w-12 h-12 text-gold" />;
    }
  };

  const getTitle = () => {
    switch (notification.type) {
      case "overtake":
        return "Ultrapassagem!";
      case "individual_goal":
        return "Meta Atingida!";
      case "team_goal":
        return "Meta da Equipe Alcançada!";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card
        className={`bg-gradient-podium border-2 border-gold shadow-gold p-8 max-w-lg transform transition-all duration-300 ${
          isVisible ? "scale-100" : "scale-90"
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-4 animate-celebration">
          {getIcon()}
          <h2 className="text-3xl font-bold text-gold">{getTitle()}</h2>
          <p className="text-xl text-foreground">{notification.message}</p>
        </div>
      </Card>
    </div>
  );
};
