import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { TOOLS, ToolDefinition } from '../../models/tool.model';

@Injectable({ providedIn: 'root' })
export class RecentToolsService {
  private readonly storage = inject(StorageService);
  private readonly key = 'dt-recent-tools';
  private readonly maxItems = 6;

  getRecent(): ToolDefinition[] {
    const ids = this.storage.get<string[]>(this.key, []);
    return ids
      .map((id) => TOOLS.find((tool) => tool.id === id))
      .filter((tool): tool is ToolDefinition => !!tool);
  }

  track(toolId: string): void {
    const current = this.storage.get<string[]>(this.key, []).filter((id) => id !== toolId);
    current.unshift(toolId);
    this.storage.set(this.key, current.slice(0, this.maxItems));
  }
}
