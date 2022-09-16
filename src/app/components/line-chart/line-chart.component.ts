import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartDataset } from 'chart.js/auto';
import { distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit, OnChanges {
    @ViewChild('chart') chartView?: ElementRef<HTMLCanvasElement>;

    @Input() chartSeries?: number[] | null;
    @Input() gradientStartColor!: string;
    @Input() gradientEndColor!: string;
    @Input() lineWidth: number = 4;
    @Input() pointHoverRadius: number = 5;
    @Input() roundCorners: boolean = true;
    @Input() maxValue: number | undefined = 110;

    private isHovered = new Subject<boolean>();
    @Output() public isHovered$ = this.isHovered.pipe(distinctUntilChanged());

    private hoveredValueSubject = new Subject<number[]>();
    @Output() public hoveredValue$ = this.hoveredValueSubject.pipe(
        distinctUntilChanged(
            (previous, current) =>
                JSON.stringify(previous) === JSON.stringify(current)
        )
    );

    private chart!: Chart<'line', number[], number>;

    constructor() {}

    ngAfterViewInit(): void {
        const chartElement = this.chartView!.nativeElement;
        chartElement!.height = chartElement!.scrollHeight;
        const context = chartElement.getContext('2d');

        this.chart = new Chart<'line', number[], number>(context!, {
            type: 'line',
            data: {
                labels: this.chartSeries!,
                datasets: [
                    this.createDataset(
                        context!,
                        chartElement.scrollWidth,
                        this.chartSeries!
                    ),
                ],
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        beginAtZero: true,
                        display: false,
                        grace: '1%',
                        max: this.maxValue,
                        min: 0,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    },
                },
                interaction: { intersect: false },
                animation: false,

                onHover: (e, items, chart) => {
                    if (items && items.length > 0) {
                        const dataset =
                            chart.data.datasets[items[0]!.datasetIndex];
                        const value = <number>dataset.data[items[0].index];
                        this.isHovered.next(true);
                        this.hoveredValueSubject.next([
                            (this.chartSeries?.length ?? 0) -
                                1 -
                                items[0].index,
                            value,
                        ]);
                    }
                },
            },
            plugins: [
                {
                    id: 'mouseOutCatcher',
                    beforeEvent: (_chart, args, _pluginOptions) => {
                        const event = args.event;
                        if (event.type === 'mouseout') {
                            this.isHovered.next(false);
                        }
                    },
                },
            ],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.chart != undefined) {
            if (this.chart.data.labels) {
                this.chart.data.labels = changes['chartSeries'].currentValue;
            }
            this.chart.data.datasets[0].data =
                changes['chartSeries'].currentValue;
            this.chart.update();
        }
    }

    private createDataset(
        context: CanvasRenderingContext2D,
        width: number,
        chartSeries: number[]
    ): ChartDataset<'line', number[]> {
        const lineGradient = context!.createLinearGradient(0, 0, width, 0);
        lineGradient.addColorStop(0, this.gradientStartColor);
        lineGradient.addColorStop(1, this.gradientEndColor);
        const fillGradient = context!.createLinearGradient(0, 0, width, 0);
        fillGradient.addColorStop(0, this.gradientStartColor + '08');
        fillGradient.addColorStop(1, this.gradientEndColor + '08');
        return {
            backgroundColor: fillGradient,
            fill: true,
            data: chartSeries,
            borderColor: lineGradient,
            pointBorderWidth: 0,
            pointHoverBorderWidth: 0,
            pointBackgroundColor: 'transparent',
            pointHoverBackgroundColor: this.gradientEndColor,
            pointRadius: 0,
            pointHoverRadius: this.pointHoverRadius,
            tension: 0.3,
            borderWidth: this.lineWidth,
        };
    }
}
