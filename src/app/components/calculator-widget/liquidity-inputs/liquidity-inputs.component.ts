import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild,
} from '@angular/core';
import {
    BehaviorSubject,
    combineLatest,
    fromEvent,
    Observable,
    of,
} from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';

export interface LiquidityInputs {
    amount: number;
    wBnbAmout: number;
    timePeriodInDays: number;
}

@Component({
    selector: 'app-liquidity-inputs',
    templateUrl: './liquidity-inputs.component.html',
    styleUrls: ['./liquidity-inputs.component.scss'],
})
export class LiquidityInputsComponent implements AfterViewInit {
    @Output() liquidityInputs = new EventEmitter<LiquidityInputs>();

    @ViewChild('liquidityAmountInput', { static: false })
    liquidityAmountInput!: ElementRef;

    defaultLiquidityAmount: number = 100;

    requiredWbnbAmount$!: Observable<number>;

    timePeriodItems: Array<TabSelectorItem> = Array.from([
        { label: 'Day', value: 1 },
        { label: 'Month', value: 30 },
        { label: 'Year', value: 360 },
    ]);

    private liquidityAmount$!: Observable<number>;
    private timePeriodSubject$ = new BehaviorSubject<number>(360);

    constructor(
        private cdr: ChangeDetectorRef,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngAfterViewInit() {
        this.liquidityAmount$ = fromEvent(
            this.liquidityAmountInput.nativeElement,
            'keyup'
        ).pipe(
            distinctUntilChanged(),
            map((value) =>
                Number(this.liquidityAmountInput.nativeElement.value)
            ),
            startWith(this.defaultLiquidityAmount)
        );

        this.requiredWbnbAmount$ = combineLatest([
            this.liquidityAmount$,
            this.zenonToolsApiService.pcsPoolData$,
        ]).pipe(
            map(
                ([liquidityAmount, pcsPoolData]) =>
                    liquidityAmount *
                    (pcsPoolData.wZnnPriceUsd / pcsPoolData.wBnbPriceUsd)
            ),
            startWith(1)
        );

        combineLatest([
            this.liquidityAmount$,
            this.requiredWbnbAmount$,
            this.timePeriodSubject$,
        ]).subscribe(([liquidityAmount, wBnbAmount, timePeriod]) => {
            this.liquidityInputs.emit({
                amount: liquidityAmount,
                wBnbAmout: wBnbAmount,
                timePeriodInDays: timePeriod,
            });
        });

        this.cdr.detectChanges();
    }

    onTimePeriodChanged(value: number) {
        this.timePeriodSubject$.next(value);
    }
}
