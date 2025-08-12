import { Component, Input } from '@angular/core';

export interface StatData {
  label: string;
  value: number | string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  color?: string;
}

@Component({
  selector: 'app-stats-widget',
  standalone: false,
  templateUrl: './stats-widget.component.html',
  styleUrl: './stats-widget.component.css'
})
export class StatsWidgetComponent {
  @Input() title: string = 'Estadísticas';
  @Input() stats: StatData[] = [];
  @Input() loading: boolean = false;
  @Input() showTrends: boolean = true;

  getTrendIcon(trend?: string): string {
    switch (trend) {
      case 'up': return 'pi pi-arrow-up';
      case 'down': return 'pi pi-arrow-down';
      case 'stable': return 'pi pi-minus';
      default: return '';
    }
  }

  formatValue(value: number | string): string {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toLocaleString();
    }
    return value.toString();
  }

  trackByStat(index: number, stat: StatData): string {
    return stat.label + stat.value;
  }
}
