
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw, Search, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type ResetRequest = {
  email: string;
  requestedAt: string;
  fulfilled: boolean;
  fulfilledAt?: string;
  fulfilledBy?: string;
};

const PasswordResetTab = () => {
  const [resetRequests, setResetRequests] = useState<ResetRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ResetRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Charger les demandes de réinitialisation
  useEffect(() => {
    loadResetRequests();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRequests(resetRequests);
    } else {
      setFilteredRequests(
        resetRequests.filter((request) =>
          request.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, resetRequests]);

  const loadResetRequests = () => {
    try {
      const requests = JSON.parse(
        localStorage.getItem("password_reset_requests") || "[]"
      );
      setResetRequests(requests);
      setFilteredRequests(requests);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
      toast.error("Erreur lors du chargement des demandes");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResetPassword = (email: string) => {
    setCurrentEmail(email);
    setNewPassword(generateSecurePassword());
    setIsResetDialogOpen(true);
  };

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const confirmResetPassword = () => {
    setLoading(true);

    // Simuler un délai comme pour une opération réseau
    setTimeout(() => {
      try {
        // Mettre à jour le mot de passe de l'utilisateur
        const allUsers = JSON.parse(localStorage.getItem("all_users") || "[]");
        let userFound = false;

        const updatedUsers = allUsers.map((user: any) => {
          if (user.email.toLowerCase() === currentEmail.toLowerCase()) {
            userFound = true;
            // Générer un sel aléatoire
            const salt = Math.random().toString(36).substring(2);
            
            // Mettre à jour le mot de passe (dans un vrai système, utiliser un hash sécurisé)
            return {
              ...user,
              password: newPassword, // Pour simplement stocker temporairement
              passwordResetAt: new Date().toISOString(),
              passwordResetBy: user?.email || "admin",
              salt
            };
          }
          return user;
        });

        // Si l'utilisateur n'existe pas, ajouter un message d'erreur
        if (!userFound) {
          toast.error("Utilisateur non trouvé dans la base de données");
          setLoading(false);
          return;
        }

        // Mettre à jour les utilisateurs
        localStorage.setItem("all_users", JSON.stringify(updatedUsers));

        // Mettre à jour les demandes de réinitialisation
        const updatedRequests = resetRequests.map((request) => {
          if (request.email.toLowerCase() === currentEmail.toLowerCase() && !request.fulfilled) {
            return {
              ...request,
              fulfilled: true,
              fulfilledAt: new Date().toISOString(),
              fulfilledBy: user?.email || "admin"
            };
          }
          return request;
        });

        localStorage.setItem("password_reset_requests", JSON.stringify(updatedRequests));
        setResetRequests(updatedRequests);
        
        // Log de sécurité
        const securityLogs = JSON.parse(localStorage.getItem("security_logs") || "[]");
        securityLogs.push({
          type: "password_reset_by_admin",
          email: currentEmail,
          timestamp: new Date().toISOString(),
          adminEmail: user?.email,
          userAgent: navigator.userAgent
        });
        localStorage.setItem("security_logs", JSON.stringify(securityLogs));

        // Réinitialiser les tentatives de connexion
        localStorage.setItem(`login_attempts_${currentEmail}`, JSON.stringify({
          count: 0,
          timestamp: Date.now(),
          lockUntil: undefined
        }));

        toast.success("Mot de passe réinitialisé avec succès");
        setIsResetDialogOpen(false);
        setLoading(false);
        
      } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", error);
        toast.error("Erreur lors de la réinitialisation du mot de passe");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">Gestion des réinitialisations de mot de passe</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher par email"
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={loadResetRequests}
            title="Rafraîchir la liste"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Date de la demande</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  Aucune demande de réinitialisation trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request, index) => (
                <TableRow key={`${request.email}-${index}`}>
                  <TableCell className="font-medium">{request.email}</TableCell>
                  <TableCell>
                    {new Date(request.requestedAt).toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {request.fulfilled ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Traitée</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                          <span>En attente</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {!request.fulfilled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(request.email)}
                      >
                        Réinitialiser
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de réinitialiser le mot de passe pour{" "}
              <span className="font-medium">{currentEmail}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Nouveau mot de passe
            </label>
            <div className="flex gap-2">
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNewPassword(generateSecurePassword())}
                title="Générer un nouveau mot de passe"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Ce mot de passe devra être communiqué à l'utilisateur de manière sécurisée.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResetDialogOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              onClick={confirmResetPassword}
              disabled={loading}
            >
              {loading ? "Réinitialisation..." : "Confirmer la réinitialisation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordResetTab;
