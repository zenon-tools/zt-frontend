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
import {
    distinctUntilChanged,
    map,
    startWith,
    tap,
    switchMap,
    withLatestFrom,
} from 'rxjs/operators';
import { LiquidityPoolData } from 'src/app/services/zenon-tools-api/interfaces/liquidity-pool-data';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';

export interface LiquidityInputs {
    amount: number;
    pairedTokenAmount: number;
    lpTokenAmount: number;
    lockUpMonths: number;
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

    liquidityAmountToShow: number = 100;

    useBaseTokenAmount$ = new BehaviorSubject<boolean>(true);
    requiredPairedTokenAmount$!: Observable<number>;

    lockUpDurationItems: Array<TabSelectorItem> = Array.from(Array(12)).map(
        (_, i) => ({ label: (i + 1).toString(), value: i + 1 })
    );

    private baseTokenAmount$!: Observable<number>;
    private lpTokenAmount$!: Observable<number>;
    private liquidityAmount$!: Observable<number>;
    private lockUpDurationSubject$ = new BehaviorSubject<number>(1);
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
            map((_) => Number(this.liquidityAmountInput.nativeElement.value)),
            startWith(this.liquidityAmountToShow)
        );

        this.baseTokenAmount$ = combineLatest([
            this.liquidityAmount$,
            this.zenonToolsApiService.znnEthPoolData$,
        ]).pipe(
            withLatestFrom(this.useBaseTokenAmount$),
            map(([combination, useBaseToken]) => {
                const liquidityAmount = combination[0];
                const znnEthPoolData = combination[1];
                if (useBaseToken) {
                    return liquidityAmount;
                } else {
                    return this.convertLpTokenToBaseToken(
                        liquidityAmount,
                        znnEthPoolData
                    );
                }
            })
        );

        this.requiredPairedTokenAmount$ = combineLatest([
            this.liquidityAmount$,
            this.zenonToolsApiService.znnEthPoolData$,
        ]).pipe(
            withLatestFrom(this.useBaseTokenAmount$),
            map(([combination, useBaseToken]) => {
                const liquidityAmount = combination[0];
                const znnEthPoolData = combination[1];
                if (useBaseToken) {
                    return (
                        liquidityAmount *
                        (znnEthPoolData.baseTokenPriceUsd /
                            znnEthPoolData.pairedTokenPriceUsd)
                    );
                } else {
                    return this.convertLpTokenToPairedToken(
                        liquidityAmount,
                        znnEthPoolData
                    );
                }
            })
        );

        this.lpTokenAmount$ = combineLatest([
            this.liquidityAmount$,
            this.zenonToolsApiService.znnEthPoolData$,
        ]).pipe(
            withLatestFrom(this.useBaseTokenAmount$),
            map(([combination, useBaseToken]) => {
                const liquidityAmount = combination[0];
                const znnEthPoolData = combination[1];
                if (useBaseToken) {
                    return this.convertBaseTokenToLpToken(
                        liquidityAmount,
                        znnEthPoolData
                    );
                } else {
                    return liquidityAmount;
                }
            })
        );

        this.useBaseTokenAmount$
            .pipe(withLatestFrom(this.baseTokenAmount$, this.lpTokenAmount$))
            .subscribe(([result, baseTokenAmount, lpTokenAmount]) => {
                this.liquidityAmountToShow = result
                    ? baseTokenAmount
                    : lpTokenAmount;
            });

        combineLatest([
            this.baseTokenAmount$,
            this.requiredPairedTokenAmount$,
            this.lpTokenAmount$,
            this.timePeriodSubject$,
            this.lockUpDurationSubject$,
        ]).subscribe(
            ([
                baseTokenAmount,
                pairedTokenAmount,
                lpTokenAmount,
                timePeriod,
                lockUpDuration,
            ]) => {
                this.liquidityInputs.emit({
                    amount: baseTokenAmount,
                    pairedTokenAmount: pairedTokenAmount,
                    lpTokenAmount: lpTokenAmount,
                    lockUpMonths: lockUpDuration,
                    timePeriodInDays: timePeriod,
                });
            }
        );

        this.cdr.detectChanges();
    }

    onLockUpDurationChanged(value: number) {
        this.lockUpDurationSubject$.next(value);
    }

    onTimePeriodChanged(value: number) {
        this.timePeriodSubject$.next(value);
    }

    onTokenToggled() {
        this.useBaseTokenAmount$.next(!this.useBaseTokenAmount$.value);
    }

    private convertBaseTokenToLpToken(
        baseTokenAmount: number,
        poolData: LiquidityPoolData
    ): number {
        const lpTokenPrice =
            poolData.liquidityUsd / poolData.lpTokenTotalSupply;
        const tokensValue = baseTokenAmount * poolData.baseTokenPriceUsd * 2;
        return tokensValue / lpTokenPrice;
    }

    private convertLpTokenToBaseToken(
        lpTokenAmount: number,
        poolData: LiquidityPoolData
    ): number {
        const lpTokenPrice =
            poolData.liquidityUsd / poolData.lpTokenTotalSupply;
        const lpTokenValue = lpTokenAmount * lpTokenPrice;
        return lpTokenValue / poolData.baseTokenPriceUsd / 2;
    }

    private convertLpTokenToPairedToken(
        lpTokenAmount: number,
        poolData: LiquidityPoolData
    ): number {
        const lpTokenPrice =
            poolData.liquidityUsd / poolData.lpTokenTotalSupply;
        const lpTokenValue = lpTokenAmount * lpTokenPrice;
        return lpTokenValue / poolData.pairedTokenPriceUsd / 2;
    }
}
