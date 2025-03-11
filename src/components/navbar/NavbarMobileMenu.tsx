
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, Home, HelpCircle, Info, MapPin, Mail, X } from 'lucide-react';

interface NavbarMobileMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({ isOpen, onClose }) => {
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeIn"
      }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-white dark:bg-gray-900 md:hidden"
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="font-bold text-2xl">Shalom Job Center</Link>
              <button 
                className="text-gray-800 dark:text-gray-200 hover:text-sholom-primary focus:outline-none"
                onClick={handleClose}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              <motion.div variants={itemVariants}>
                <Link to="/" className="p-4 rounded-lg flex items-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Home className="mr-3 h-5 w-5 text-sholom-primary" />
                  Accueil
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Link to="/jobs" className="p-4 rounded-lg flex items-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <BriefcaseBusiness className="mr-3 h-5 w-5 text-sholom-primary" />
                  Emplois
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="p-4 rounded-lg">
                  <p className="flex items-center mb-2 font-medium text-gray-800 dark:text-gray-200">
                    <MapPin className="mr-3 h-5 w-5 text-sholom-primary" />
                    Quartiers
                  </p>
                  <div className="ml-8 space-y-2">
                    {['Tokoin', 'Bè', 'Adidogomé', 'Agoè', 'Kodjoviakopé'].map(neighborhood => (
                      <Link 
                        key={neighborhood}
                        to={`/?q=${neighborhood}`} 
                        className="block py-2 text-gray-600 dark:text-gray-400 hover:text-sholom-primary"
                      >
                        {neighborhood}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Link to="/about" className="p-4 rounded-lg flex items-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Info className="mr-3 h-5 w-5 text-sholom-primary" />
                  À propos de nous
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Link to="/contact" className="p-4 rounded-lg flex items-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Mail className="mr-3 h-5 w-5 text-sholom-primary" />
                  Nous contacter
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Link to="/support" className="p-4 rounded-lg flex items-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <HelpCircle className="mr-3 h-5 w-5 text-sholom-primary" />
                  Support
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-4 pt-4 border-t">
                <div className="flex space-x-2">
                  <Link to="/login" className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-3 text-center hover:border-sholom-primary">
                    Connexion
                  </Link>
                  <Link to="/register" className="flex-1 bg-sholom-primary text-white rounded-lg py-3 text-center hover:bg-sholom-primary/90">
                    Inscription
                  </Link>
                </div>
              </motion.div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
