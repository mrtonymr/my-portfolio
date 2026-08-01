import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly name = 'Tony MR';
  readonly role = 'Senior Software Engineer';

  readonly focusAreas = [
    {
      title: 'Product engineering',
      detail: 'End-to-end features from architecture through polished UI.',
    },
    {
      title: 'Frontend systems',
      detail: 'Scalable Angular apps with clean patterns and strong UX.',
    },
    {
      title: 'API & platforms',
      detail: 'Reliable services, thoughtful integrations, and clear contracts.',
    },
  ];

  readonly projects = [
    {
      name: 'Platform modernization',
      summary: 'Led migration of legacy modules into a modular Angular workspace.',
      year: '2025',
    },
    {
      name: 'Realtime dashboard',
      summary: 'Built live operational views with resilient data streaming.',
      year: '2024',
    },
    {
      name: 'Design system rollout',
      summary: 'Unified component language across product surfaces.',
      year: '2024',
    },
  ];
}
