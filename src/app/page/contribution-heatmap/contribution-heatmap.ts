import { Component } from '@angular/core';
import { ApiServices } from '../../services/api-services';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contribution-heatmap',
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './contribution-heatmap.html',
  styleUrl: './contribution-heatmap.css',
})
export class ContributionHeatmap {
  options: any = {};
  username = 'shreeramk';

  constructor(private contrib: ApiServices) { }

  ngOnInit() {
    this.contrib.getContributions(this.username).subscribe(data => {
      const seriesData = data.map((d: any) => [d.date, d.count]);
      const max = Math.max(...data.map((d: any) => d.count), 1);

      this.options = {
        tooltip: {},
        visualMap: { min: 0, max, show: false },
        calendar: { range: new Date().getFullYear(), cellSize: ['auto', 12] },
        series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: seriesData }]
      };
    });
  }
}
