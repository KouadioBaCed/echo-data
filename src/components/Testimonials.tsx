import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Kouadio Jean',
      role: 'Étudiant INPHB',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 5,
      text: 'Grâce à la préparation d\'EchoData, j\'ai réussi le concours INPHB avec brio. Les formateurs sont excellents et le suivi est personnalisé.'
    },
    {
      name: 'Aminata Koné',
      role: 'Data Analyst',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rating: 5,
      text: 'La formation Data Analytics m\'a ouvert les portes d\'une carrière passionnante. J\'ai acquis des compétences pratiques directement applicables en entreprise.'
    },
    {
      name: 'Mamadou Traoré',
      role: 'Développeur Web',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      rating: 5,
      text: 'EchoData m\'a accompagné dans ma reconversion professionnelle. Aujourd\'hui, je travaille en tant que développeur web dans une grande entreprise.'
    },
    {
      name: 'Aïcha Diabaté',
      role: 'Business Intelligence Analyst',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      rating: 5,
      text: 'Formation de qualité avec des projets concrets. Les formateurs sont à l\'écoute et très compétents. Je recommande vivement EchoData.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ce que disent nos étudiants
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de ceux qui ont transformé leur carrière grâce à nos formations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Photo de profil */}
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              {/* Étoiles */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                ))}
              </div>

              {/* Citation */}
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 text-blue-200" size={24} />
                <p className="text-gray-700 italic pl-6">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section statistiques */}
        <div className="mt-16 bg-white rounded-2xl p-12 shadow-xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">Taux de satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Étudiants formés</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600">Admis à l'INPHB</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
              <p className="text-gray-600">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
