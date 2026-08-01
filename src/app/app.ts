import { Component } from '@angular/core';

type SkillGroup = {
  group: string;
  tone: 'fe' | 'be' | 'ops' | 'ai';
  items: string[];
};

type Job = {
  company: string;
  role: string;
  period: string;
  place: string;
  project: string;
  stack: string[];
  summary: string;
  highlights: string[];
};

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly name = 'Tony M R';
  readonly role = 'Senior Software Engineer';
  readonly location = 'Mundakayam, India';
  readonly email = 'medayiltony@gmail.com';
  readonly phone = '+91 8129870567';
  readonly linkedin = 'https://www.linkedin.com/in/tony-mr';
  readonly linkedinLabel = 'linkedin.com/in/tony-mr';
  readonly tagline =
    'Full-stack engineer building scalable SaaS products with Laravel, Angular, and clean architecture.';

  darkMode = false;
  menuOpen = false;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved === 'dark' || saved === 'light') {
        this.darkMode = saved === 'dark';
      } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.darkMode = true;
      }
    }
    if (typeof document !== 'undefined') {
      document.body.style.background = this.darkMode ? '#0f141c' : '#e9edf2';
      document.body.style.color = this.darkMode ? '#eef2f7' : '#141821';
    }
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('portfolio-theme', this.darkMode ? 'dark' : 'light');
    }
    if (typeof document !== 'undefined') {
      document.body.style.background = this.darkMode ? '#0f141c' : '#e9edf2';
      document.body.style.color = this.darkMode ? '#eef2f7' : '#141821';
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  readonly heroStack = [
    'Angular',
    'Laravel',
    'TypeScript',
    'RAG',
    'LanceDB',
    'Claude',
    'Cursor',
  ];

  readonly about = `Experienced full-stack software developer with over 9 years of hands-on experience building and maintaining scalable, high-performance SaaS applications. Strong expertise in Laravel for backend development and Angular for dynamic, responsive frontends. Proven ability to manage the entire software development lifecycle — from system design and architecture to coding, testing, and deployment. Committed to delivering clean, maintainable code and innovative solutions that align with business goals and enhance user experience.`;

  readonly focusAreas = [
    {
      title: 'Full-stack SaaS',
      detail:
        'End-to-end delivery of scalable SaaS products across Laravel backends and Angular frontends.',
    },
    {
      title: 'Frontend systems',
      detail:
        'Responsive Angular interfaces with PrimeNG, Storybook, and strong collaboration with design.',
    },
    {
      title: 'Platform & delivery',
      detail:
        'Databases, APIs, Docker, CI/CD, and reliable shipping across the full development lifecycle.',
    },
  ];

  readonly experience: Job[] = [
    {
      company: 'Vofox Solutions Pvt Ltd',
      role: 'Senior Software Engineer',
      period: 'July 2025 — Present',
      place: 'Kochi, Kerala',
      project: 'Health Care Product Management',
      stack: ['Angular', 'AI Automation', 'RAG', 'LanceDB'],
      summary:
        'Working with the Components Team on library management — adding features, troubleshooting across the team, fixing bugs, and reviewing merge requests with CI/CD for continuous integration and deployment. Also contributing to AI automation initiatives and researching agent creation.',
      highlights: [
        'Added features and fixed bugs across shared component libraries',
        'Reviewed merge requests and supported team-wide troubleshooting',
        'Leveraged CI/CD pipelines for continuous integration and deployment',
        'Worked on AI automation to streamline product and engineering workflows',
        'Researched agent creation patterns for building reliable AI-assisted systems',
      ],
    },
    {
      company: 'Fingent Global Solutions',
      role: 'Senior Software Engineer',
      period: 'June 2020 — July 2025',
      place: 'Kochi, Kerala',
      project: 'Enterprise Field Service Management Software',
      stack: ['Angular', 'Laravel', 'MySQL', 'Lumen', 'Docker', 'Django'],
      summary:
        'Key member of a core team of 5 contributing to feature planning, database design, and product improvement for an enterprise field service platform.',
      highlights: [
        'Wrote testable, clean, efficient code based on specifications',
        'Worked with databases, servers, APIs, version control, and third-party apps',
        'Collaborated with UX/UI designers to turn mockups into responsive interfaces',
        'Led data migration for a recurrence revamp, moving all data to the new structure',
        'Supported onboarding for new hires with knowledge transfer and system setup',
      ],
    },
    {
      company: 'DRD Communications And Software Pvt Ltd',
      role: 'Software Developer',
      period: 'May 2018 — May 2020',
      place: 'Kochi, Kerala',
      project: 'UBOSS',
      stack: ['PHP', 'Laravel', 'MySQL', 'Python', 'Django'],
      summary:
        'Contributed to end-to-end development across Business, Service, User, Enterprise, and related modules in UBOSS, improving system efficiency and scalability.',
      highlights: [
        'Built and enhanced modules across the full UBOSS product surface',
        'Improved overall system efficiency and scalability',
        'Received Best Performer Award at DRD Communications',
      ],
    },
    {
      company: 'Saasvaap Techies Pvt Ltd',
      role: 'Junior Software Engineer',
      period: 'Feb 2017 — May 2018',
      place: 'Kochi, Kerala',
      project: 'Government of Kerala ERP',
      stack: ['PHP', 'CodeIgniter', 'MySQL', 'Python', 'Flask'],
      summary:
        'Played a key role in developing and maintaining the Accounts and HR modules of the Government of Kerala’s ERP system.',
      highlights: [
        'Built and maintained Accounts and HR modules',
        'Supported robust financial and employee management workflows',
      ],
    },
  ];

  readonly skills: SkillGroup[] = [
    {
      group: 'Languages',
      tone: 'be',
      items: ['PHP', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS3'],
    },
    {
      group: 'Frameworks',
      tone: 'fe',
      items: ['Angular', 'Laravel', 'CodeIgniter', 'Django', 'Flask', 'Bootstrap', 'PrimeNG'],
    },
    {
      group: 'AI & Agents',
      tone: 'ai',
      items: [
        'RAG',
        'LanceDB',
        'AI Automation',
        'Agent Creation',
        'Claude',
        'Cursor',
        'GitHub Copilot',
        'Augment Code',
      ],
    },
    {
      group: 'Tools',
      tone: 'ops',
      items: ['MySQL', 'Docker', 'Git', 'SVN', 'NPM', 'NVM', 'JIRA', 'Storybook', 'VS Code'],
    },
  ];

  readonly education = [
    {
      school: 'Amal Jyothi College Of Engineering, Kanjirapally',
      degree: 'MCA',
      period: '2013 — 2016',
      detail: 'Percentage: 72%',
    },
    {
      school: 'IHRD Kuttikkanam',
      degree: 'BSc Electronics',
      period: '2014 — 2016',
      detail: 'Percentage: 78%',
    },
  ];

  readonly projects = [
    {
      name: 'Health Care Product Management',
      summary:
        'Angular component library work at Vofox — features, bug fixes, MR reviews, CI/CD, plus AI automation and agent-creation research.',
      year: '2025',
      tags: ['Angular', 'CI/CD', 'AI Automation', 'RAG', 'LanceDB'],
    },
    {
      name: 'Enterprise Field Service Management',
      summary:
        'Full-stack SaaS platform at Fingent with Angular, Laravel, Docker, and major data migration.',
      year: '2020',
      tags: ['Angular', 'Laravel', 'Docker'],
    },
    {
      name: 'UBOSS',
      summary:
        'End-to-end module development across Business, Service, User, and Enterprise at DRD.',
      year: '2018',
      tags: ['Laravel', 'PHP', 'Django'],
    },
    {
      name: 'Kerala Government ERP',
      summary: 'Accounts and HR modules for a government ERP using PHP, CodeIgniter, and Flask.',
      year: '2017',
      tags: ['CodeIgniter', 'Flask', 'MySQL'],
    },
  ];

  readonly achievements = ['Best Performer Award — DRD Communications'];

  activeSkill: string | null = null;

  toggleSkill(skill: string): void {
    this.activeSkill = this.activeSkill === skill ? null : skill;
  }

  isSkillActive(skill: string): boolean {
    return this.activeSkill === skill;
  }

  jobMatchesFilter(job: Job): boolean {
    if (!this.activeSkill) {
      return true;
    }
    return job.stack.some((item) => item.toLowerCase() === this.activeSkill!.toLowerCase());
  }

  projectMatchesFilter(tags: string[]): boolean {
    if (!this.activeSkill) {
      return true;
    }
    return tags.some((tag) => tag.toLowerCase() === this.activeSkill!.toLowerCase());
  }
}
