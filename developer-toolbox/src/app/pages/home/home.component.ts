import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TOOLS } from '../../models/tool.model';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { RecentToolsService } from '../../core/services/recent-tools.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule, ToolCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly recentToolsService = inject(RecentToolsService);

  readonly tools = TOOLS;
  readonly recent = signal(this.recentToolsService.getRecent());

  ngOnInit(): void {
    this.recent.set(this.recentToolsService.getRecent());
  }

  @HostListener('window:focus')
  refreshRecent(): void {
    this.recent.set(this.recentToolsService.getRecent());
  }
}
