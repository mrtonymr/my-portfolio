import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Category, Difficulty, Question } from '../../models/interview.models';
import { StorageService } from './storage.service';

const GROQ_KEY = 'iph-groq-api-key';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

interface GroqChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

export interface GenerateQuestionsRequest {
  category: Category | 'All';
  difficulty: Difficulty | 'All';
  count: number;
  topic?: string;
}

@Injectable({ providedIn: 'root' })
export class GroqService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  readonly apiKey = signal(this.storage.get<string>(GROQ_KEY, ''));
  readonly hasApiKey = computed(() => !!this.apiKey().trim());

  setApiKey(key: string): void {
    const trimmed = key.trim();
    this.apiKey.set(trimmed);
    if (trimmed) {
      this.storage.set(GROQ_KEY, trimmed);
    } else {
      this.storage.remove(GROQ_KEY);
    }
  }

  clearApiKey(): void {
    this.setApiKey('');
  }

  async testConnection(): Promise<string> {
    const content = await this.chat(
      'Reply with exactly: ok',
      'You are a connection test. Reply with exactly the word ok.',
      0,
    );
    return content.trim().toLowerCase().includes('ok') ? 'Connected to Groq successfully.' : content;
  }

  async generateQuestions(request: GenerateQuestionsRequest): Promise<Question[]> {
    const count = Math.min(Math.max(request.count, 1), 10);
    const categoryHint =
      request.category === 'All'
        ? 'Pick a relevant web/engineering category from: JavaScript, TypeScript, Angular, React, HTML, CSS, NodeJS, SQL, System Design, HR'
        : `Category must be exactly "${request.category}"`;
    const difficultyHint =
      request.difficulty === 'All'
        ? 'Mix Easy, Medium, and Hard'
        : `Difficulty must be exactly "${request.difficulty}"`;
    const topic = request.topic?.trim()
      ? `Focus topic: ${request.topic.trim()}`
      : 'Cover current, practical interview topics used in 2024-2026 hiring.';

    const system = `You are an expert technical interviewer. Return ONLY valid JSON (no markdown) as an array of interview questions.
Each item must match:
{
  "title": string,
  "question": string,
  "answer": string (detailed, interview-ready),
  "examples": string[] (optional code/examples),
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": "JavaScript" | "TypeScript" | "Angular" | "React" | "HTML" | "CSS" | "NodeJS" | "SQL" | "System Design" | "HR",
  "company": string[],
  "tags": string[],
  "estimatedTime": number
}
Rules: ${categoryHint}. ${difficultyHint}. ${topic}
Make answers accurate and modern. Prefer real-world interview depth.`;

    const user = `Generate exactly ${count} fresh interview questions as a JSON array.`;
    const raw = await this.chat(user, system, 0.4);
    const parsed = this.parseJsonArray(raw);
    const now = Date.now();

    return parsed.map((item, index) => this.normalizeQuestion(item, now, index));
  }

  async enrichAnswer(question: Question): Promise<string> {
    const system =
      'You improve interview answers. Return ONLY the improved answer text (no JSON, no markdown fences). Keep it clear, structured, and interview-ready.';
    const user = `Category: ${question.category}
Difficulty: ${question.difficulty}
Title: ${question.title}
Question: ${question.question}
Current answer: ${question.answer}

Write a stronger complete answer with examples where useful.`;
    return (await this.chat(user, system, 0.3)).trim();
  }

  private async chat(user: string, system: string, temperature: number): Promise<string> {
    const key = this.apiKey().trim();
    if (!key) {
      throw new Error('Add your Groq API key in Settings first.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: GROQ_MODEL,
      temperature,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    };

    const response = await firstValueFrom(
      this.http.post<GroqChatResponse>(GROQ_URL, body, { headers }),
    );

    if (response.error?.message) {
      throw new Error(response.error.message);
    }

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from Groq');
    }
    return content;
  }

  private parseJsonArray(content: string): Record<string, unknown>[] {
    const cleaned = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    const jsonText =
      start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;

    const parsed: unknown = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) {
      throw new Error('Groq did not return a question array');
    }
    return parsed as Record<string, unknown>[];
  }

  private normalizeQuestion(
    item: Record<string, unknown>,
    stamp: number,
    index: number,
  ): Question {
    const allowedCategories = new Set([
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
    ]);
    const allowedDifficulty = new Set(['Easy', 'Medium', 'Hard']);

    const categoryRaw = String(item['category'] ?? 'JavaScript');
    const difficultyRaw = String(item['difficulty'] ?? 'Medium');
    const category = (
      allowedCategories.has(categoryRaw) ? categoryRaw : 'JavaScript'
    ) as Category;
    const difficulty = (
      allowedDifficulty.has(difficultyRaw) ? difficultyRaw : 'Medium'
    ) as Difficulty;

    const company = Array.isArray(item['company'])
      ? item['company'].map(String)
      : ['General'];
    const tags = Array.isArray(item['tags']) ? item['tags'].map(String) : [category];
    const examples = Array.isArray(item['examples'])
      ? item['examples'].map(String)
      : undefined;
    const estimatedTime = Number(item['estimatedTime']);

    return {
      id: `ai-${stamp}-${index}`,
      title: String(item['title'] ?? `Generated question ${index + 1}`),
      question: String(item['question'] ?? ''),
      answer: String(item['answer'] ?? ''),
      examples,
      difficulty,
      category,
      company: company.length ? company : ['General'],
      tags: tags.length ? [...tags, 'groq'] : [category, 'groq'],
      estimatedTime:
        Number.isFinite(estimatedTime) && estimatedTime > 0 ? estimatedTime : 10,
      relatedQuestions: [],
      source: 'groq',
    };
  }
}
