import {
    Component,
    ElementRef,
    Input,
    AfterViewInit,
    ViewChild,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-apr-card',
    templateUrl: './apr-card.component.html',
    styleUrls: ['./apr-card.component.scss'],
})
export class AprCardComponent implements AfterViewInit, OnChanges {
    @ViewChild('gaugeBg') gaugeViewBg?: ElementRef<HTMLCanvasElement>;
    @ViewChild('gauge') gaugeView?: ElementRef<HTMLCanvasElement>;

    @Input() title!: string;
    @Input() subTitleText?: string;
    @Input() subTitleValue?: number | null;
    @Input() apr!: number | null;
    @Input() footerText!: string;
    @Input() footerValue!: number | null;
    @Input() footerPrefix?: string;
    @Input() iconPath!: string;
    @Input() selectorLabels!: string[];

    @Output() selectData = new EventEmitter<number>();
    @Output() tapCard = new EventEmitter<void>();

    gauge!: Chart;

    selectorIndex: number = 0;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['apr'] &&
            changes['apr'].currentValue != null &&
            this.gauge?.data
        ) {
            const value =
                changes['apr'].currentValue > 100
                    ? 100
                    : changes['apr'].currentValue;
            this.gauge.data.datasets[0].data = [value, 100 - value];
            this.gauge.update();
        }
    }

    ngAfterViewInit(): void {
        // Draws the grey background path for the gauge
        const gaugeBgElement = this.gaugeViewBg!.nativeElement;
        const contextBg = gaugeBgElement.getContext('2d');
        gaugeBgElement.width = gaugeBgElement.scrollWidth;
        gaugeBgElement.height = gaugeBgElement.scrollHeight;
        this.drawGauge(contextBg!, '#585858', 100, 0);

        const gaugeElement = this.gaugeView!.nativeElement;
        const context = gaugeElement.getContext('2d');
        gaugeElement.width = gaugeElement.scrollWidth;
        gaugeElement.height = gaugeElement.scrollHeight;
        const apr = this.apr! > 100 ? 100 : this.apr!;
        this.gauge = this.drawGauge(context!, '#6CEF4B', apr, 10);
    }

    drawGauge(
        context: CanvasRenderingContext2D,
        color: string,
        value: number,
        borderRadius: number
    ): Chart {
        return new Chart(context!, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [value, 100 - value],
                        backgroundColor: [color, 'transparent'],
                        borderWidth: 0,
                        borderRadius: borderRadius,
                        rotation: 180,
                    },
                ],
            },
            options: {
                responsive: true,
                cutout: 71,
                events: [],
                animation: false,
                plugins: {
                    tooltip: {
                        enabled: false,
                    },
                    legend: {
                        display: false,
                    },
                },
            },
        });
    }

    onSelectorTapped(event: Event, index: number) {
        event.stopPropagation();
        this.selectorIndex = index;
        this.selectData.emit(index);
    }

    onCardTapped() {
        this.tapCard.emit();
    }
}
