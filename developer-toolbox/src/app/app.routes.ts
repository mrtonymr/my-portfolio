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
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'json',
        loadComponent: () =>
          import('./pages/json/json.component').then((m) => m.JsonComponent),
      },
      {
        path: 'base64',
        loadComponent: () =>
          import('./pages/base64/base64.component').then((m) => m.Base64Component),
      },
      {
        path: 'jwt',
        loadComponent: () =>
          import('./pages/jwt/jwt.component').then((m) => m.JwtComponent),
      },
      {
        path: 'uuid',
        loadComponent: () =>
          import('./pages/uuid/uuid.component').then((m) => m.UuidComponent),
      },
      {
        path: 'timestamp',
        loadComponent: () =>
          import('./pages/timestamp/timestamp.component').then((m) => m.TimestampComponent),
      },
      {
        path: 'url',
        loadComponent: () =>
          import('./pages/url/url.component').then((m) => m.UrlComponent),
      },
      {
        path: 'color',
        loadComponent: () =>
          import('./pages/color/color.component').then((m) => m.ColorComponent),
      },
      {
        path: 'regex',
        loadComponent: () =>
          import('./pages/regex/regex.component').then((m) => m.RegexComponent),
      },
      {
        path: 'regex-ai',
        loadComponent: () =>
          import('./pages/regex-ai/regex-ai.component').then((m) => m.RegexAiComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
