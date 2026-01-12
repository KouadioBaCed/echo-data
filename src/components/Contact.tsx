import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { contactService } from '../config/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await contactService.saveMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject,
      message: formData.message
    });

    if (result) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
      {/* Background image avec overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop"
          alt="Contact Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/97 via-slate-900/95 to-teal-900/97"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-cyan-500/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <div className="inline-block mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
              CONTACTEZ-NOUS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight px-2">
            Parlons de votre <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">projet</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-2">
            Une question sur nos formations ou services ? Notre équipe est à votre écoute
            pour vous accompagner dans votre projet.
          </p>
        </div>

        <div className="flex justify-center">
          {/* <div>
            <div className="space-y-6 mb-8">
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:rotate-6 transition-transform">
                    <Phone className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-3 text-lg">Téléphone</h3>
                    <p className="text-gray-200 text-base">+225 07 19 23 10 74</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:rotate-6 transition-transform">
                    <Mail className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-3 text-lg">Email</h3>
                    <p className="text-gray-200 text-base">contact@echodata.ci</p>
                    <p className="text-gray-200 text-base">formation@echodata.ci</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:rotate-6 transition-transform">
                    <MapPin className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-3 text-lg">Adresse</h3>
                    <p className="text-gray-200 text-base">Abidjan, Cocody</p>
                    <p className="text-gray-200 text-base">Côte d'Ivoire</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-600 rounded-3xl p-10 text-gray-900 shadow-2xl border-2 border-white/30">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <h3 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">Horaires d'ouverture</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b-2 border-white/30">
                    <span className="text-white font-medium text-lg">Lundi - Vendredi</span>
                    <span className="font-bold text-white text-lg">8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b-2 border-white/30">
                    <span className="text-white font-medium text-lg">Samedi</span>
                    <span className="font-bold text-white text-lg">9h00 - 14h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium text-lg">Dimanche</span>
                    <span className="font-bold text-white text-lg">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl border border-gray-100 w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all hover:border-gray-300 text-sm sm:text-base"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all hover:border-gray-300 text-sm sm:text-base"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all hover:border-gray-300 text-sm sm:text-base"
                  placeholder="+225 XX XX XX XX XX"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all hover:border-gray-300 text-sm sm:text-base"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="formation-inphb">Formation INPHB</option>
                  <option value="formation-data">Formation Data Analytics</option>
                  <option value="services">Services digitaux</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all resize-none hover:border-gray-300 text-sm sm:text-base"
                  placeholder="Décrivez votre besoin..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Une erreur est survenue. Veuillez réessayer plus tard.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 sm:py-4 lg:py-5 rounded-lg sm:rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold flex items-center justify-center gap-2 sm:gap-3 shadow-xl text-sm sm:text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
