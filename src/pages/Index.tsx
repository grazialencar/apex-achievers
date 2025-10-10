import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-4">
      <img src={logo} alt="Alencar Corretora" className="h-24 mb-8" />
      <h1 className="text-4xl font-bold text-white mb-4 text-center">
        Sistema de Rankings de Vendas
      </h1>
      <p className="text-white/80 mb-8 text-center max-w-md">
        Plataforma gamificada para gerenciar e visualizar rankings de vendas da sua equipe
      </p>
      <Button onClick={() => navigate("/auth")} size="lg">
        Acessar Plataforma
      </Button>
    </div>
  );
};

export default Index;
