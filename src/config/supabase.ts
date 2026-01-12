import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Quiz scores will not be saved.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Types pour les scores de quiz
export interface QuizScore {
  id?: string;
  user_id: string;
  user_email: string;
  quiz_type: 'math' | 'info';
  score: number;
  total_questions: number;
  percentage: number;
  created_at?: string;
}

// Type pour les admins
export interface Admin {
  id?: string;
  user_id: string;
  user_email: string;
  created_at?: string;
}

// Type pour les statistiques utilisateur
export interface UserStats {
  user_email: string;
  user_id: string;
  total_quizzes: number;
  avg_percentage: number;
  best_math: number | null;
  best_info: number | null;
  last_quiz_date: string | null;
}

// Service pour les scores
export const quizScoreService = {
  // Sauvegarder un score
  async saveScore(score: Omit<QuizScore, 'id' | 'created_at'>): Promise<QuizScore | null> {
    const { data, error } = await supabase
      .from('quiz_scores')
      .insert([score])
      .select()
      .single();

    if (error) {
      console.error('Error saving score:', error);
      return null;
    }
    return data;
  },

  // Récupérer les scores d'un utilisateur
  async getUserScores(userId: string): Promise<QuizScore[]> {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
    return data || [];
  },

  // Récupérer le meilleur score d'un utilisateur pour un type de quiz
  async getBestScore(userId: string, quizType: 'math' | 'info'): Promise<QuizScore | null> {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_type', quizType)
      .order('percentage', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching best score:', error);
      return null;
    }
    return data;
  }
};

// Service Admin
export const adminService = {
  // Vérifier si un utilisateur est admin
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) {
      return false;
    }
    return !!data;
  },

  // Récupérer tous les scores (admin only)
  async getAllScores(): Promise<QuizScore[]> {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all scores:', error);
      return [];
    }
    return data || [];
  },

  // Récupérer les statistiques par utilisateur
  async getUsersStats(): Promise<UserStats[]> {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stats:', error);
      return [];
    }

    // Grouper par utilisateur
    const userMap = new Map<string, QuizScore[]>();
    (data || []).forEach((score: QuizScore) => {
      const existing = userMap.get(score.user_id) || [];
      existing.push(score);
      userMap.set(score.user_id, existing);
    });

    // Calculer les stats
    const stats: UserStats[] = [];
    userMap.forEach((scores, odlUserId) => {
      const mathScores = scores.filter(s => s.quiz_type === 'math');
      const infoScores = scores.filter(s => s.quiz_type === 'info');

      stats.push({
        user_id: odlUserId,
        user_email: scores[0].user_email,
        total_quizzes: scores.length,
        avg_percentage: Math.round(scores.reduce((acc, s) => acc + s.percentage, 0) / scores.length),
        best_math: mathScores.length > 0 ? Math.max(...mathScores.map(s => s.percentage)) : null,
        best_info: infoScores.length > 0 ? Math.max(...infoScores.map(s => s.percentage)) : null,
        last_quiz_date: scores[0].created_at || null
      });
    });

    return stats.sort((a, b) => b.avg_percentage - a.avg_percentage);
  },

  // Récupérer les scores d'un utilisateur spécifique (pour admin)
  async getScoresByUser(userId: string): Promise<QuizScore[]> {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user scores:', error);
      return [];
    }
    return data || [];
  },

  // Statistiques globales
  async getGlobalStats(): Promise<{
    totalUsers: number;
    totalQuizzes: number;
    avgScore: number;
    mathQuizzes: number;
    infoQuizzes: number;
  }> {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*');

    if (error || !data) {
      return { totalUsers: 0, totalQuizzes: 0, avgScore: 0, mathQuizzes: 0, infoQuizzes: 0 };
    }

    const uniqueUsers = new Set(data.map((s: QuizScore) => s.user_id));
    const mathQuizzes = data.filter((s: QuizScore) => s.quiz_type === 'math').length;
    const infoQuizzes = data.filter((s: QuizScore) => s.quiz_type === 'info').length;
    const avgScore = data.length > 0
      ? Math.round(data.reduce((acc: number, s: QuizScore) => acc + s.percentage, 0) / data.length)
      : 0;

    return {
      totalUsers: uniqueUsers.size,
      totalQuizzes: data.length,
      avgScore,
      mathQuizzes,
      infoQuizzes
    };
  }
};
