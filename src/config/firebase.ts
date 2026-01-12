import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "VOTRE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "VOTRE_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "VOTRE_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "VOTRE_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "VOTRE_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "VOTRE_APP_ID"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter l'instance d'authentification
export const auth = getAuth(app);

// Exporter Firestore
export const db = getFirestore(app);

// Types
export interface QuizScore {
  id?: string;
  user_id: string;
  user_email: string;
  quiz_type: 'info' | 'proba' | 'mathgen';
  score: number;
  total_questions: number;
  percentage: number;
  created_at?: string;
}

export interface FirestoreUser {
  id: string;
  email: string;
  email_verified: boolean;
  created_at?: string;
  last_login?: string;
  admin_status?: 'pending' | 'approved' | 'rejected';
}

export interface UserStats {
  user_email: string;
  user_id: string;
  total_quizzes: number;
  avg_percentage: number;
  best_info: number | null;
  best_proba: number | null;
  best_mathgen: number | null;
  last_quiz_date: string | null;
  created_at?: string;
  admin_status?: 'pending' | 'approved' | 'rejected';
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at?: string;
  read?: boolean;
}

// Service pour les scores
export const quizScoreService = {
  // Sauvegarder un score
  async saveScore(score: Omit<QuizScore, 'id' | 'created_at'>): Promise<QuizScore | null> {
    try {
      const docRef = await addDoc(collection(db, 'quiz_scores'), {
        ...score,
        created_at: Timestamp.now()
      });
      return { ...score, id: docRef.id, created_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error saving score:', error);
      return null;
    }
  },

  // Récupérer les scores d'un utilisateur
  async getUserScores(userId: string): Promise<QuizScore[]> {
    try {
      // Requête simple sans orderBy pour éviter le besoin d'index composite
      const q = query(
        collection(db, 'quiz_scores'),
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const scores = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at
        } as QuizScore;
      });
      // Trier côté client par date décroissante
      return scores.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  },

  // Récupérer le meilleur score d'un utilisateur pour un type de quiz
  async getBestScore(userId: string, quizType: 'info' | 'proba' | 'mathgen'): Promise<QuizScore | null> {
    try {
      // Récupérer tous les scores de l'utilisateur pour ce type de quiz
      const q = query(
        collection(db, 'quiz_scores'),
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      // Filtrer par type et trouver le meilleur score côté client
      const scores = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at
          } as QuizScore;
        })
        .filter(score => score.quiz_type === quizType);

      if (scores.length === 0) return null;

      // Retourner le score avec le meilleur pourcentage
      return scores.reduce((best, current) =>
        current.percentage > best.percentage ? current : best
      );
    } catch (error) {
      console.error('Error fetching best score:', error);
      return null;
    }
  }
};

// Service Admin
export const adminService = {
  // Vérifier si un utilisateur est admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'admins'),
        where('user_id', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking admin:', error);
      return false;
    }
  },

  // Récupérer tous les utilisateurs inscrits
  async getAllUsers(): Promise<FirestoreUser[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          email_verified: data.email_verified || false,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          last_login: data.last_login?.toDate?.()?.toISOString() || data.last_login,
          admin_status: data.admin_status || undefined
        } as FirestoreUser;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Mettre à jour le statut admin d'un utilisateur
  async updateUserAdminStatus(userId: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
      console.log('Attempting to update user:', userId, 'with status:', status);
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        admin_status: status
      }, { merge: true });
      console.log('Update successful');
      return true;
    } catch (error: unknown) {
      console.error('Error updating admin status:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
      }
      return false;
    }
  },

  // Récupérer le statut admin d'un utilisateur
  async getUserAdminStatus(userId: string): Promise<'pending' | 'approved' | 'rejected' | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) return null;
      const data = userDocSnap.data();
      return data.admin_status || null;
    } catch (error) {
      console.error('Error fetching admin status:', error);
      return null;
    }
  },

  // Écouter les changements de statut admin en temps réel
  subscribeToUserAdminStatus(
    userId: string,
    callback: (status: 'pending' | 'approved' | 'rejected' | null) => void
  ): () => void {
    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback(data.admin_status || null);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error listening to admin status:', error);
      callback(null);
    });
    return unsubscribe;
  },

  // Récupérer tous les scores (admin only)
  async getAllScores(): Promise<QuizScore[]> {
    try {
      const q = query(
        collection(db, 'quiz_scores'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at
        } as QuizScore;
      });
    } catch (error) {
      console.error('Error fetching all scores:', error);
      return [];
    }
  },

  // Récupérer les statistiques par utilisateur (inclut tous les utilisateurs inscrits)
  async getUsersStats(): Promise<UserStats[]> {
    try {
      const [allUsers, allScores] = await Promise.all([
        this.getAllUsers(),
        this.getAllScores()
      ]);

      // Grouper les scores par utilisateur
      const scoresByUser = new Map<string, QuizScore[]>();
      allScores.forEach((score) => {
        const existing = scoresByUser.get(score.user_id) || [];
        existing.push(score);
        scoresByUser.set(score.user_id, existing);
      });

      // Créer les stats pour tous les utilisateurs
      const stats: UserStats[] = allUsers.map(user => {
        const userScores = scoresByUser.get(user.id) || [];
        const infoScores = userScores.filter(s => s.quiz_type === 'info');
        const probaScores = userScores.filter(s => s.quiz_type === 'proba');
        const mathgenScores = userScores.filter(s => s.quiz_type === 'mathgen');

        return {
          user_id: user.id,
          user_email: user.email,
          total_quizzes: userScores.length,
          avg_percentage: userScores.length > 0
            ? Math.round(userScores.reduce((acc, s) => acc + s.percentage, 0) / userScores.length)
            : 0,
          best_info: infoScores.length > 0 ? Math.max(...infoScores.map(s => s.percentage)) : null,
          best_proba: probaScores.length > 0 ? Math.max(...probaScores.map(s => s.percentage)) : null,
          best_mathgen: mathgenScores.length > 0 ? Math.max(...mathgenScores.map(s => s.percentage)) : null,
          last_quiz_date: userScores.length > 0 ? userScores[0].created_at || null : null,
          created_at: user.created_at,
          admin_status: user.admin_status
        };
      });

      // Trier : d'abord ceux qui ont passé des quiz, puis par date d'inscription
      return stats.sort((a, b) => {
        if (a.total_quizzes > 0 && b.total_quizzes === 0) return -1;
        if (a.total_quizzes === 0 && b.total_quizzes > 0) return 1;
        if (a.total_quizzes > 0 && b.total_quizzes > 0) {
          return b.avg_percentage - a.avg_percentage;
        }
        return 0;
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return [];
    }
  },

  // Récupérer les scores d'un utilisateur spécifique (pour admin)
  async getScoresByUser(userId: string): Promise<QuizScore[]> {
    return quizScoreService.getUserScores(userId);
  },

  // Statistiques globales
  async getGlobalStats(): Promise<{
    totalUsers: number;
    totalQuizzes: number;
    avgScore: number;
    infoQuizzes: number;
    probaQuizzes: number;
    mathgenQuizzes: number;
  }> {
    try {
      const [allUsers, allScores] = await Promise.all([
        this.getAllUsers(),
        this.getAllScores()
      ]);

      const infoQuizzes = allScores.filter(s => s.quiz_type === 'info').length;
      const probaQuizzes = allScores.filter(s => s.quiz_type === 'proba').length;
      const mathgenQuizzes = allScores.filter(s => s.quiz_type === 'mathgen').length;
      const avgScore = allScores.length > 0
        ? Math.round(allScores.reduce((acc, s) => acc + s.percentage, 0) / allScores.length)
        : 0;

      return {
        totalUsers: allUsers.length,
        totalQuizzes: allScores.length,
        avgScore,
        infoQuizzes,
        probaQuizzes,
        mathgenQuizzes
      };
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return { totalUsers: 0, totalQuizzes: 0, avgScore: 0, infoQuizzes: 0, probaQuizzes: 0, mathgenQuizzes: 0 };
    }
  }
};

// Service pour les messages de contact
export const contactService = {
  // Sauvegarder un message de contact
  async saveMessage(message: Omit<ContactMessage, 'id' | 'created_at' | 'read'>): Promise<ContactMessage | null> {
    try {
      console.log('Attempting to save contact message:', message);
      const docRef = await addDoc(collection(db, 'contact_messages'), {
        ...message,
        created_at: Timestamp.now(),
        read: false
      });
      console.log('Contact message saved successfully with ID:', docRef.id);
      return { ...message, id: docRef.id, created_at: new Date().toISOString(), read: false };
    } catch (error: unknown) {
      console.error('Error saving contact message:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return null;
    }
  },

  // Récupérer tous les messages (admin only)
  async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const q = query(
        collection(db, 'contact_messages'),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          subject: data.subject,
          message: data.message,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          read: data.read || false
        } as ContactMessage;
      });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  },

  // Marquer un message comme lu
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const messageRef = doc(db, 'contact_messages', messageId);
      await setDoc(messageRef, { read: true }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  },

  // Compter les messages non lus
  async getUnreadCount(): Promise<number> {
    try {
      const q = query(
        collection(db, 'contact_messages'),
        where('read', '==', false)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }
  }
};

export default app;
