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
    map,
    Observable,
    startWith,
} from 'rxjs';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';

export interface SentinelInputs {
    amount: number;
    timePeriodInDays: number;
}

@Component({
    selector: 'app-sentinel-inputs',
    templateUrl: './sentinel-inputs.component.html',
    styleUrls: ['./sentinel-inputs.component.scss'],
})
export class SentinelInputsComponent implements AfterViewInit {
    @Output() sentinelInputs = new EventEmitter<SentinelInputs>();

    sentinelAmountItems: Array<TabSelectorItem> = Array.from(Array(10)).map(
        (e, i) => ({ label: (i + 1).toString(), value: i + 1 })
    );

    private sentinelAmountSubject$ = new BehaviorSubject<number>(1);
    private timePeriodSubject$ = new BehaviorSubject<number>(1);

    constructor() {}

    ngAfterViewInit() {
        combineLatest([
            this.sentinelAmountSubject$,
            this.timePeriodSubject$,
        ]).subscribe(([sentinelAmount, timePeriod]) => {
            this.sentinelInputs.emit({
                amount: sentinelAmount,
                timePeriodInDays: timePeriod,
            });
        });
    }

    onSentinelAmountChanged(value: number) {
        this.sentinelAmountSubject$.next(value);
    }

    onTimePeriodChanged(value: number) {
        this.timePeriodSubject$.next(value);
    }
}
