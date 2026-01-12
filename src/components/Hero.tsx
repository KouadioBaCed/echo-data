import { ArrowRight, Database, Users, Brain } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="accueil" className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 min-h-screen flex items-center overflow-hidden">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop"
          alt="Data Analytics Background"
          className="w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-teal-900/90 to-cyan-900/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-cyan-400/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Texte principal */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-coral-400 to-rose-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-4 inline-block shadow-lg">
                #1 L'innovation à votre portée
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight animate-fade-in">
              Data & IA au service de vos{' '}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent drop-shadow-2xl">Décisions</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              EchoData conçoit et déploie des solutions data sur-mesure
              (tableaux de bord, modèles prédictifs, pipelines) et forme vos équipes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('formation')}
                className="group bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-base sm:text-lg"
              >
                Découvrir nos formations
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="border-2 border-white/50 bg-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/20 backdrop-blur-md transition-all duration-300 font-semibold text-base sm:text-lg hover:border-white hover:scale-105"
              >
                Nos services
              </button>
            </div>
          </div>

          {/* Cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mt-8 lg:mt-0">
            <div className="group bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 duration-300 border border-white/20">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
                <Database className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Data Science</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Obtenir des compétences clés en analyse et intelligence artificielle
              </p>
            </div>
            <div className="group bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 duration-300 border border-white/20">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
                <Users className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Préparation Académique</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Parcours d'accès aux écoles d'excellence
              </p>
            </div>
            <div className="group bg-white/95 backdrop-blur-sm p-5 sm:p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 duration-300 border border-white/20 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:rotate-6 transition-transform">
                <Brain className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Projets Data</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Nous concevons et déployons vos solutions data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
