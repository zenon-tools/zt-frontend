import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';

export interface StakeInputs {
    amount: number;
    lockUpMonths: number;
    timePeriodInDays: number;
}

@Component({
    selector: 'app-stake-inputs',
    templateUrl: './stake-inputs.component.html',
    styleUrls: ['./stake-inputs.component.scss'],
})
export class StakeInputsComponent implements AfterViewInit {
    @Output() stakeInputs = new EventEmitter<StakeInputs>();

    @ViewChild('stakeAmountInput', { static: false })
    stakeAmountInput!: ElementRef;

    defaultStakeAmount: number = 100;

    avgStakeLockUp$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => Math.round(nom.avgStakingLockupTimeInDays / 30).toFixed())
    );

    lockUpDurationItems: Array<TabSelectorItem> = Array.from(Array(12)).map(
        (e, i) => ({ label: (i + 1).toString(), value: i + 1 })
    );

    private stakeAmount$!: Observable<any>;
    private lockUpDurationSubject$ = new BehaviorSubject<number>(1);
    private timePeriodSubject$ = new BehaviorSubject<number>(1);

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngAfterViewInit() {
        this.stakeAmount$ = fromEvent(
            this.stakeAmountInput.nativeElement,
            'keyup'
        ).pipe(
            distinctUntilChanged(),
            map((value) => Number(this.stakeAmountInput.nativeElement.value)),
            startWith(this.defaultStakeAmount)
        );

        combineLatest([
            this.stakeAmount$,
            this.lockUpDurationSubject$,
            this.timePeriodSubject$,
        ]).subscribe(([stakeAmount, lockUpMonths, timePeriod]) => {
            this.stakeInputs.emit({
                amount: stakeAmount,
                lockUpMonths: lockUpMonths,
                timePeriodInDays: timePeriod,
            });
        });
    }

    onLockUpDurationChanged(value: number) {
        this.lockUpDurationSubject$.next(value);
    }

    onTimePeriodChanged(value: number) {
        this.timePeriodSubject$.next(value);
    }
}
