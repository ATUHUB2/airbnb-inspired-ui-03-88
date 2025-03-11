
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simuler une demande de réinitialisation
    setTimeout(() => {
      // Enregistrer la demande dans localStorage
      try {
        const resetRequests = JSON.parse(localStorage.getItem('password_reset_requests') || '[]');
        resetRequests.push({
          email,
          requestedAt: new Date().toISOString(),
          fulfilled: false
        });
        localStorage.setItem('password_reset_requests', JSON.stringify(resetRequests));
        
        // Log dans security_logs
        const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        securityLogs.push({
          type: 'password_reset_requested',
          email,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        localStorage.setItem('security_logs', JSON.stringify(securityLogs));
        
        setIsSubmitted(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la demande de réinitialisation:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Réinitialisation du mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSubmitted 
              ? "Vérifiez votre boîte mail pour les instructions" 
              : "Entrez votre adresse email pour réinitialiser votre mot de passe"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSubmitted ? (
          <div className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Si un compte existe avec l'adresse {email}, vous recevrez bientôt un email contenant les instructions pour réinitialiser votre mot de passe.
            </p>
            <div className="pt-4">
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="votre@email.com"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer les instructions"}
              </Button>
            </div>
            
            <div className="text-center">
              <Link 
                to="/auth/login" 
                className="font-medium text-primary hover:text-primary/90 transition-colors text-sm"
              >
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
