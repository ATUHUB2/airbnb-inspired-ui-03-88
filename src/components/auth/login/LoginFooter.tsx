
import { Link } from "react-router-dom";

const LoginFooter = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Vous n'avez pas de compte ?{" "}
        <Link
          to="/auth/register"
          className="font-medium text-primary hover:text-primary/90 transition-colors"
        >
          S'inscrire
        </Link>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        <Link
          to="/auth/reset-password"
          className="font-medium text-primary hover:text-primary/90 transition-colors"
        >
          Mot de passe oublié ?
        </Link>
      </p>
    </div>
  );
};

export default LoginFooter;
