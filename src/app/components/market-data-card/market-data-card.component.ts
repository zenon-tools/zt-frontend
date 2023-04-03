import {
    ChangeDetectorRef,
    Component,
    Input,
    SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-market-data-card',
    templateUrl: './market-data-card.component.html',
    styleUrls: ['./market-data-card.component.scss'],
})
export class MarketDataCardComponent {
    @Input() public currentValue!: number | null;
    @Input() public valuePrefix = '$';
    @Input() public label: string = '';
    @Input() public chartSeries: number[] = [];
    @Input() public gradientStartColor: string = '#2F6922';
    @Input() public gradientEndColor: string = '#81FF62';
    @Input() public valueNumberPipe: string = '1.2-2';
    @Input() public delta!: number;
    @Input() public dates: string[] = [];

    faCircleInfo = faCircleInfo;

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
            new Date().setDate(new Date().getDate() - value[0])
        );
        this.hoveredHistoricValueSubject.next(value[1]);
    }

    handleIsChartHovered(isHovered: boolean) {
        this.isChartHoveredSubject.next(isHovered);
    }
}
