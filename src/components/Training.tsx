import { BookOpen, Clock, Award, CheckCircle, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Training() {
  const programs = [
    {
      title: 'Préparation concours International Data Science Institute - INPHB',
      duration: '3 mois',
      level: 'Formation intensive',
      description: 'Formation intensive pour intégrer l’Internationnal Data Science Institute-INPHB',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop',
      features: [
        'Orientation professionnelle',
        'Annales',
        'Correction des anciens sujets',
        'Devoirs',
        'Examens'
      ],
      have_button: true
    },
    {
      title: 'Formation aux compétences clés des métiers de la data',
      duration: '',
      level: 'Tous niveaux',
      description: 'Des outils et méthodes d’analyse de données utilisés en entreprise.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      features: [
        'Analyse de données pour éclairer les décisions',
        'Tableaux de bord clairs pour le pilotage',
        'Prédiction et automatisation par l’intelligence artificielle',
        'Traitement des données métiers (SQL & Python)',
        'Organisation et fiabilité des données',
        'Reporting et suivi de la performance'
      ],
      have_button: false
    }
  ];
  
  const navigate = useNavigate();



  return (
    <section id="formation" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-teal-100 rounded-full mb-4">
            <GraduationCap className="text-teal-600 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Parcours de formation et de préparation
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Des parcours conçus pour allier réussite académique et compétences
            pratiques dans les métiers du digital et de la data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12 lg:mb-16">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image de la formation */}
              <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                    {program.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-4">
                  {program.duration && (
                    <span className="flex items-center gap-1 bg-teal-50 px-2 sm:px-3 py-1 rounded-full text-teal-700">
                      <Clock size={14} className="sm:w-4 sm:h-4" />
                      {program.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-indigo-50 px-2 sm:px-3 py-1 rounded-full text-indigo-700">
                    <Award size={14} className="sm:w-4 sm:h-4" />
                    {program.level}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {program.description}
                </p>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="text-teal-600 flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {program.have_button && (
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          S'inscrire maintenant
        </button>
      )}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <BookOpen className="mx-auto mb-4" size={40} />
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-teal-100">Heures de cours</p>
            </div>
            <div>
              <Award className="mx-auto mb-4" size={40} />
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="text-teal-100">Taux de réussite</p>
            </div>
            <div>
              <GraduationCap className="mx-auto mb-4" size={40} />
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-teal-100">Admis à l'INPHB</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
