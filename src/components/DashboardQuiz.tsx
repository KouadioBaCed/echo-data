import { useState, useEffect } from 'react';
import { Brain, Clock, ChevronRight, Trophy, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { quizScoreService, QuizScore } from '../config/firebase';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  explanation?: string;
}

type QuizType = 'info' | 'proba' | 'mathgen';

// Fonction pour mélanger un tableau (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Fonction pour mélanger les options d'une question et mettre à jour correctAnswer
const shuffleQuestionOptions = (question: Question): Question => {
  const correctOption = question.options[question.correctAnswer];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectAnswer = shuffledOptions.indexOf(correctOption);

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer
  };
};

// Fonction pour mélanger toutes les questions d'un quiz
const shuffleQuizQuestions = (questions: Question[]): Question[] => {
  return questions.map(q => shuffleQuestionOptions(q));
};

interface QuizState {
  selectedQuiz: QuizType | null;
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  quizStarted: boolean;
  userAnswers: (number | null)[];
  userId: string;
  shuffledQuestions?: Question[]; // Questions avec options mélangées
}

const QUIZ_STATE_KEY = 'echodata_quiz_state';

const saveQuizState = (state: QuizState) => {
  try {
    localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving quiz state:', e);
  }
};

const loadQuizState = (userId: string): QuizState | null => {
  try {
    const saved = localStorage.getItem(QUIZ_STATE_KEY);
    if (saved) {
      const state = JSON.parse(saved) as QuizState;
      if (state.userId === userId && state.quizStarted) {
        return state;
      }
    }
  } catch (e) {
    console.error('Error loading quiz state:', e);
  }
  return null;
};

const clearQuizState = () => {
  try {
    localStorage.removeItem(QUIZ_STATE_KEY);
  } catch (e) {
    console.error('Error clearing quiz state:', e);
  }
};

interface DashboardQuizProps {
  onBack: () => void;
  initialQuizType?: 'info' | 'proba' | 'mathgen';
}

export default function DashboardQuiz({ onBack, initialQuizType }: DashboardQuizProps) {
  const { currentUser } = useAuth();

  // État pour suivre les quiz déjà passés
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<QuizType, boolean>>({
    info: false,
    proba: false,
    mathgen: false
  });
  const [loadingCompleted, setLoadingCompleted] = useState(true);
  const [stateRestored, setStateRestored] = useState(false);

  // Charger les quiz déjà passés
  useEffect(() => {
    const loadCompletedQuizzes = async () => {
      if (currentUser) {
        setLoadingCompleted(true);
        const scores = await quizScoreService.getUserScores(currentUser.uid);
        const completed: Record<QuizType, boolean> = {
          info: scores.some(s => s.quiz_type === 'info'),
          proba: scores.some(s => s.quiz_type === 'proba'),
          mathgen: scores.some(s => s.quiz_type === 'mathgen')
        };
        setCompletedQuizzes(completed);
        setLoadingCompleted(false);
      }
    };
    loadCompletedQuizzes();
  }, [currentUser]);

  // Quiz Informatique (7 questions)
  const infoQuestions: Question[] = [
    {
      id: 1,
      question: 'Quelle composante est responsable de l\'exécution des instructions dans un ordinateur ?',
      options: ['Mémoire RAM', 'Unité centrale (CPU)', 'Disque dur', 'Port USB'],
      correctAnswer: 1,
      timeLimit: 60,
      explanation: 'L\'Unité centrale (CPU) est le processeur qui exécute les instructions des programmes.'
    },
    {
      id: 2,
      question: 'Convertissez le nombre binaire 1011 en base 10 (décimal).',
      options: ['9', '10', '11', '12'],
      correctAnswer: 2,
      timeLimit: 60,
      explanation: '1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11'
    },
    {
      id: 3,
      question: 'Quel est le nombre hexadécimal équivalent à 15 en décimal ?',
      options: ['E', 'F', 'D', 'A'],
      correctAnswer: 1,
      timeLimit: 60,
      explanation: 'En hexadécimal : A=10, B=11, C=12, D=13, E=14, F=15'
    },
    {
      id: 4,
      question: 'Dans un algorithme, quelle structure permet de répéter un bloc d\'instructions ?',
      options: ['Condition (SI...ALORS)', 'Boucle (POUR/TANT QUE)', 'Affectation', 'Déclaration'],
      correctAnswer: 1,
      timeLimit: 60,
      explanation: 'Les boucles (POUR, TANT QUE) permettent de répéter des instructions jusqu\'à ce qu\'une condition soit remplie.'
    },
    {
      id: 5,
      question: 'Quelle est la complexité temporelle d\'un parcours complet d\'un tableau de n éléments ?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 2,
      timeLimit: 60,
      explanation: 'Parcourir tous les éléments d\'un tableau nécessite n opérations, donc O(n).'
    },
    {
      id: 6,
      question: 'Combien de bits sont nécessaires pour représenter 256 valeurs différentes ?',
      options: ['4 bits', '6 bits', '8 bits', '16 bits'],
      correctAnswer: 2,
      timeLimit: 60,
      explanation: '2⁸ = 256, donc 8 bits sont nécessaires pour représenter 256 valeurs (0 à 255).'
    },
    {
      id: 7,
      question: 'Quelle mémoire perd son contenu lorsque l\'ordinateur est éteint ?',
      options: ['ROM', 'Disque dur', 'RAM', 'SSD'],
      correctAnswer: 2,
      timeLimit: 60,
      explanation: 'La RAM (Random Access Memory) est une mémoire volatile qui perd son contenu sans alimentation électrique.'
    }
  ];

  // Quiz Probabilités/Statistiques (7 questions)
  const probaQuestions: Question[] = [
    {
      id: 1,
      question: 'Jeu de 32 cartes : On tire une seule carte d\'un jeu de 32. Probabilité d\'obtenir un As ?',
      options: ['1/8', '1/4', '1/32', '4/52'],
      correctAnswer: 0,
      timeLimit: 60,
      explanation: 'Il y a 4 As dans un jeu de 32 cartes. P(As) = 4/32 = 1/8'
    },
    {
      id: 2,
      question: 'Espérance de la loi binomiale : Si X ~ Bin(n, p), alors E[X] vaut :',
      options: ['n × p', 'n / p', 'p^n', 'n × (1 − p)'],
      correctAnswer: 0,
      timeLimit: 60,
      explanation: 'L\'espérance d\'une loi binomiale B(n, p) est E[X] = n × p'
    },
    {
      id: 3,
      question: 'Propriétés de la loi normale : Laquelle est vraie pour toute loi normale X ~ N(μ, σ²) ?',
      options: ['La médiane, la moyenne et le mode sont égaux', 'La variance est égale à la moyenne', 'P(X > μ) = 0.25', 'Le support est [0, +∞)'],
      correctAnswer: 0,
      timeLimit: 60,
      explanation: 'La loi normale est symétrique autour de μ, donc médiane = moyenne = mode = μ'
    },
    {
      id: 4,
      question: 'Mémoire nulle (exponentielle) : Quelle propriété caractérise la loi Y ~ Exp(λ) ?',
      options: ['P(Y > s+t | Y > s) = P(Y > t) pour s, t ≥ 0', 'Sa variance vaut toujours 1/λ', 'Elle est symétrique autour de sa moyenne', 'P(Y = 0) > 0'],
      correctAnswer: 0,
      timeLimit: 60,
      explanation: 'La propriété sans mémoire est caractéristique de la loi exponentielle'
    },
    {
      id: 5,
      question: 'Espérance d\'une uniforme : Si U ~ Uniforme([a, b]), alors E[U] est :',
      options: ['(a + b) / 2', '1 / (b − a)', '√(a × b)', '(b − a) / 2'],
      correctAnswer: 0,
      timeLimit: 60,
      explanation: 'L\'espérance d\'une loi uniforme sur [a, b] est le milieu de l\'intervalle : (a + b) / 2'
    },
    {
      id: 6,
      question: 'Zéro succès en binomiale : Si X ~ Bin(n, p), la probabilité P(X = 0) est :',
      options: ['(1 − p)^n', 'p^n', 'n × (1 − p)', '1 − (1 − p)^n'],
      correctAnswer: 0,
      timeLimit: 60,
      explanation: 'P(X = 0) = C(n,0) × p^0 × (1−p)^n = (1−p)^n'
    },
    {
      id: 7,
      question: 'Loi totale : P(A) = 0.3, P(B) = 0.7, P(S|A) = 0.10, P(S|B) = 0.02. Quelle est P(S) ?',
      options: ['0.044', '0.06', '0.02', '0.10'],
      correctAnswer: 0,
      timeLimit: 60,
      explanation: 'P(S) = P(S|A)×P(A) + P(S|B)×P(B) = 0.10×0.3 + 0.02×0.7 = 0.03 + 0.014 = 0.044'
    }
  ];

  // Quiz Mathématiques Général (7 questions)
  const mathgenQuestions: Question[] = [
    {
      id: 1,
      question: 'Soit X une partie non vide de ℝ². L\'ensemble A = {u ∈ GL(ℝ²) | u(X) = X} est :',
      options: ['Un groupe', 'Un espace vectoriel', 'Une algèbre', 'Une droite'],
      correctAnswer: 0,
      timeLimit: 120,
      explanation: 'L\'ensemble des transformations linéaires inversibles préservant X forme un groupe pour la composition.'
    },
    {
      id: 2,
      question: 'Lequel des ensembles suivants est un sous-groupe de (GL₂(ℝ), ×) ?',
      options: ['Matrices inversibles à coeff. dans ℤ', 'Matrices à coeff. dans ℤ avec det = 1', 'Matrices avec det < 0', 'Matrices A vérifiant A² = I₂'],
      correctAnswer: 1,
      timeLimit: 180,
      explanation: 'SL₂(ℤ) = {A ∈ M₂(ℤ) | det(A) = 1} est un sous-groupe de GL₂(ℝ). C\'est l\'ensemble des matrices 2×2 à coefficients entiers de déterminant 1.'
    },
    {
      id: 3,
      question: 'Soit f(x,y,z) = (2x+2y+z, x+3y+z, x+2y+2z). Trouver la matrice A de f dans la base canonique.',
      options: ['[2,2,1 | 1,3,1 | 1,2,2]', '[2,2,1 | 3,1,1 | 2,1,2]', '[1,2,2 | 1,3,1 | 2,2,1]', '[2,1,1 | 2,3,2 | 1,1,2]'],
      correctAnswer: 0,
      timeLimit: 180,
      explanation: 'Les lignes de la matrice sont les coefficients de chaque composante : ligne 1 = (2,2,1), ligne 2 = (1,3,1), ligne 3 = (1,2,2).'
    },
    {
      id: 4,
      question: 'Soit g(x) = x/(e^x − 1) si x≠0, g(0)=1. Calculer lim quand x → +∞ de g(x).',
      options: ['+∞', '−∞', '0', '1'],
      correctAnswer: 2,
      timeLimit: 60,
      explanation: 'Quand x → +∞, e^x → +∞ donc x/(e^x − 1) → 0 car l\'exponentielle domine.'
    },
    {
      id: 5,
      question: 'Développement limité de g(x) = x/(e^x − 1) en 0 à l\'ordre 2 :',
      options: ['1 − x/2 + x²/12 + o(x²)', '1 − x + x²/3 + o(x²)', '1 + x/2 − x²/2 + o(x²)', '1 − x/2 + x²/2 + o(x²)'],
      correctAnswer: 0,
      timeLimit: 180,
      explanation: 'En développant e^x = 1 + x + x²/2 + x³/6 + o(x³), puis en divisant x par (e^x − 1), on obtient ce DL.'
    },
    {
      id: 6,
      question: 'Soit P un polynôme de degré ≤ 3 vérifiant P(1)=1, P(0)=1, P(−1)=−1, P\'(1)=3.',
      options: ['Un tel polynôme P n\'existe pas', 'Il existe une infinité de polynômes P', 'Il existe un unique polynôme P', 'Si P existe, alors P(2) = 2'],
      correctAnswer: 2,
      timeLimit: 60,
      explanation: '4 conditions pour un polynôme de degré ≤3 (4 coefficients) donne une solution unique.'
    },
    {
      id: 7,
      question: 'Soit f(x) = x × cos(e^(yx)). Pour tout x ∈ ℝ, f\'(x) = ?',
      options: ['cos(e^(yx))', 'y × cos(e^(yx))', 'y × e^(yx) × cos(e^(yx))', 'cos(e^(yx)) − y×x×e^(yx)×sin(e^(yx))'],
      correctAnswer: 3,
      timeLimit: 120,
      explanation: 'Par la règle du produit : f\'(x) = cos(e^(yx)) + x × (−sin(e^(yx))) × y×e^(yx) = cos(e^(yx)) − y×x×e^(yx)×sin(e^(yx))'
    }
  ];

  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedScore, setSavedScore] = useState<QuizScore | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Fonction pour obtenir les questions originales
  const getOriginalQuestions = (type: QuizType): Question[] => {
    switch (type) {
      case 'info': return infoQuestions;
      case 'proba': return probaQuestions;
      case 'mathgen': return mathgenQuestions;
      default: return [];
    }
  };

  // Restaurer l'état du quiz depuis localStorage au chargement
  useEffect(() => {
    if (currentUser && !stateRestored) {
      const savedState = loadQuizState(currentUser.uid);
      if (savedState) {
        setSelectedQuiz(savedState.selectedQuiz);
        setCurrentQuestionIndex(savedState.currentQuestionIndex);
        setScore(savedState.score);
        setTimeLeft(savedState.timeLeft);
        setQuizStarted(savedState.quizStarted);
        setUserAnswers(savedState.userAnswers);

        // Restaurer les questions mélangées ou les régénérer si manquantes
        if (savedState.shuffledQuestions && savedState.shuffledQuestions.length > 0) {
          setShuffledQuestions(savedState.shuffledQuestions);
        } else if (savedState.selectedQuiz && savedState.quizStarted) {
          // Régénérer les questions si l'ancien état n'en avait pas
          const originalQuestions = getOriginalQuestions(savedState.selectedQuiz);
          const shuffled = shuffleQuizQuestions(originalQuestions);
          setShuffledQuestions(shuffled);
        }
      }
      setStateRestored(true);
    }
  }, [currentUser, stateRestored]);

  // Démarrer automatiquement le quiz si initialQuizType est fourni (et pas d'état restauré)
  useEffect(() => {
    if (initialQuizType && !loadingCompleted && !completedQuizzes[initialQuizType] && stateRestored && !quizStarted) {
      const originalQuestions = getOriginalQuestions(initialQuizType);
      const shuffled = shuffleQuizQuestions(originalQuestions);
      setShuffledQuestions(shuffled);
      setSelectedQuiz(initialQuizType);
      setQuizStarted(true);
      setTimeLeft(shuffled[0]?.timeLimit || 60);
    }
  }, [initialQuizType, loadingCompleted, completedQuizzes, stateRestored, quizStarted]);

  // Sauvegarder l'état du quiz dans localStorage à chaque changement
  useEffect(() => {
    if (currentUser && quizStarted && !quizFinished && stateRestored && shuffledQuestions.length > 0) {
      saveQuizState({
        selectedQuiz,
        currentQuestionIndex,
        score,
        timeLeft,
        quizStarted,
        userAnswers,
        userId: currentUser.uid,
        shuffledQuestions
      });
    }
  }, [currentUser, selectedQuiz, currentQuestionIndex, score, timeLeft, quizStarted, quizFinished, userAnswers, stateRestored, shuffledQuestions]);

  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : [];
  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;

  // Timer
  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, quizFinished]);

  // Bloquer les raccourcis clavier de copie pendant le quiz
  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquer Ctrl+C, Ctrl+A, Ctrl+X, Cmd+C, Cmd+A, Cmd+X
      if ((e.ctrlKey || e.metaKey) && ['c', 'a', 'x', 'C', 'A', 'X'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      // Bloquer PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [quizStarted, quizFinished]);

  const handleStartQuiz = (quizType: QuizType) => {
    const originalQuestions = getOriginalQuestions(quizType);
    const shuffled = shuffleQuizQuestions(originalQuestions);
    setShuffledQuestions(shuffled);
    setSelectedQuiz(quizType);
    setQuizStarted(true);
    setTimeLeft(shuffled[0]?.timeLimit || 60);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleTimeUp = () => {
    setUserAnswers([...userAnswers, null]);
    handleNextQuestion();
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newUserAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newUserAnswers);

    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(newScore);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
    } else {
      finishQuiz(newScore, newUserAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
    } else {
      finishQuiz(score, userAnswers);
    }
  };

  const finishQuiz = async (finalScore: number, _answers: (number | null)[]) => {
    setQuizFinished(true);
    setIsSaving(true);

    // Nettoyer l'état sauvegardé car le quiz est terminé
    clearQuizState();

    if (currentUser && selectedQuiz) {
      const scoreData = {
        user_id: currentUser.uid,
        user_email: currentUser.email || '',
        quiz_type: selectedQuiz,
        score: finalScore,
        total_questions: questions.length,
        percentage: Math.round((finalScore / questions.length) * 100)
      };

      const saved = await quizScoreService.saveScore(scoreData);
      setSavedScore(saved);
    }

    setIsSaving(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: 'Excellent ! Vous maîtrisez bien les bases !', color: 'text-green-600' };
    if (percentage >= 60) return { message: 'Bon travail ! Continuez à vous entraîner.', color: 'text-blue-600' };
    if (percentage >= 40) return { message: 'Pas mal, mais il faut réviser encore.', color: 'text-yellow-600' };
    return { message: 'Continuez vos efforts, la pratique fait la perfection !', color: 'text-orange-600' };
  };

  const getQuizInfo = (type: QuizType) => {
    switch (type) {
      case 'info':
        return { name: 'Informatique', icon: '💻', gradient: 'from-purple-500 to-blue-500', desc: 'Architecture, algorithmes, binaire...' };
      case 'proba':
        return { name: 'Probabilités & Stats', icon: '📊', gradient: 'from-green-500 to-teal-500', desc: 'Lois, espérance, probabilités...' };
      case 'mathgen':
        return { name: 'Math Général', icon: '📐', gradient: 'from-red-500 to-orange-500', desc: 'Groupes, matrices, analyse...' };
    }
  };

  // Écran de sélection du quiz
  if (!quizStarted && selectedQuiz === null) {
    const allCompleted = Object.values(completedQuizzes).every(v => v);
    const availableQuizzes = (['info', 'proba', 'mathgen'] as QuizType[]).filter(q => !completedQuizzes[q]);

    if (loadingCompleted) {
      return (
        <div className="space-y-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </button>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Chargement...</p>
          </div>
        </div>
      );
    }

    if (allCompleted) {
      return (
        <div className="space-y-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Félicitations !</h2>
            <p className="text-gray-600 mb-6">Vous avez complété tous les quiz disponibles.</p>
            <div className="grid grid-cols-3 gap-4">
              {(['info', 'proba', 'mathgen'] as QuizType[]).map(type => {
                const info = getQuizInfo(type);
                return (
                  <div key={type} className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
                    <span className="text-3xl">{info.icon}</span>
                    <p className="font-medium text-gray-800 text-sm">{info.name}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle size={12} /> Complété
                    </p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={onBack}
              className="mt-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Voir mes scores
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </button>

        <div className="text-center mb-8">
          <Brain className="mx-auto mb-4 text-purple-600" size={48} />
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choisissez votre Quiz
          </h2>
          <p className="text-gray-600">Testez vos connaissances et suivez votre progression</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {availableQuizzes.map(type => {
            const info = getQuizInfo(type);
            return (
              <div key={type} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className={`h-32 bg-gradient-to-br ${info.gradient} flex items-center justify-center`}>
                  <span className="text-5xl">{info.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{info.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{info.desc}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>7 questions</span>
                    <span>~7 min</span>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(type)}
                    className={`w-full bg-gradient-to-r ${info.gradient} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                  >
                    Commencer <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Écran de résultats
  if (quizFinished && selectedQuiz) {
    const scoreData = getScoreMessage();
    const percentage = Math.round((score / questions.length) * 100);
    const quizInfo = getQuizInfo(selectedQuiz);

    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`h-40 bg-gradient-to-r ${quizInfo.gradient} flex items-center justify-center`}>
            <div className="text-center text-white">
              <Trophy className="mx-auto mb-2" size={48} />
              <h2 className="text-2xl font-bold">Quiz Terminé !</h2>
              {savedScore && <p className="text-sm opacity-80 mt-1">Score enregistré</p>}
              {isSaving && <p className="text-sm opacity-80 mt-1">Enregistrement...</p>}
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <svg className="w-40 h-40" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                  <circle
                    cx="100" cy="100" r="90" fill="none"
                    stroke={percentage >= 60 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="20"
                    strokeDasharray={`${percentage * 5.65} 565`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className="text-4xl font-bold text-gray-900">{score}/{questions.length}</div>
                    <div className="text-lg text-gray-600">{percentage}%</div>
                  </div>
                </div>
              </div>
              <h3 className={`text-xl font-bold mt-4 ${scoreData.color}`}>{scoreData.message}</h3>
            </div>

            {/* Corrigé */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Corrigé</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questions.map((q, index) => {
                  const userAnswer = userAnswers[index];
                  const wasCorrect = userAnswer === q.correctAnswer;
                  const noAnswer = userAnswer === null;

                  return (
                    <div key={q.id} className={`p-4 rounded-lg ${wasCorrect ? 'bg-green-50 border border-green-200' : noAnswer ? 'bg-gray-50 border border-gray-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${wasCorrect ? 'bg-green-500' : noAnswer ? 'bg-gray-400' : 'bg-red-500'}`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{q.question}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Réponse : <span className="font-semibold text-green-600">{q.options[q.correctAnswer]}</span>
                            {!wasCorrect && !noAnswer && (
                              <span className="text-red-600 ml-2">(Vous : {q.options[userAnswer!]})</span>
                            )}
                            {noAnswer && <span className="text-gray-500 ml-2">(Pas de réponse)</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={onBack}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran de chargement si le quiz est démarré mais les questions ne sont pas encore prêtes
  if (quizStarted && !quizFinished && (!currentQuestion || shuffledQuestions.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  // Écran de question
  if (!currentQuestion || !selectedQuiz) return null;

  const quizInfo = getQuizInfo(selectedQuiz);

  // Empêcher la copie
  const preventCopy = (e: React.ClipboardEvent | React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className="space-y-4 select-none"
      onContextMenu={preventCopy}
      onCopy={preventCopy}
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${quizInfo.gradient} p-4`}>
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <span className="font-semibold">{quizInfo.icon} {quizInfo.name}</span>
              <span className="text-sm opacity-80">Question {currentQuestionIndex + 1}/{questions.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-200' : ''}`}>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className={`h-full bg-gradient-to-r ${quizInfo.gradient} transition-all duration-300`}
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="p-6">
          <h3
            className="text-lg font-bold text-gray-900 mb-6 select-none"
            onCopy={preventCopy}
            draggable={false}
          >
            {currentQuestion.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  onCopy={preventCopy}
                  draggable={false}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all select-none ${
                    isSelected
                      ? `border-${selectedQuiz === 'info' ? 'purple' : selectedQuiz === 'proba' ? 'green' : 'red'}-500 bg-gray-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-gray-800">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={`w-full bg-gradient-to-r ${quizInfo.gradient} text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2`}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Valider' : 'Terminer'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
