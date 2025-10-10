import logo from "@/assets/logo.png";
import { Calendar, Target } from "lucide-react";

interface RankingHeaderProps {
  campaignName: string;
  startDate: string;
  endDate: string;
  teamGoal?: number;
  teamProgress?: number;
}

export const RankingHeader = ({
  campaignName,
  startDate,
  endDate,
  teamGoal,
  teamProgress = 0,
}: RankingHeaderProps) => {
  const progressPercentage = teamGoal ? (teamProgress / teamGoal) * 100 : 0;

  return (
    <div className="bg-card/50 border-b border-gold/30 py-6 px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="Alencar Corretora" className="h-16" />
        </div>

        {/* Campaign Info */}
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gold mb-2">{campaignName}</h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {startDate} - {endDate}
              </span>
            </div>
            {teamGoal && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>
                  Meta da Equipe: R$ {teamGoal.toLocaleString("pt-BR")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Team Progress */}
        {teamGoal && (
          <div className="w-48 space-y-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progresso da Equipe</p>
              <p className="text-2xl font-bold text-gold">
                {progressPercentage.toFixed(0)}%
              </p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-gold transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
