import {
    ChangeDetectorRef,
    Component,
    Input,
    SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';

@Component({
    selector: 'app-reward-share-graph-card',
    templateUrl: './reward-share-graph-card.component.html',
    styleUrls: ['./reward-share-graph-card.component.scss'],
})
export class RewardShareGraphCardComponent {
    @Input() public currentValue!: number | null;
    @Input() public label: string = '';
    @Input() public chartSeries: number[] = [];
    @Input() public gradientStartColor: string = '#2F6922';
    @Input() public gradientEndColor: string = '#81FF62';
    @Input() public dates: number[] = [];

    public hoveredHistoricValueSubject = new Subject<number>();
    public isChartHoveredSubject = new BehaviorSubject<boolean>(false);
    public currentValueSubject = new BehaviorSubject<number>(0);

    public date!: Date;

    public valueToDisplay$ = this.isChartHoveredSubject.pipe(
        switchMap((isHovered) =>
            isHovered
                ? this.hoveredHistoricValueSubject
                : this.currentValueSubject
        )
    );

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['currentValue'] &&
            changes['currentValue'].currentValue != null
        ) {
            this.currentValueSubject.next(changes['currentValue'].currentValue);
            this.cdr.detectChanges();
        }
    }

    handleValueChanged(value: number[]) {
        this.date = new Date(
            this.dates[this.dates.length - 1 - value[0]] * 1000
        );
        this.hoveredHistoricValueSubject.next(value[1]);
    }

    handleIsChartHovered(isHovered: boolean) {
        this.isChartHoveredSubject.next(isHovered);
    }
}
