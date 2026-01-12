import { BarChart3, Brain, Cloud, Code, Database, LineChart } from 'lucide-react';


export default function Services() {
  const services = [
    {
      icon: Database,
      title: 'Analyse & traitement des données',
      description: 'Nous Explorons, nettoyons et analysons vos données pour en extraire des informations pertinentes.',
      features: ['Analyse exploratoire (EDA)', 'Gestion des données manquantes / anomalies', 'Statistiques descriptives et inférentielles'],
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop'
    },
    {
      icon: BarChart3,
      title: 'Cybersécurité & Protection des Données',
      description: 'Nous sécurisons vos systèmes et vos données contre les risques numériques et les accès non autorisés.',
      features: ['Audit de sécurité des systèmes', 'Protection des données sensibles', 'Bonnes pratiques et sensibilisation des équipes'],
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop'
    },
    {
      icon: Brain,
      title: 'Machine Learning',
      description: 'Nous développons et déployons des modèles de machine learning pour automatiser vos décisions.',
      features: ['Modélisation supervisée & non supervisée (classification, régression, clustering, réduction de dimension)', 'Évaluation des modèles (métriques, validation croisée)', 'Déploiement de modèles'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
    },
    {
      icon: LineChart,
      title: 'Business Intelligence',
      description: 'Solutions complètes de BI pour piloter votre activité avec des données en temps réel.',
      features: ['Power BI & Tableau', 'KPIs personnalisés', 'Reporting automatisé'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
    },
    {
      icon: Cloud,
      title: 'Data Engineering',
      description: 'Nous construisons des pipelines de données robustes et scalables pour gérer vos flux de données.',
      features: ['Orchestration de pipelines : Airflow', 'Traitement de données à grande échelle : Spark, Databricks', 'Gestion des données : Data Lakes, Data Warehouses (BigQuery, Snowflake, Redshift)'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop'
    },
    {
      icon: Code,
      title: 'Développement Web',
      description: 'Nous créons des applications web modernes et performantes pour digitaliser votre activité.',
      features: ['Applications sur mesure', 'APIs REST', 'Interfaces utilisateur'],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop'
    }
  ];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <div className="inline-block mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
              NOS SERVICES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Nos Services <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Digitaux</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Nous proposons un accompagnement complet pour la digitalisation de votre projet
            à travers des solutions data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 group border border-gray-100"
              >
                {/* Image avec overlay */}
                <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-teal-900/70 to-transparent"></div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-white to-gray-100 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-300">
                    <Icon className="text-teal-600 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-teal-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2 sm:space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex-shrink-0 mt-1.5 sm:mt-1"></div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div className="mt-20 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-0 items-center">
            <div className="p-12 lg:p-16">
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Pourquoi choisir <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">EchoData</span> ?
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nous combinons expertise technique, innovation et approche personnalisée pour
                offrir des solutions qui répondent précisément à vos besoins.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-2 text-lg">Expertise Locale</div>
                    <div className="text-gray-600">Connaissance approfondie du marché ivoirien et africain</div>
                  </div>
                </li>
                <li className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-2 text-lg">Technologies Modernes</div>
                    <div className="text-gray-600">Utilisation des dernières innovations technologiques</div>
                  </div>
                </li>
                <li className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-2 text-lg">Accompagnement Continu</div>
                    <div className="text-gray-600">Support et maintenance pour garantir votre succès</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative h-full min-h-[500px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/95 via-cyan-600/95 to-sky-600/95 flex items-center justify-center p-12">
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full"></div>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-extrabold mb-6">Démarrez votre projet</h4>
                  <p className="mb-10 text-white/95 text-lg max-w-md mx-auto">
                    Discutons de vos besoins et trouvons ensemble la solution idéale pour votre entreprise.
                  </p>
                  <button className="bg-white text-teal-700 py-4 px-10 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-2xl hover:scale-105 transform duration-300 text-lg">
                    Demander un devis gratuit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
