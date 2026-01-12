import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmailPage() {
  const { currentUser, sendVerificationEmail, refreshUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.emailVerified) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleCheckVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await refreshUser();
      if (currentUser?.emailVerified) {
        setMessage('Email vérifié avec succès !');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError("L'email n'est pas encore vérifié. Vérifiez votre boîte de réception.");
      }
    } catch (err) {
      setError('Erreur lors de la vérification. Veuillez réessayer.');
    }

    setLoading(false);
  };

  const handleResendEmail = async () => {
    if (cooldown > 0) return;

    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      await sendVerificationEmail();
      setMessage('Email de vérification renvoyé !');
      setCooldown(60);
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      } else {
        setError("Erreur lors de l'envoi de l'email.");
      }
    }

    setResendLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-teal-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au site
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-teal-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Vérification de l'email
          </h1>
          <p className="text-gray-600 mb-6">
            Un email de vérification a été envoyé à{' '}
            <strong className="text-teal-600">{currentUser.email}</strong>
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Instructions :</h3>
            <ol className="text-sm text-gray-600 text-left space-y-2">
              <li>1. Ouvrez votre boîte email</li>
              <li>2. Cherchez l'email de EchoData</li>
              <li>3. Cliquez sur le lien de vérification</li>
              <li>4. Revenez ici et cliquez sur "Vérifier"</li>
            </ol>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  J'ai vérifié mon email
                </>
              )}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={resendLoading || cooldown > 0}
              className="w-full border-2 border-teal-600 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {resendLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldown > 0 ? (
                `Renvoyer dans ${cooldown}s`
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Renvoyer l'email
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">
              Mauvaise adresse email ?
            </p>
            <button
              onClick={handleLogout}
              className="text-teal-600 hover:underline font-medium text-sm"
            >
              Se déconnecter et réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
