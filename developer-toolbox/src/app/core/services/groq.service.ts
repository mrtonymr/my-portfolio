import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GroqChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class GroqService {
  private readonly http = inject(HttpClient);

  get hasApiKey(): boolean {
    return !!environment.groqApiKey?.trim();
  }

  async generateRegex(prompt: string): Promise<{ pattern: string; explanation: string }> {
    if (!this.hasApiKey) {
      throw new Error('Groq API key is missing. Add it to environment.ts.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.groqApiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: environment.groqModel,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You generate JavaScript-compatible regular expressions. Reply with JSON only: {"pattern":"...","explanation":"..."}. Do not include flags or markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await firstValueFrom(
      this.http.post<GroqChatResponse>(environment.groqApiUrl, body, { headers }),
    );

    if (response.error?.message) {
      throw new Error(response.error.message);
    }

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from Groq');
    }

    const jsonText = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    try {
      const parsed = JSON.parse(jsonText) as { pattern?: string; explanation?: string };
      if (!parsed.pattern) {
        throw new Error('Missing pattern in response');
      }
      return {
        pattern: parsed.pattern,
        explanation: parsed.explanation ?? 'Generated regular expression',
      };
    } catch {
      return {
        pattern: content.replace(/^\/|\/[gimsuy]*$/g, ''),
        explanation: 'Generated regular expression',
      };
    }
  }
}
