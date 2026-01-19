import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

/**
 * Composant réutilisable pour afficher des graphiques
 */
@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
    styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ChartComponent implements AfterViewInit {
    @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
    @Input() config!: ChartConfiguration;

    private chart: Chart | null = null;

    ngAfterViewInit(): void {
        if (this.chartCanvas && this.config) {
            this.createChart();
        }
    }

    private createChart(): void {
        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (ctx) {
            this.chart = new Chart(ctx, this.config);
        }
    }

    updateChart(config: ChartConfiguration): void {
        if (this.chart) {
            this.chart.destroy();
        }
        this.config = config;
        this.createChart();
    }

    ngOnDestroy(): void {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}
