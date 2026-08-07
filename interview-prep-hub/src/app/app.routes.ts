import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'questions',
        loadComponent: () =>
          import('./features/questions/questions-list.component').then(
            (m) => m.QuestionsListComponent,
          ),
      },
      {
        path: 'questions/:id',
        loadComponent: () =>
          import('./features/questions/question-detail.component').then(
            (m) => m.QuestionDetailComponent,
          ),
      },
      {
        path: 'ai-questions',
        loadComponent: () =>
          import('./features/ai-questions/ai-questions.component').then(
            (m) => m.AiQuestionsComponent,
          ),
      },
      {
        path: 'bookmarks',
        loadComponent: () =>
          import('./features/bookmarks/bookmarks.component').then((m) => m.BookmarksComponent),
      },
      {
        path: 'flashcards',
        loadComponent: () =>
          import('./features/flashcards/flashcards.component').then((m) => m.FlashcardsComponent),
      },
      {
        path: 'mock-interview',
        loadComponent: () =>
          import('./features/mock-interview/mock-interview.component').then(
            (m) => m.MockInterviewComponent,
          ),
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./features/statistics/statistics.component').then((m) => m.StatisticsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about.component').then((m) => m.AboutComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
