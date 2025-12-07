import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { CommonModule } from '@angular/common';
import { ApiServices } from '../../services/api-services';
import { NgxEchartsModule } from 'ngx-echarts';
import { ContributionHeatmap } from "../contribution-heatmap/contribution-heatmap";
import { max } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [Header, Footer, CommonModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  filteredRewards: any = [{ a: 'a', b: 987678 }]

  user: any = {};
  loading = true;
  options: any;
  constructor(private api: ApiServices) { }

  ngOnInit(): void {
    this.api.getUser('shreeramk').subscribe((res: any) => {
      this.user = res;
      this.loading = false;
    });
    this.api.getRepositories('shreeramk').subscribe(data => {
      this.Repositories = data;
      this.loading = false;
    });

    this.api.getContributions('shreeramk').subscribe((data: any) => {
      this.allContributions = data.contributions.map((d: any) => ({
        date: d.date,
        count: d.count,
        level: this.getLevel(d.count)
      }));
      const yearSet = new Set(this.allContributions.map(d => new Date(d.date).getFullYear()));
      this.years = Array.from(yearSet).sort((a, b) => b - a);
      this.selectYear(this.years[0]);
    });
  }

  allContributions: any[] = [];
  contributions: any[] = [];
  years: number[] = [];
  selectedYear!: number;



  Repositories: any;


  weeks: any[][] = []; // 2D array [week][day]
  monthLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  Monthre(day: any, k: any, w: any) {
    if ((day.split('-')[2] == 1) && k == 0)
      return w + day.split('-')[2];
    return ' '
  }

  ////////////////
  getLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    return 3;
  }

  getColor(level: number): string {
    switch (level) {
      case 0: return '#ebedf0';
      case 1: return '#9be9a8';
      case 2: return '#40c463';
      case 3: return '#30a14e';
      default: return '#ebedf0';
    }
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.contributions = this.allContributions.filter(d => new Date(d.date).getFullYear() === year);
    this.prepareCalendar();
  }

  getMonthLabel(week: any): string {
    if (!week || !week[0] || !week[0].date) return '';
    const monthIndex = new Date(week[0].date).getMonth();
    return this.monthLabels[monthIndex];
  }

  prepareCalendar() {
    if (!this.contributions?.length) return;

    const firstDate = new Date(this.contributions[0].date);
    const lastDate = new Date(this.contributions[this.contributions.length - 1].date);

    let current = new Date(firstDate);
    let week: any[] = [];
    this.weeks = [];

    while (current <= lastDate) {
      const day = this.contributions.find(d => d.date === current.toISOString().split('T')[0]);
      week.push(day || { date: current.toISOString().split('T')[0], count: 0, level: 0 });

      if (current.getDay() === 6) { // Saturday ends the week
        this.weeks.push(week);
        week = [];
      }

      current.setDate(current.getDate() + 1);
    }

    if (week.length) this.weeks.push(week);
  }
  activities: any = [
    {
      type: 'commit',
      count: 56,
      repoName: '11 repositories',
      repoLink: '#',
      language: 'TypeScript',
      languageColor: '#3178c6',
      date: new Date(2025, 9, 1)
    },

    {
      type: 'pr',
      count: 29,
      repoCount: 5,
      prs: [
        { name: 'UptimeAI/uptime_webapp', merged: 18, open: 1 },
        { name: 'UptimeAI/uptime_ml', merged: 1 },
        { name: 'UptimeAI/uptime_scripts', merged: 1 },
        { name: 'UptimeAI/uptime_engine', merged: 1 },
        { name: 'UptimeAI/uptime_ml_encrypted', merged: 1 }
      ],
      language: 'Python',
      languageColor: '#3572A5',
      date: new Date(2025, 9, 1)
    }
  ];

}
