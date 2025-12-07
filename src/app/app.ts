import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './page/user/user';
import { ContributionHeatmap } from './page/contribution-heatmap/contribution-heatmap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, User, ContributionHeatmap],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('uptimeai');
}
