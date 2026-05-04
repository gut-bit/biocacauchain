import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in UI:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#f8f6f3] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Ops! Ocorreu um erro inesperado</h1>
            <p className="text-sm text-gray-500 mb-6">
              Nossa aplicação encontrou um problema ao tentar renderizar esta tela. 
              {this.state.error && <span className="block mt-2 font-mono text-xs bg-gray-50 p-2 rounded text-red-700/80 border border-gray-100">{this.state.error.message}</span>}
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-6"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="w-full rounded-xl py-6">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar para o início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
