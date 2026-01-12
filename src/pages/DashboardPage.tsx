import { useNavigate } from 'react-router-dom';
import { LogOut, Brain, Trophy, Clock, ChevronRight, Home, Settings, BarChart3, Menu, X, Shield, Users, TrendingUp, ChevronDown, ChevronUp, CheckCircle, XCircle, UserCheck, MessageSquare, Mail, Phone, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { quizScoreService, QuizScore, adminService, UserStats, contactService, ContactMessage } from '../config/firebase';
import DashboardQuiz from '../components/DashboardQuiz';

type DashboardView = 'home' | 'quiz' | 'scores' | 'settings' | 'admin' | 'interactions';

const DASHBOARD_VIEW_KEY = 'echodata_dashboard_view';

const getSavedView = (): DashboardView => {
  try {
    const saved = localStorage.getItem(DASHBOARD_VIEW_KEY);
    if (saved && ['home', 'quiz', 'scores', 'settings', 'admin', 'interactions'].includes(saved)) {
      return saved as DashboardView;
    }
  } catch (e) {
    console.error('Error loading view:', e);
  }
  return 'home';
};

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setViewState] = useState<DashboardView>(getSavedView);

  // Wrapper pour setView qui sauvegarde aussi dans localStorage
  const setView = (newView: DashboardView) => {
    setViewState(newView);
    try {
      localStorage.setItem(DASHBOARD_VIEW_KEY, newView);
    } catch (e) {
      console.error('Error saving view:', e);
    }
  };
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [bestInfoScore, setBestInfoScore] = useState<QuizScore | null>(null);
  const [bestProbaScore, setBestProbaScore] = useState<QuizScore | null>(null);
  const [bestMathgenScore, setBestMathgenScore] = useState<QuizScore | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [usersStats, setUsersStats] = useState<UserStats[]>([]);
  const [globalStats, setGlobalStats] = useState<{
    totalUsers: number;
    totalQuizzes: number;
    avgScore: number;
    infoQuizzes: number;
    probaQuizzes: number;
    mathgenQuizzes: number;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserScores, setSelectedUserScores] = useState<QuizScore[]>([]);
  const [loadingUserScores, setLoadingUserScores] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [userAdminStatus, setUserAdminStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [userFilter, setUserFilter] = useState<'all' | 'approved' | 'rejected'>('all');

  // Interactions state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Quiz state
  const [selectedQuizType, setSelectedQuizType] = useState<'info' | 'proba' | 'mathgen' | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!currentUser.emailVerified) {
      navigate('/verify-email');
    }
  }, [currentUser, navigate]);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (currentUser) {
        setAdminLoading(true);
        const adminStatus = await adminService.isAdmin(currentUser.uid);
        setIsAdmin(adminStatus);
        setAdminLoading(false);
      }
    };
    checkAdmin();
  }, [currentUser]);

  // Écouter le statut admin de l'utilisateur connecté en temps réel
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = adminService.subscribeToUserAdminStatus(
      currentUser.uid,
      (status) => {
        console.log('Received admin status update:', status);
        setUserAdminStatus(status);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Charger les scores de l'utilisateur
  useEffect(() => {
    const loadScores = async () => {
      if (currentUser) {
        setLoadingScores(true);
        const [userScores, infoBest, probaBest, mathgenBest] = await Promise.all([
          quizScoreService.getUserScores(currentUser.uid),
          quizScoreService.getBestScore(currentUser.uid, 'info'),
          quizScoreService.getBestScore(currentUser.uid, 'proba'),
          quizScoreService.getBestScore(currentUser.uid, 'mathgen')
        ]);
        setScores(userScores);
        setBestInfoScore(infoBest);
        setBestProbaScore(probaBest);
        setBestMathgenScore(mathgenBest);
        setLoadingScores(false);
      }
    };

    loadScores();
  }, [currentUser, view]);

  // Charger les données admin
  useEffect(() => {
    const loadAdminData = async () => {
      if (isAdmin && view === 'admin') {
        const [stats, global] = await Promise.all([
          adminService.getUsersStats(),
          adminService.getGlobalStats()
        ]);
        setUsersStats(stats);
        setGlobalStats(global);
      }
    };
    loadAdminData();
  }, [isAdmin, view]);

  // Charger les messages de contact
  useEffect(() => {
    const loadMessages = async () => {
      if (isAdmin && view === 'interactions') {
        setLoadingMessages(true);
        const messages = await contactService.getAllMessages();
        setContactMessages(messages);
        setUnreadCount(messages.filter(m => !m.read).length);
        setLoadingMessages(false);
      }
    };
    loadMessages();
  }, [isAdmin, view]);

  // Charger le nombre de messages non lus pour le badge
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (isAdmin) {
        const count = await contactService.getUnreadCount();
        setUnreadCount(count);
      }
    };
    loadUnreadCount();
  }, [isAdmin]);

  // Gérer le clic sur un message
  const handleMessageClick = async (messageId: string) => {
    if (selectedMessage === messageId) {
      setSelectedMessage(null);
      return;
    }
    setSelectedMessage(messageId);

    // Marquer comme lu
    const message = contactMessages.find(m => m.id === messageId);
    if (message && !message.read) {
      await contactService.markAsRead(messageId);
      setContactMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, read: true } : m
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Charger les scores d'un utilisateur sélectionné
  const loadUserScores = async (userId: string) => {
    if (selectedUser === userId) {
      setSelectedUser(null);
      setSelectedUserScores([]);
      return;
    }

    setLoadingUserScores(true);
    setSelectedUser(userId);
    const scores = await adminService.getScoresByUser(userId);
    setSelectedUserScores(scores);
    setLoadingUserScores(false);
  };

  // Mettre à jour le statut admin d'un utilisateur
  const handleUpdateAdminStatus = async (userId: string, status: 'approved' | 'rejected') => {
    console.log('Updating admin status:', { userId, status });
    setUpdatingStatus(userId);
    const success = await adminService.updateUserAdminStatus(userId, status);
    console.log('Update result:', success);
    if (success) {
      // Mettre à jour l'état local
      setUsersStats(prev => prev.map(user =>
        user.user_id === userId ? { ...user, admin_status: status } : user
      ));
    }
    setUpdatingStatus(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!currentUser || !currentUser.emailVerified) {
    return null;
  }

  const menuItems: { id: DashboardView; label: string; icon: typeof Home; badge?: number }[] = [
    { id: 'home', label: 'Accueil', icon: Home },
    // { id: 'scores', label: 'Mes Scores', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  // Ajouter les options admin si l'utilisateur est admin
  if (isAdmin && !adminLoading) {
    menuItems.push({ id: 'admin', label: 'Administration', icon: Shield });
    menuItems.push({ id: 'interactions', label: 'Interactions', icon: MessageSquare, badge: unreadCount });
  }

  const renderContent = () => {
    switch (view) {
      case 'quiz':
        return <DashboardQuiz onBack={() => { setView('home'); setSelectedQuizType(null); }} initialQuizType={selectedQuizType || undefined} />;

      case 'interactions':
        if (!isAdmin) {
          return (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Accès non autorisé</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="w-7 h-7 text-indigo-600" />
                Interactions
              </h1>
              <p className="text-gray-500">Messages reçus depuis le formulaire de contact</p>
            </div>

            {/* Stats des messages */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{contactMessages.length}</p>
                <p className="text-sm text-gray-400">Total messages</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{unreadCount}</p>
                <p className="text-sm text-gray-400">Non lus</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{contactMessages.length - unreadCount}</p>
                <p className="text-sm text-gray-400">Lus</p>
              </div>
            </div>

            {/* Liste des messages */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-gray-600" />
                Messages
              </h2>

              {loadingMessages ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                  Chargement...
                </div>
              ) : contactMessages.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun message reçu</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {contactMessages.map((msg) => {
                      const subjectLabels: Record<string, string> = {
                        'formation-inphb': 'Formation INPHB',
                        'formation-data': 'Formation Data Analytics',
                        'services': 'Services digitaux',
                        'partenariat': 'Partenariat',
                        'autre': 'Autre'
                      };

                      return (
                        <div key={msg.id}>
                          <div
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${!msg.read ? 'bg-indigo-50/50' : ''}`}
                            onClick={() => handleMessageClick(msg.id!)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${!msg.read ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}>
                                  {msg.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className={`font-semibold ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</p>
                                    {!msg.read && (
                                      <span className="inline-flex items-center text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                        Nouveau
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">{msg.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                    {subjectLabels[msg.subject] || msg.subject}
                                  </span>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) : ''}
                                  </p>
                                </div>
                                <div>
                                  {selectedMessage === msg.id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Détails du message */}
                          {selectedMessage === msg.id && (
                            <div className="bg-gray-50 px-4 pb-4">
                              <div className="bg-white rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <a href={`mailto:${msg.email}`} className="text-indigo-600 hover:underline">{msg.email}</a>
                                  </div>
                                  {msg.phone && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Phone className="w-4 h-4" />
                                      <a href={`tel:${msg.phone}`} className="text-indigo-600 hover:underline">{msg.phone}</a>
                                    </div>
                                  )}
                                </div>
                                <div className="border-t pt-3">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Message :</p>
                                  <p className="text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'admin':
        if (!isAdmin) {
          return (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Accès non autorisé</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Shield className="w-7 h-7 text-purple-600" />
                Administration
              </h1>
              <p className="text-gray-500">Gérez et suivez les performances des utilisateurs</p>
            </div>

            {/* Stats globales */}
            {globalStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{globalStats.totalUsers}</p>
                  <p className="text-sm text-gray-400">Utilisateurs</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{globalStats.totalQuizzes}</p>
                  <p className="text-sm text-gray-400">Quiz passés</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{globalStats.avgScore}%</p>
                  <p className="text-sm text-gray-400">Score moyen</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-lg font-bold text-purple-500">{globalStats.infoQuizzes}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-lg font-bold text-green-500">{globalStats.probaQuizzes}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-lg font-bold text-red-500">{globalStats.mathgenQuizzes}</span>
                  </div>
                  <p className="text-sm text-gray-400">💻 / 📊 / 📐</p>
                </div>
              </div>
            )}

            {/* Liste des utilisateurs */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  Utilisateurs
                </h2>

                {/* Onglets de filtre */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setUserFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'all'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Tous ({usersStats.length})
                  </button>
                  <button
                    onClick={() => setUserFilter('approved')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'approved'
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Validés ({usersStats.filter(u => u.admin_status === 'approved').length})
                  </button>
                  <button
                    onClick={() => setUserFilter('rejected')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      userFilter === 'rejected'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Refusés ({usersStats.filter(u => u.admin_status === 'rejected').length})
                  </button>
                </div>
              </div>

              {(() => {
                const filteredUsers = usersStats.filter(user => {
                  if (userFilter === 'all') return true;
                  if (userFilter === 'approved') return user.admin_status === 'approved';
                  if (userFilter === 'rejected') return user.admin_status === 'rejected';
                  return true;
                });

                return filteredUsers.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {userFilter === 'all'
                      ? "Aucun utilisateur n'a encore passé de quiz"
                      : userFilter === 'approved'
                        ? "Aucun utilisateur validé"
                        : "Aucun utilisateur refusé"
                    }
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <div key={user.user_id}>
                        <div
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-all"
                          onClick={() => loadUserScores(user.user_id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                                {user.user_email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-800">{user.user_email}</p>
                                  {user.admin_status === 'approved' && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                      <UserCheck size={12} /> Validé
                                    </span>
                                  )}
                                  {user.admin_status === 'rejected' && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                      <XCircle size={12} /> Refusé
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">
                                  {user.total_quizzes} quiz • Dernier: {user.last_quiz_date ? new Date(user.last_quiz_date).toLocaleDateString('fr-FR') : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="text-center min-w-[50px]">
                                <p className="text-xs text-gray-400 uppercase">Moy.</p>
                                <p className={`text-lg font-bold ${user.avg_percentage >= 60 ? 'text-green-500' : user.avg_percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                  {user.avg_percentage}%
                                </p>
                              </div>
                              <div className="text-center min-w-[45px]">
                                <p className="text-xs text-gray-400">💻</p>
                                <p className="text-sm font-bold text-purple-500">
                                  {user.best_info !== null ? `${user.best_info}%` : '--'}
                                </p>
                              </div>
                              <div className="text-center min-w-[45px]">
                                <p className="text-xs text-gray-400">📊</p>
                                <p className="text-sm font-bold text-green-500">
                                  {user.best_proba !== null ? `${user.best_proba}%` : '--'}
                                </p>
                              </div>
                              <div className="text-center min-w-[45px]">
                                <p className="text-xs text-gray-400">📐</p>
                                <p className="text-sm font-bold text-red-500">
                                  {user.best_mathgen !== null ? `${user.best_mathgen}%` : '--'}
                                </p>
                              </div>
                              <div className="ml-2">
                                {selectedUser === user.user_id ? (
                                  <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Détails des scores de l'utilisateur */}
                        {selectedUser === user.user_id && (
                          <div className="bg-gray-50 px-4 pb-4">
                            {loadingUserScores ? (
                              <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* Boutons Valider/Refuser */}
                                <div className="flex items-center gap-3 py-3 border-b border-gray-200">
                                  <span className="text-sm font-medium text-gray-600">Statut candidature :</span>
                                  {updatingStatus === user.user_id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateAdminStatus(user.user_id, 'approved');
                                        }}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                          user.admin_status === 'approved'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                      >
                                        <CheckCircle size={14} />
                                        Valider
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateAdminStatus(user.user_id, 'rejected');
                                        }}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                          user.admin_status === 'rejected'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        }`}
                                      >
                                        <XCircle size={14} />
                                        Refuser
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Historique des quiz */}
                                {selectedUserScores.length === 0 ? (
                                  <p className="text-gray-500 text-center py-4">Aucun quiz passé</p>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-600 mb-3">Historique des quiz :</p>
                                    {selectedUserScores.map((score, idx) => {
                                      const quizConfig = {
                                        info: { icon: '💻', name: 'Informatique' },
                                        proba: { icon: '📊', name: 'Probabilités & Stats' },
                                        mathgen: { icon: '📐', name: 'Math Général' }
                                      }[score.quiz_type] || { icon: '📝', name: 'Quiz' };

                                      return (
                                        <div key={score.id || idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                                          <div className="flex items-center gap-3">
                                            <span className="text-xl">{quizConfig.icon}</span>
                                            <div>
                                              <p className="font-medium text-gray-700 text-sm">{quizConfig.name}</p>
                                              <p className="text-xs text-gray-400">
                                                {score.created_at ? new Date(score.created_at).toLocaleDateString('fr-FR', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                }) : ''}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className={`text-lg font-bold ${score.percentage >= 60 ? 'text-green-500' : score.percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                              {score.percentage}%
                                            </p>
                                            <p className="text-xs text-gray-400">{score.score}/{score.total_questions}</p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
              })()}
            </div>
          </div>
        );

      case 'scores':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mes Scores</h1>
              <p className="text-gray-500">Historique de tous vos quiz</p>
            </div>

            {loadingScores ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3"></div>
                Chargement...
              </div>
            ) : scores.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium text-lg">Aucun quiz passé</p>
                <p className="text-gray-400 mt-1">Passez votre premier quiz pour voir vos résultats ici</p>
                <button
                  onClick={() => setView('quiz')}
                  className="mt-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Passer un quiz
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {scores.map((s, index) => {
                    const quizConfig = {
                      info: { icon: '💻', name: 'Informatique', bg: 'bg-purple-100' },
                      proba: { icon: '📊', name: 'Probabilités & Stats', bg: 'bg-green-100' },
                      mathgen: { icon: '📐', name: 'Math Général', bg: 'bg-red-100' }
                    }[s.quiz_type] || { icon: '📝', name: 'Quiz', bg: 'bg-gray-100' };

                    return (
                      <div key={s.id || index} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${quizConfig.bg}`}>
                            <span className="text-2xl">{quizConfig.icon}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{quizConfig.name}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <Clock size={14} />
                              {s.created_at ? new Date(s.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Date inconnue'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${s.percentage >= 60 ? 'text-green-500' : s.percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {s.percentage}%
                          </p>
                          <p className="text-sm text-gray-400">{s.score}/{s.total_questions} bonnes réponses</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
              <p className="text-gray-500">Gérez votre compte</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <p className="text-lg text-gray-800 mt-1">{currentUser.email}</p>
                <span className="inline-flex items-center gap-1 text-green-600 text-sm mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Vérifié
                </span>
              </div>

              <div className="border-t pt-6">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">ID Utilisateur</label>
                <p className="text-gray-600 mt-1 font-mono text-sm">{currentUser.uid}</p>
              </div>

              <div className="border-t pt-6">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Rôle</label>
                <p className="text-gray-800 mt-1 flex items-center gap-2">
                  {isAdmin ? (
                    <>
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-600 font-medium">Administrateur</span>
                    </>
                  ) : (
                    <span>Utilisateur</span>
                  )}
                </p>
              </div>

              <div className="border-t pt-6">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date de création</label>
                <p className="text-gray-800 mt-1">
                  {currentUser.metadata.creationTime
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>

              <div className="border-t pt-6">
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        );

      default: // home
        return (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Bienvenue sur votre espace</p>
                  <h1 className="text-2xl font-bold mt-1">{currentUser.email?.split('@')[0]}</h1>
                  <p className="text-teal-100 text-sm mt-2">Testez vos connaissances avec nos quiz</p>
                </div>
                {isAdmin && (
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bannière statut candidature */}
            {userAdminStatus === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-green-800">Candidature Validée !</h3>
                    <p className="text-green-600 text-sm">Votre profil a été validé. Vous serez contacté(e) très bientôt par notre équipe.</p>
                  </div>
                </div>
              </div>
            )}

            {userAdminStatus === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-red-800">Candidature Non Retenue</h3>
                    <p className="text-red-600 text-sm">Malheureusement, votre candidature n'a pas été retenue. Merci pour votre participation.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Résultats des Quiz */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Vos Résultats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Résultat Info */}
                <div className={`rounded-2xl shadow-sm p-5 ${bestInfoScore ? 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💻</span>
                      <span className="font-semibold text-gray-800">Informatique</span>
                    </div>
                    {bestInfoScore ? (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Complété
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">En attente</span>
                    )}
                  </div>
                  {bestInfoScore ? (
                    <div className="mt-4">
                      <div className="flex items-end gap-2">
                        <p className={`text-4xl font-bold ${bestInfoScore.percentage >= 60 ? 'text-green-600' : bestInfoScore.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {bestInfoScore.percentage}%
                        </p>
                        <p className="text-gray-500 mb-1">{bestInfoScore.score}/{bestInfoScore.total_questions}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full ${bestInfoScore.percentage >= 60 ? 'bg-green-500' : bestInfoScore.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${bestInfoScore.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-center py-4">
                      <p className="text-gray-400">Quiz non passé</p>
                    </div>
                  )}
                </div>

                {/* Résultat Proba */}
                <div className={`rounded-2xl shadow-sm p-5 ${bestProbaScore ? 'bg-gradient-to-br from-green-50 to-teal-50 border border-green-100' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      <span className="font-semibold text-gray-800">Probabilités & Stats</span>
                    </div>
                    {bestProbaScore ? (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Complété
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">En attente</span>
                    )}
                  </div>
                  {bestProbaScore ? (
                    <div className="mt-4">
                      <div className="flex items-end gap-2">
                        <p className={`text-4xl font-bold ${bestProbaScore.percentage >= 60 ? 'text-green-600' : bestProbaScore.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {bestProbaScore.percentage}%
                        </p>
                        <p className="text-gray-500 mb-1">{bestProbaScore.score}/{bestProbaScore.total_questions}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full ${bestProbaScore.percentage >= 60 ? 'bg-green-500' : bestProbaScore.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${bestProbaScore.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-center py-4">
                      <p className="text-gray-400">Quiz non passé</p>
                    </div>
                  )}
                </div>

                {/* Résultat Math Général */}
                <div className={`rounded-2xl shadow-sm p-5 ${bestMathgenScore ? 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-100' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📐</span>
                      <span className="font-semibold text-gray-800">Math Général</span>
                    </div>
                    {bestMathgenScore ? (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> Complété
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">En attente</span>
                    )}
                  </div>
                  {bestMathgenScore ? (
                    <div className="mt-4">
                      <div className="flex items-end gap-2">
                        <p className={`text-4xl font-bold ${bestMathgenScore.percentage >= 60 ? 'text-green-600' : bestMathgenScore.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {bestMathgenScore.percentage}%
                        </p>
                        <p className="text-gray-500 mb-1">{bestMathgenScore.score}/{bestMathgenScore.total_questions}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full ${bestMathgenScore.percentage >= 60 ? 'bg-green-500' : bestMathgenScore.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${bestMathgenScore.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-center py-4">
                      <p className="text-gray-400">Quiz non passé</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Quiz d'évaluation</h2>
              {bestInfoScore && bestProbaScore && bestMathgenScore ? (
                // Tous les quiz sont terminés
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-green-800 font-medium">Vous avez complété tous les quiz !</p>
                  {/* <p className="text-green-600 text-sm mt-1">Consultez vos scores dans l'onglet "Mes Scores"</p> */}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {!bestInfoScore && (
                    <button
                      onClick={() => { setSelectedQuizType('info'); setView('quiz'); }}
                      className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all group"
                    >
                      <span className="text-4xl">💻</span>
                      <h3 className="text-xl font-bold mt-3">Informatique</h3>
                      <p className="text-purple-100 text-sm mt-1">7 questions • ~7 min</p>
                      <div className="flex items-center gap-1 mt-4 text-sm font-medium">
                        Commencer <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  )}

                  {!bestProbaScore && (
                    <button
                      onClick={() => { setSelectedQuizType('proba'); setView('quiz'); }}
                      className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all group"
                    >
                      <span className="text-4xl">📊</span>
                      <h3 className="text-xl font-bold mt-3">Probabilités & Stats</h3>
                      <p className="text-green-100 text-sm mt-1">7 questions • ~7 min</p>
                      <div className="flex items-center gap-1 mt-4 text-sm font-medium">
                        Commencer <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  )}

                  {!bestMathgenScore && (
                    <button
                      onClick={() => { setSelectedQuizType('mathgen'); setView('quiz'); }}
                      className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all group"
                    >
                      <span className="text-4xl">📐</span>
                      <h3 className="text-xl font-bold mt-3">Math Général</h3>
                      <p className="text-red-100 text-sm mt-1">7 questions • ~7 min</p>
                      <div className="flex items-center gap-1 mt-4 text-sm font-medium">
                        Commencer <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
        <img src="/logos/download.png" alt="Logo" className="h-10" />
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-center text-white font-bold">
          {currentUser.email?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-teal-700 via-teal-800 to-cyan-900 z-50 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="relative py-6 px-4 border-b border-white/20">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-3 right-3 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-3 shadow-xl">
                <img src="/logos/download.png" alt="EchoData" className="h-24 w-auto" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-teal-700 font-bold text-lg shadow-lg">
                  {currentUser.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {currentUser.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-teal-200 truncate">{currentUser.email}</p>
                </div>
              </div>
              {isAdmin && (
                <div className="mt-3 flex items-center gap-2 bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg w-fit">
                  <Shield size={14} />
                  <span className="font-medium">Administrateur</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <p className="text-xs font-semibold text-teal-300/70 uppercase tracking-wider px-4 mb-3">Menu</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.id;
              const isAdminItem = item.id === 'admin' || item.id === 'interactions';
              const badge = item.badge;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200
                    ${isActive
                      ? 'bg-white text-teal-700 shadow-lg'
                      : isAdminItem
                        ? 'text-teal-100 hover:bg-white/10 hover:text-white'
                        : 'text-teal-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                  {isActive && !badge && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-teal-500"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:bg-red-500/20 hover:text-white transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0 bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
