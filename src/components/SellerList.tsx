import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Seller {
  id: string;
  name: string;
  value: number;
  goal?: number;
}

interface SellerListProps {
  sellers: Seller[];
}

export const SellerList = ({ sellers }: SellerListProps) => {
  const remainingSellers = sellers.slice(3);

  if (remainingSellers.length === 0) return null;

  return (
    <div className="mt-12 px-8 max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gold">Classificação Geral</h2>
      <div className="space-y-3">
        {remainingSellers.map((seller, index) => {
          const position = index + 4;
          const progress = seller.goal ? (seller.value / seller.goal) * 100 : 0;

          return (
            <div
              key={seller.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:border-gold/50 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Position */}
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center font-bold text-lg">
                {position}º
              </div>

              {/* Initials */}
              <div className="w-14 h-14 rounded-full bg-muted/30 border-2 border-border flex items-center justify-center">
                <span className="text-lg font-bold">
                  {seller.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{seller.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="w-4 h-4 text-gold" />
                  <span className="text-gold font-bold">
                    R$ {seller.value.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Progress */}
              {seller.goal && (
                <div className="w-48 space-y-1">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {progress.toFixed(0)}% da meta
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
