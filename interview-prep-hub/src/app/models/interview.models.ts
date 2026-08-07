export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category =
  | 'JavaScript'
  | 'TypeScript'
  | 'Angular'
  | 'React'
  | 'HTML'
  | 'CSS'
  | 'NodeJS'
  | 'SQL'
  | 'System Design'
  | 'HR';

export interface Question {
  id: string;
  title: string;
  question: string;
  answer: string;
  examples?: string[];
  difficulty: Difficulty;
  category: Category;
  company: string[];
  tags: string[];
  estimatedTime: number;
  relatedQuestions: string[];
  source?: 'bundled' | 'groq';
}

export interface UserNote {
  questionId: string;
  content: string;
  updatedAt: string;
}

export interface AppSettings {
  darkMode: boolean;
  animations: boolean;
}

export interface MockSessionResult {
  id: string;
  startedAt: string;
  finishedAt: string;
  category: Category | 'All';
  difficulty: Difficulty | 'All';
  questionCount: number;
  ratings: Record<string, 'knew' | 'partial' | 'unknown'>;
  score: number;
}

export interface RecentActivity {
  id: string;
  type: 'completed' | 'bookmarked' | 'note' | 'mock' | 'viewed';
  questionId?: string;
  label: string;
  at: string;
}

export interface UserProgressState {
  bookmarks: string[];
  completed: string[];
  notes: UserNote[];
  recentlyViewed: string[];
  activity: RecentActivity[];
  mockHistory: MockSessionResult[];
  streakDays: string[];
  lastDailyQuestionId: string | null;
  lastDailyQuestionDate: string | null;
}

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  animations: true,
};

export const DEFAULT_PROGRESS: UserProgressState = {
  bookmarks: [],
  completed: [],
  notes: [],
  recentlyViewed: [],
  activity: [],
  mockHistory: [],
  streakDays: [],
  lastDailyQuestionId: null,
  lastDailyQuestionDate: null,
};

export const CATEGORIES: Category[] = [
  'JavaScript',
  'TypeScript',
  'Angular',
  'React',
  'HTML',
  'CSS',
  'NodeJS',
  'SQL',
  'System Design',
  'HR',
];

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
