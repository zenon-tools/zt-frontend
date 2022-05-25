import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild,
} from '@angular/core';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    fromEvent,
    last,
    map,
    Observable,
    startWith,
} from 'rxjs';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';

export interface PillarInputs {
    amount: number;
    slotCost: number;
    isTop30: boolean;
    timePeriodInDays: number;
}

@Component({
    selector: 'app-pillar-inputs',
    templateUrl: './pillar-inputs.component.html',
    styleUrls: ['./pillar-inputs.component.scss'],
})
export class PillarInputsComponent implements AfterViewInit {
    @Output() pillarInputs = new EventEmitter<PillarInputs>();

    @ViewChild('slotCostInput', { static: false })
    slotCostInput!: ElementRef;

    public defaultSlotCost: number = 150000;

    public pillarAmountItems: Array<TabSelectorItem> = Array.from(Array(10)).map(
        (e, i) => ({ label: (i + 1).toString(), value: i + 1 })
    );

    public isTop30Items: Array<TabSelectorItem> = Array.from([
        { label: 'No', value: false },
        { label: 'Yes', value: true },
    ]);

    public pillarAmountSubject$ = new BehaviorSubject<number>(1);

    private isTop30Subject$ = new BehaviorSubject<boolean>(true);
    private timePeriodSubject$ = new BehaviorSubject<number>(1);

    private slotCost$!: Observable<any>;

    constructor() {}

    ngAfterViewInit() {
        this.slotCost$ = fromEvent(
            this.slotCostInput.nativeElement,
            'keyup'
        ).pipe(
            distinctUntilChanged(),
            map((value) => Number(this.slotCostInput.nativeElement.value)),
            startWith(this.defaultSlotCost)
        );

        combineLatest([
            this.pillarAmountSubject$,
            this.slotCost$,
            this.isTop30Subject$,
            this.timePeriodSubject$,
        ]).subscribe(([pillarAmount, slotCost, isTop30, timePeriod]) => {
            this.pillarInputs.emit({
                amount: pillarAmount,
                slotCost: slotCost,
                isTop30: isTop30,
                timePeriodInDays: timePeriod,
            });
        });
    }

    onPillarAmountChanged(value: number) {
        this.pillarAmountSubject$.next(value);
    }

    onIsTop30Changed(value: boolean) {
        this.isTop30Subject$.next(value);
    }

    onTimePeriodChanged(value: number) {
        this.timePeriodSubject$.next(value);
    }
}
