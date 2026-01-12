import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

interface Question {
  id: number;
  category: 'math' | 'psycho';
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number; // en secondes
  explanation?: string;
}

export default function Quiz() {
  const navigate = useNavigate();

  const mathQuestions: Question[] = [
    {
      id: 1,
      category: 'math',
      question: 'Résolvez : 3x + 7 = 22',
      options: ['x = 3', 'x = 5', 'x = 7', 'x = 15'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: '3x = 22 - 7 = 15, donc x = 15/3 = 5'
    },
    {
      id: 2,
      category: 'math',
      question: 'Quelle est la valeur de √144 ?',
      options: ['10', '12', '14', '16'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: '12 × 12 = 144, donc √144 = 12'
    },
    {
      id: 3,
      category: 'math',
      question: 'Calculez : 15% de 200',
      options: ['25', '30', '35', '40'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: '15% de 200 = (15/100) × 200 = 30'
    },
    {
      id: 4,
      category: 'math',
      question: 'Si un triangle a des côtés de 3, 4 et 5 cm, quel type de triangle est-ce ?',
      options: ['Équilatéral', 'Rectangle', 'Isocèle', 'Scalène'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: '3² + 4² = 9 + 16 = 25 = 5². C\'est un triangle rectangle (théorème de Pythagore)'
    },
    {
      id: 5,
      category: 'math',
      question: 'Convertissez 0.75 en fraction simplifiée',
      options: ['1/2', '3/4', '2/3', '4/5'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: '0.75 = 75/100 = 3/4 (après simplification)'
    },
    {
      id: 6,
      category: 'math',
      question: 'Quelle est la somme des angles intérieurs d\'un triangle ?',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'La somme des angles intérieurs d\'un triangle est toujours 180°'
    },
    {
      id: 7,
      category: 'math',
      question: 'Calculez : (-5) × (-3)',
      options: ['-15', '-8', '8', '15'],
      correctAnswer: 3,
      timeLimit: 15,
      explanation: 'Le produit de deux nombres négatifs est positif : (-5) × (-3) = 15'
    },
    {
      id: 8,
      category: 'math',
      question: 'Si f(x) = 2x + 3, quelle est la valeur de f(4) ?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 3,
      timeLimit: 15,
      explanation: 'f(4) = 2(4) + 3 = 8 + 3 = 11'
    },
    {
      id: 9,
      category: 'math',
      question: 'Quelle est la médiane de cet ensemble : [5, 12, 3, 18, 7] ?',
      options: ['5', '7', '9', '12'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'Ordre croissant : [3, 5, 7, 12, 18]. La médiane (milieu) = 7'
    },
    {
      id: 10,
      category: 'math',
      question: 'Combien y a-t-il de centimètres dans 2.5 mètres ?',
      options: ['25 cm', '250 cm', '2500 cm', '0.25 cm'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: '1 mètre = 100 cm, donc 2.5 m = 2.5 × 100 = 250 cm'
    },
    {
      id: 11,
      category: 'math',
      question: 'Quelle est l\'aire d\'un rectangle de longueur 8 cm et largeur 5 cm ?',
      options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: 'Aire = longueur × largeur = 8 × 5 = 40 cm²'
    },
    {
      id: 12,
      category: 'math',
      question: 'Simplifiez : 2³ × 2²',
      options: ['2⁵', '2⁶', '4⁵', '8²'],
      correctAnswer: 0,
      timeLimit: 15,
      explanation: 'Lors de la multiplication, on additionne les exposants : 2³ × 2² = 2^(3+2) = 2⁵ = 32'
    },
    {
      id: 13,
      category: 'math',
      question: 'Quelle est la probabilité d\'obtenir un nombre pair en lançant un dé ?',
      options: ['1/6', '1/3', '1/2', '2/3'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: 'Nombres pairs : 2, 4, 6 (3 sur 6 possibilités) = 3/6 = 1/2'
    },
    {
      id: 14,
      category: 'math',
      question: 'Si 5 pommes coûtent 1000 FCFA, combien coûtent 8 pommes ?',
      options: ['1200 FCFA', '1400 FCFA', '1600 FCFA', '2000 FCFA'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: '1 pomme = 1000/5 = 200 FCFA, donc 8 pommes = 8 × 200 = 1600 FCFA'
    },
    {
      id: 15,
      category: 'math',
      question: 'Quelle est la moyenne de : 10, 15, 20, 25 ?',
      options: ['15', '17.5', '18', '20'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'Moyenne = (10 + 15 + 20 + 25) / 4 = 70 / 4 = 17.5'
    }
  ];

  const infoQuestions: Question[] = [
    // Architecture des ordinateurs
    {
      id: 1,
      category: 'math',
      question: 'Quelle composante est responsable de l\'exécution des instructions dans un ordinateur ?',
      options: ['Mémoire RAM', 'Unité centrale (CPU)', 'Disque dur', 'Port USB'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'L\'Unité centrale (CPU) est le processeur qui exécute les instructions des programmes.'
    },
    {
      id: 2,
      category: 'math',
      question: 'Convertissez le nombre binaire 1011 en base 10 (décimal).',
      options: ['9', '10', '11', '12'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: '1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11 (en décimal)'
    },
    {
      id: 3,
      category: 'math',
      question: 'Quel est le nombre hexadécimal équivalent à 15 en décimal ?',
      options: ['E', 'F', 'D', 'A'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'En hexadécimal : A=10, B=11, C=12, D=13, E=14, F=15'
    },
    {
      id: 4,
      category: 'psycho',
      question: 'Dans un algorithme, quelle structure permet de répéter un bloc d\'instructions ?',
      options: ['Condition (SI...ALORS)', 'Boucle (POUR/TANT QUE)', 'Affectation', 'Déclaration'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'Les boucles (POUR, TANT QUE) permettent de répéter des instructions jusqu\'à ce qu\'une condition soit remplie.'
    },
    {
      id: 5,
      category: 'math',
      question: 'Quelle est la complexité temporelle d\'un parcours complet d\'un tableau de n éléments ?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: 'Parcourir tous les éléments d\'un tableau nécessite n opérations, donc O(n).'
    },
    {
      id: 6,
      category: 'psycho',
      question: 'Quelle structure de données permet de stocker des éléments de types différents ?',
      options: ['Tableau', 'Enregistrement (Structure)', 'Pointeur', 'Type énuméré'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'Un enregistrement (ou structure) peut contenir des champs de types différents (entier, chaîne, etc.).'
    },
    {
      id: 7,
      category: 'math',
      question: 'Dans un tableau T[1..10], quel est l\'indice du dernier élément ?',
      options: ['9', '10', '11', 'Dépend de la déclaration'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'La notation T[1..10] indique que les indices vont de 1 à 10, donc le dernier est 10.'
    },
    {
      id: 8,
      category: 'psycho',
      question: 'Quelle est la différence principale entre une procédure et une fonction ?',
      options: ['La syntaxe', 'La fonction retourne une valeur', 'Le nombre de paramètres', 'Aucune différence'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'Une fonction retourne obligatoirement une valeur, contrairement à une procédure.'
    },
    {
      id: 9,
      category: 'math',
      question: 'Combien de bits sont nécessaires pour représenter 256 valeurs différentes ?',
      options: ['4 bits', '6 bits', '8 bits', '16 bits'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: '2⁸ = 256 valeurs possibles, donc 8 bits sont nécessaires (valeurs de 0 à 255).'
    },
    {
      id: 10,
      category: 'psycho',
      question: 'Quel est le rôle d\'un invariant de boucle dans un algorithme ?',
      options: ['Initialiser les variables', 'Prouver la correction de la boucle', 'Terminer la boucle', 'Déclarer les types'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'Un invariant de boucle est une propriété qui reste vraie à chaque itération et permet de prouver que la boucle produit le résultat attendu.'
    },
    {
      id: 11,
      category: 'math',
      question: 'Quelle est la valeur de 1010₂ + 0011₂ en binaire ?',
      options: ['1101', '1110', '1011', '1001'],
      correctAnswer: 0,
      timeLimit: 15,
      explanation: '1010₂ (10) + 0011₂ (3) = 1101₂ (13 en décimal)'
    },
    {
      id: 12,
      category: 'psycho',
      question: 'Dans quel ordre les paramètres sont-ils évalués lors de l\'appel d\'une procédure ?',
      options: ['De gauche à droite', 'De droite à gauche', 'Dépend du langage', 'Aléatoirement'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: 'L\'ordre d\'évaluation des paramètres dépend du langage de programmation utilisé.'
    },
    {
      id: 13,
      category: 'math',
      question: 'Quelle mémoire perd son contenu lorsque l\'ordinateur est éteint ?',
      options: ['ROM', 'Disque dur', 'RAM', 'SSD'],
      correctAnswer: 2,
      timeLimit: 15,
      explanation: 'La RAM (Random Access Memory) est une mémoire volatile qui perd son contenu sans alimentation électrique.'
    },
    {
      id: 14,
      category: 'psycho',
      question: 'Quel algorithme permet de rechercher un élément dans un tableau trié ?',
      options: ['Recherche séquentielle', 'Recherche dichotomique', 'Tri à bulles', 'Tri rapide'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: 'La recherche dichotomique (binaire) est efficace sur un tableau trié avec une complexité O(log n).'
    },
    {
      id: 15,
      category: 'math',
      question: 'Convertissez 2A₁₆ (hexadécimal) en décimal.',
      options: ['40', '42', '44', '46'],
      correctAnswer: 1,
      timeLimit: 15,
      explanation: '2A en hexadécimal = 2×16 + A×1 = 2×16 + 10×1 = 32 + 10 = 42 en décimal'
    }
  ];

  const [selectedQuiz, setSelectedQuiz] = useState<'math' | 'info' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    whatsapp: '',
    email: ''
  });

  // Sélectionner les questions en fonction du quiz choisi
  const questions = selectedQuiz === 'math' ? mathQuestions : selectedQuiz === 'info' ? infoQuestions : [];
  const currentQuestion = selectedQuiz ? questions[currentQuestionIndex] : null;

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

  const handleStartQuiz = (quizType: 'math' | 'info') => {
    setSelectedQuiz(quizType);
    setQuizStarted(true);
    setTimeLeft(15);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleTimeUp = () => {
    // Si le temps est écoulé, enregistrer null (pas de réponse)
    setUserAnswers([...userAnswers, null]);
    handleNextQuestion();
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    // Enregistrer la réponse de l'utilisateur
    setUserAnswers([...userAnswers, selectedAnswer]);

    // Vérifier si c'est correct et mettre à jour le score
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Passer directement à la question suivante (sans afficher l'explication)
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit);
    } else {
      // Quiz terminé, afficher le formulaire
      setShowForm(true);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Afficher les résultats immédiatement
    setQuizFinished(true);
    setShowForm(false);
    setIsSubmitting(false);

    // Envoi en arrière-plan (optionnel si Google Sheets est configuré)
    try {
      // URL de votre Google Apps Script Web App
      // Remplacez cette URL par celle de votre script déployé
      const GOOGLE_SCRIPT_URL = 'VOTRE_URL_GOOGLE_SCRIPT_ICI';

      // Ne pas envoyer si l'URL n'est pas configurée
      if (GOOGLE_SCRIPT_URL === 'VOTRE_URL_GOOGLE_SCRIPT_ICI') {
        console.log('Google Sheets non configuré. Données non envoyées.');
        console.log('Données du formulaire:', {
          nom: formData.nom,
          prenom: formData.prenom,
          whatsapp: formData.whatsapp,
          email: formData.email,
          score: score,
          totalQuestions: questions.length,
          pourcentage: Math.round((score / questions.length) * 100)
        });
        return;
      }

      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        whatsapp: formData.whatsapp,
        email: formData.email,
        quizType: selectedQuiz === 'math' ? 'Mathématiques' : 'Informatique',
        score: score,
        totalQuestions: questions.length,
        pourcentage: Math.round((score / questions.length) * 100),
        date: new Date().toLocaleString('fr-FR'),
        reponses: userAnswers.slice(0, questions.length).map((ans, i) => ({
          question: i + 1,
          reponse: ans !== null ? String.fromCharCode(65 + ans) : 'Pas de réponse',
          correct: ans === questions[i].correctAnswer
        }))
      };

      // Envoi vers Google Sheets en arrière-plan
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Données envoyées avec succès à Google Sheets');
    } catch (error) {
      console.error('Erreur lors de l\'envoi vers Google Sheets:', error);
      // On n'empêche pas l'affichage des résultats en cas d'erreur
    }
  };

  const handleRestartQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(15);
    setQuizStarted(false);
    setQuizFinished(false);
    setShowForm(false);
    setUserAnswers([]);
    setFormData({
      nom: '',
      prenom: '',
      whatsapp: '',
      email: ''
    });
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: 'Excellent ! Vous maîtrisez bien les bases !', color: 'text-green-600' };
    if (percentage >= 60) return { message: 'Bon travail ! Continuez à vous entraîner.', color: 'text-blue-600' };
    if (percentage >= 40) return { message: 'Pas mal, mais il faut réviser encore.', color: 'text-yellow-600' };
    return { message: 'Continuez vos efforts, la pratique fait la perfection !', color: 'text-orange-600' };
  };

  // Écran de sélection du quiz
  if (!quizStarted && selectedQuiz === null) {
    return (
      <section id="quiz" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Brain className="mx-auto mb-4 text-purple-600" size={64} />
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Choisissez votre Quiz
            </h2>
            <p className="text-xl text-gray-600">Sélectionnez le domaine dans lequel vous souhaitez être évalué</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Quiz Mathématiques */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop"
                  alt="Mathématiques"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-pink-600/90 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-3">🔢</div>
                    <h3 className="text-3xl font-bold">Mathématiques</h3>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-500 uppercase">Contenu</span>
                    <span className="text-sm font-bold text-orange-600">15 Questions</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Algèbre et équations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Géométrie et calculs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Probabilités et statistiques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Proportionnalité et fractions</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">~4 min</div>
                    <div className="text-sm text-gray-600">Durée</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-xl">
                    <div className="text-2xl font-bold text-pink-600">15s</div>
                    <div className="text-sm text-gray-600">Par question</div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz('math')}
                  className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-4 rounded-xl hover:from-orange-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Commencer le Quiz Math
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Quiz Informatique */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop"
                  alt="Informatique"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-blue-600/90 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-3">💻</div>
                    <h3 className="text-3xl font-bold">Informatique</h3>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-500 uppercase">Contenu</span>
                    <span className="text-sm font-bold text-purple-600">15 Questions</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Architecture des ordinateurs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Algorithmique et structures de données</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Systèmes de numération (binaire, hexa)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Procédures, fonctions et tableaux</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">~4 min</div>
                    <div className="text-sm text-gray-600">Durée</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">15s</div>
                    <div className="text-sm text-gray-600">Par question</div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz('info')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Commencer le Quiz Info
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <Clock className="text-gray-600" size={20} />
              <span className="text-gray-700 font-medium">15 secondes par question • Corrigé détaillé • Résultats instantanés</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Écran de formulaire
  if (showForm) {
    return (
      <section id="quiz" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-64">
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=400&fit=crop"
                alt="Formulaire"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90 flex items-center justify-center">
                <div className="text-center text-white">
                  <Trophy className="mx-auto mb-4" size={64} />
                  <h2 className="text-4xl font-bold mb-2">Bravo !</h2>
                  <p className="text-xl text-purple-200">Une dernière étape avant vos résultats</p>
                </div>
              </div>
            </div>

            <div className="p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Vos informations
              </h3>
              <p className="text-center text-gray-600 mb-8">
                Merci de remplir ce formulaire pour recevoir vos résultats détaillés
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-900 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-900 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-900 mb-2">
                    Numéro WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    placeholder="+225 XX XX XX XX XX"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Voir mes résultats
                      <ChevronRight size={20} />
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

  // Écran de résultats
  if (quizFinished) {
    const scoreData = getScoreMessage();
    const percentage = Math.round((score / questions.length) * 100);
    const quizTypeName = selectedQuiz === 'math' ? 'Mathématiques' : 'Informatique';
    const quizTypeColor = selectedQuiz === 'math' ? 'from-orange-600 to-pink-600' : 'from-purple-600 to-blue-600';

    return (
      <section id="quiz" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-64">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=400&fit=crop"
                alt="Résultats"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${quizTypeColor}/90 flex items-center justify-center`}>
                <div className="text-center text-white">
                  <Trophy className="mx-auto mb-4" size={64} />
                  <h2 className="text-4xl font-bold mb-2">Quiz Terminé !</h2>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mt-2">
                    <span className="text-lg font-semibold">{selectedQuiz === 'math' ? '🔢' : '💻'} {quizTypeName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12">
              <div className="text-center mb-8">
                <div className="inline-block relative">
                  <svg className="w-48 h-48" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={percentage >= 60 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="20"
                      strokeDasharray={`${percentage * 5.65} 565`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-5xl font-bold text-gray-900">{score}/{questions.length}</div>
                      <div className="text-xl text-gray-600">{percentage}%</div>
                    </div>
                  </div>
                </div>

                <h3 className={`text-2xl font-bold mt-6 ${scoreData.color}`}>
                  {scoreData.message}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className={`${selectedQuiz === 'math' ? 'bg-orange-50' : 'bg-purple-50'} p-6 rounded-xl`}>
                  <h4 className="font-bold text-gray-900 mb-3">Statistiques</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Bonnes réponses</span>
                      <span className={`font-semibold ${selectedQuiz === 'math' ? 'text-orange-600' : 'text-purple-600'}`}>
                        {score}/{questions.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Mauvaises réponses</span>
                      <span className="font-semibold text-red-600">
                        {userAnswers.filter((ans, i) => ans !== null && questions[i] && ans !== questions[i].correctAnswer).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Sans réponse</span>
                      <span className="font-semibold text-gray-600">
                        {userAnswers.filter(ans => ans === null).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-3">Recommandations</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {percentage < 60 && (
                      <>
                        <li>• Révisez l'architecture des ordinateurs</li>
                        <li>• Pratiquez la conversion binaire/hexa</li>
                        <li>• Étudiez les structures de données</li>
                      </>
                    )}
                    {percentage >= 60 && percentage < 80 && (
                      <>
                        <li>• Approfondissez l'algorithmique</li>
                        <li>• Révisez les procédures & fonctions</li>
                        <li>• Entraînez-vous aux calculs de complexité</li>
                      </>
                    )}
                    {percentage >= 80 && (
                      <>
                        <li>• Excellente maîtrise des concepts !</li>
                        <li>• Vous êtes prêt pour la formation Big Data</li>
                        <li>• Continuez à pratiquer régulièrement</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Section Corrigé - Toutes les réponses */}
              <div className="mt-12 border-t-2 border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Corrigé du Quiz</h3>
                <div className="space-y-4">
                  {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const wasCorrect = userAnswer === q.correctAnswer;
                    const noAnswer = userAnswer === null;

                    return (
                      <div key={q.id} className={`border-2 rounded-xl p-6 ${wasCorrect ? 'border-green-200 bg-green-50' : noAnswer ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${wasCorrect ? 'bg-green-500' : noAnswer ? 'bg-gray-400' : 'bg-red-500'}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-2">{q.question}</p>

                            {/* Afficher la réponse de l'utilisateur */}
                            {noAnswer && (
                              <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                                <p className="text-sm text-yellow-800">⏱️ Temps écoulé - Pas de réponse</p>
                              </div>
                            )}
                            {!noAnswer && !wasCorrect && (
                              <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                                <p className="text-sm text-red-800">❌ Votre réponse : {String.fromCharCode(65 + userAnswer!)}. {q.options[userAnswer!]}</p>
                              </div>
                            )}
                            {wasCorrect && (
                              <div className="mb-3 p-2 bg-green-100 border border-green-300 rounded-lg">
                                <p className="text-sm text-green-800">✅ Bonne réponse !</p>
                              </div>
                            )}

                            <div className="space-y-2">
                              {q.options.map((option, optIndex) => {
                                const isCorrect = optIndex === q.correctAnswer;
                                const isUserAnswer = optIndex === userAnswer && !wasCorrect;

                                return (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded-lg ${
                                      isCorrect
                                        ? 'bg-green-200 font-semibold border-2 border-green-400'
                                        : isUserAnswer
                                        ? 'bg-red-100 border-2 border-red-300'
                                        : 'bg-white'
                                    }`}
                                  >
                                    <span className="text-gray-700">
                                      {String.fromCharCode(65 + optIndex)}. {option}
                                      {isCorrect && ' ✓ (Bonne réponse)'}
                                      {isUserAnswer && ' ✗ (Votre réponse)'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {q.explanation && (
                              <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                                <p className="text-sm text-blue-900">
                                  <span className="font-semibold">💡 Explication :</span> {q.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleRestartQuiz}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  {selectedQuiz === 'math' ? 'Essayer le Quiz Info' : 'Essayer le Quiz Math'}
                </button>
                <button
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      const element = document.getElementById('formation');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`flex-1 border-2 ${selectedQuiz === 'math' ? 'border-orange-600 text-orange-600 hover:bg-orange-50' : 'border-purple-600 text-purple-600 hover:bg-purple-50'} py-4 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2`}
                >
                  Voir les Formations
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Écran de question
  const headerGradient = selectedQuiz === 'math' ? 'from-orange-600 to-pink-600' : 'from-purple-600 to-blue-600';
  const progressGradient = selectedQuiz === 'math' ? 'from-orange-600 to-pink-600' : 'from-purple-600 to-blue-600';
  const accentColor = selectedQuiz === 'math' ? 'orange' : 'purple';

  return (
    <section
      id="quiz"
      className="py-20 bg-gradient-to-br from-purple-50 to-blue-50"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* En-tête */}
          <div className={`bg-gradient-to-r ${headerGradient} p-6`}>
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <span className="font-semibold">{selectedQuiz === 'math' ? '🔢 Mathématiques' : '💻 Informatique'}</span>
                </div>
                <div className="text-sm">
                  Question {currentQuestionIndex + 1} / {questions.length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-300' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="h-2 bg-gray-200">
            <div
              className={`h-full bg-gradient-to-r ${progressGradient} transition-all duration-300`}
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const borderColor = selectedQuiz === 'math' ? 'orange' : 'purple';

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 select-none ${
                      isSelected
                        ? `border-${borderColor}-600 bg-${borderColor}-50`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      borderColor: isSelected ? (selectedQuiz === 'math' ? '#ea580c' : '#9333ea') : undefined,
                      backgroundColor: isSelected ? (selectedQuiz === 'math' ? '#ffedd5' : '#f3e8ff') : undefined
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all`}
                        style={{
                          borderColor: isSelected ? (selectedQuiz === 'math' ? '#ea580c' : '#9333ea') : '#d1d5db',
                          backgroundColor: isSelected ? (selectedQuiz === 'math' ? '#ea580c' : '#9333ea') : 'transparent',
                          color: isSelected ? 'white' : '#6b7280'
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium text-gray-900">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bouton */}
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`w-full bg-gradient-to-r ${headerGradient} text-white py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              style={{
                background: selectedAnswer !== null ? (selectedQuiz === 'math' ? 'linear-gradient(to right, #ea580c, #ec4899)' : 'linear-gradient(to right, #9333ea, #2563eb)') : undefined
              }}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Valider et passer à la suivante' : 'Valider et voir les résultats'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
