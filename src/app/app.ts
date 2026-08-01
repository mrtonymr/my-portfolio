import { Component } from '@angular/core';

type SkillGroup = {
  group: string;
  tone: 'fe' | 'be' | 'ops' | 'ai' | 'db';
  items: string[];
};

type Job = {
  company: string;
  role: string;
  period: string;
  place: string;
  product: string;
  teamSize: string;
  stack: string[];
  summary: string;
  highlights: string[];
  impact: string;
};

type Project = {
  name: string;
  year: string;
  problem: string;
  solution: string;
  tags: string[];
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
  readonly resumeUrl = 'Tony-MR-Resume.pdf';
  readonly tagline =
    'Senior Software Engineer specializing in Laravel, NestJS, Angular, PostgreSQL, and AI-powered applications. Passionate about building scalable SaaS platforms and developer productivity tools.';

  darkMode = true;
  menuOpen = false;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      // Default is dark; only switch if the user explicitly chose light.
      if (saved === 'light') {
        this.darkMode = false;
      } else if (saved === 'dark') {
        this.darkMode = true;
      } else {
        this.darkMode = true;
        localStorage.setItem('portfolio-theme', 'dark');
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
    'Laravel',
    'NestJS',
    'Angular',
    'Python',
    'Flask',
    'PostgreSQL',
    'RAG',
    'Docker',
  ];

  readonly about = `I'm a Senior Software Engineer with experience building enterprise SaaS applications, payment systems, HRMS platforms, and AI-powered developer tools. I enjoy designing scalable backend architectures, improving developer workflows, and exploring Generative AI. Over 9+ years I've shipped products end to end — from system design and APIs to polished Angular frontends, CI/CD, and production operations.`;

  readonly focusAreas = [
    {
      title: 'Scalable SaaS platforms',
      detail:
        'Design and ship multi-tenant products with Laravel/NestJS backends and Angular frontends that hold up under real usage.',
    },
    {
      title: 'Payments & operations systems',
      detail:
        'Build invoice, payment, and HR workflows that handle high transaction volume with clear auditability.',
    },
    {
      title: 'AI-powered developer tools',
      detail:
        'Prototype and productionize RAG, agents, and AI-assisted workflows that improve how teams build software.',
    },
  ];

  readonly experience: Job[] = [
    {
      company: 'Vofox Solutions Pvt Ltd',
      role: 'Senior Software Engineer',
      period: 'July 2025 — Present',
      place: 'Kochi, Kerala',
      product: 'Healthcare product platform + AI automation initiatives',
      teamSize: 'Cross-functional components team',
      stack: ['Angular', 'CI/CD', 'RAG', 'LanceDB', 'AI Automation'],
      summary:
        'Owning shared Angular component libraries and AI automation research for a healthcare product platform — shipping features, reviewing MRs, and exploring agent-based workflows.',
      highlights: [
        'Delivered reusable Angular components used across multiple product surfaces',
        'Reduced integration bugs through stricter MR reviews and CI/CD checks',
        'Researched agent creation patterns and AI automation for engineering workflows',
        'Prototyped RAG-oriented approaches with LanceDB for knowledge-assisted features',
      ],
      impact:
        'Faster feature delivery across teams via shared libraries, plus early AI automation foundations for product workflows.',
    },
    {
      company: 'Fingent Global Solutions',
      role: 'Senior Software Engineer',
      period: 'June 2020 — July 2025',
      place: 'Kochi, Kerala',
      product: 'Enterprise Field Service Management SaaS',
      teamSize: 'Core team of 5',
      stack: ['Angular', 'Laravel', 'MySQL', 'Lumen', 'Docker', 'Django'],
      summary:
        'Key member of a 5-person core team owning feature planning, database design, and product improvements for an enterprise field service platform.',
      highlights: [
        'Led data migration for a recurrence revamp with zero critical data loss',
        'Improved API and UI responsiveness across high-traffic operational screens',
        'Partnered with design to ship responsive interfaces used daily by field teams',
        'Onboarded new engineers and shortened ramp-up through documentation and pairing',
        'Built and maintained Dockerized services for more reliable local and deploy workflows',
      ],
      impact:
        'Helped modernize a multi-year SaaS product — cleaner architecture, faster delivery, and smoother operations for enterprise customers.',
    },
    {
      company: 'DRD Communications And Software Pvt Ltd',
      role: 'Software Developer',
      period: 'May 2018 — May 2020',
      place: 'Kochi, Kerala',
      product: 'UBOSS enterprise communications platform',
      teamSize: 'Product engineering team',
      stack: ['PHP', 'Laravel', 'MySQL', 'Python', 'Django'],
      summary:
        'End-to-end development across Business, Service, User, and Enterprise modules — improving efficiency and scalability across the UBOSS platform.',
      highlights: [
        'Shipped modules used across business and enterprise customer workflows',
        'Improved system efficiency through cleaner service boundaries and query work',
        'Received Best Performer Award for consistent delivery and quality',
      ],
      impact:
        'Strengthened a production communications platform serving enterprise customers with more reliable module delivery.',
    },
    {
      company: 'Saasvaap Techies Pvt Ltd',
      role: 'Junior Software Engineer',
      period: 'Feb 2017 — May 2018',
      place: 'Kochi, Kerala',
      product: 'KBPS — Government ERP (Accounts & HR modules)',
      teamSize: 'ERP delivery team',
      stack: ['PHP', 'CodeIgniter', 'MySQL', 'Python', 'Flask'],
      summary:
        'Developed and maintained Accounts and HR modules for KBPS, supporting finance and HRMS workflows across government departments.',
      highlights: [
        'Built and enhanced the HR module for KBPS HRMS workflows',
        'Developed Accounts modules for day-to-day financial operations',
        'Improved reliability of employee and finance-related ERP processes',
      ],
      impact:
        'Delivered stable Accounts and HR capabilities inside KBPS used in live government operations.',
    },
  ];

  readonly skills: SkillGroup[] = [
    {
      group: 'Backend',
      tone: 'be',
      items: ['Python', 'Flask', 'Django', 'Laravel', 'NestJS', 'Node.js', 'PHP'],
    },
    {
      group: 'Frontend',
      tone: 'fe',
      items: ['Angular', 'TypeScript', 'JavaScript'],
    },
    {
      group: 'Database',
      tone: 'db',
      items: ['PostgreSQL', 'MySQL'],
    },
    {
      group: 'Cloud & DevOps',
      tone: 'ops',
      items: ['Docker', 'GitHub Actions', 'AWS'],
    },
    {
      group: 'AI',
      tone: 'ai',
      items: ['RAG', 'Gemini', 'Claude Code', 'Cursor AI', 'MCP', 'LangChain', 'LanceDB'],
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

  readonly projects: Project[] = [
    {
      name: 'AI Software Development Platform',
      year: '2025',
      problem:
        'Engineering teams needed a faster way to turn specs into working software with AI assistance.',
      solution:
        'Built an AI-assisted development platform that helps generate, review, and iterate on application workflows with agent-style tooling.',
      tags: ['NestJS', 'Angular', 'AI Agents', 'MCP', 'PostgreSQL'],
    },
    {
      name: 'RAG Application',
      year: '2025',
      problem:
        'Product knowledge was scattered across docs and systems, making accurate answers slow and inconsistent.',
      solution:
        'Implemented a retrieval-augmented generation pipeline with vector search so users get grounded answers from curated knowledge sources.',
      tags: ['RAG', 'LanceDB', 'LangChain', 'Python'],
    },
    {
      name: 'KBPS HR & Accounts Modules',
      year: '2018',
      problem:
        'KBPS needed reliable HRMS and finance workflows inside a shared government ERP.',
      solution:
        'Built and maintained HR and Accounts modules covering employee processes and day-to-day financial operations.',
      tags: ['PHP', 'CodeIgniter', 'MySQL', 'Flask', 'HRMS'],
    },
    {
      name: 'Invoice & Payment Management',
      year: '2021',
      problem:
        'Finance teams struggled with fragmented invoicing and payment tracking at growing transaction volume.',
      solution:
        'Built invoice and payment modules handling thousands of transactions with clearer status tracking and reconciliation.',
      tags: ['Laravel', 'MySQL', 'Angular', 'APIs'],
    },
    {
      name: 'Stripe Integration',
      year: '2022',
      problem:
        'The product needed secure online payments without custom payment infrastructure.',
      solution:
        'Integrated Stripe for checkout, webhooks, and payment status sync — reducing manual payment ops and failed settlement tracking.',
      tags: ['Stripe', 'Laravel', 'Webhooks', 'Node.js'],
    },
    {
      name: 'AI Research Platform',
      year: '2025',
      problem:
        'Teams evaluating models and prompts lacked a structured place to experiment and compare results.',
      solution:
        'Created a research-oriented AI workspace for model exploration, prompt iteration, and evaluation notes.',
      tags: ['Gemini', 'Claude Code', 'Cursor AI', 'TypeScript'],
    },
    {
      name: 'Spec Driven Development Tool',
      year: '2025',
      problem:
        'Ambiguous requirements slowed delivery and created rework between product and engineering.',
      solution:
        'Built a spec-driven workflow tool that turns structured requirements into actionable development steps and AI-assisted implementation guidance.',
      tags: ['MCP', 'NestJS', 'Angular', 'AI Automation'],
    },
  ];

  readonly achievements = [
    'Best Performer Award — DRD Communications',
    'Led legacy-to-scalable service migrations on enterprise SaaS',
    'Built HR and Accounts modules for KBPS government ERP',
  ];

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
