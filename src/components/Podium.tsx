import { Trophy, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Seller {
  id: string;
  name: string;
  avatar: string;
  value: number;
  goal?: number;
}

interface PodiumProps {
  sellers: Seller[];
}

export const Podium = ({ sellers }: PodiumProps) => {
  const topThree = sellers.slice(0, 3);
  
  const getPodiumHeight = (position: number) => {
    switch (position) {
      case 0: return "h-64";
      case 1: return "h-52";
      case 2: return "h-44";
      default: return "h-44";
    }
  };

  const getPodiumOrder = () => {
    if (topThree.length < 3) return topThree;
    return [topThree[1], topThree[0], topThree[2]];
  };

  const getPositionLabel = (index: number) => {
    if (topThree.length < 3) return index + 1;
    return index === 0 ? 2 : index === 1 ? 1 : 3;
  };

  return (
    <div className="flex items-end justify-center gap-6 px-8 animate-slide-up">
      {getPodiumOrder().map((seller, index) => {
        const position = getPositionLabel(index);
        const isFirst = position === 1;
        const progress = seller.goal ? (seller.value / seller.goal) * 100 : 0;

        return (
          <Card
            key={seller.id}
            className={`${getPodiumHeight(position - 1)} w-64 bg-gradient-podium border-2 ${
              isFirst ? "border-gold shadow-gold animate-pulse-gold" : "border-border"
            } flex flex-col items-center justify-end p-6 relative overflow-hidden transition-all duration-500 hover:scale-105`}
          >
            {/* Position Badge */}
            <div
              className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                isFirst
                  ? "bg-gradient-gold text-primary"
                  : position === 2
                  ? "bg-muted/40 text-foreground"
                  : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {position}º
            </div>

            {/* Trophy for 1st Place */}
            {isFirst && (
              <Trophy className="absolute top-4 left-4 w-10 h-10 text-gold animate-celebration" />
            )}

            {/* Avatar */}
            <div
              className={`w-24 h-24 rounded-full overflow-hidden mb-4 border-4 ${
                isFirst ? "border-gold" : "border-border"
              }`}
            >
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold text-center mb-2">{seller.name}</h3>

            {/* Value */}
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-gold" />
              <span className="text-2xl font-bold text-gold">
                R$ {seller.value.toLocaleString("pt-BR")}
              </span>
            </div>

            {/* Progress Bar */}
            {seller.goal && (
              <div className="w-full space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {progress.toFixed(0)}% da meta
                </p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
