import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    // Si on est sur la page d'accueil, scroll direct
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Sinon, naviguer vers la page d'accueil puis scroller
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center group py-2">
            <img
              src="/logos/download.png"
              alt="EchoData Logo"
              className="h-40 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => scrollToSection('accueil')}
              className="text-gray-700 hover:text-teal-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-teal-50 font-medium"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('formation')}
              className="text-gray-700 hover:text-teal-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-teal-50 font-medium"
            >
              Formation
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-teal-600 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-teal-50 font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold ml-2"
            >
              Contact
            </button>
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('accueil')}
              className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('formation')}
              className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
            >
              Formation
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
