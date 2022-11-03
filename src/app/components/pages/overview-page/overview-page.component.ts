import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, switchMap } from 'rxjs';
import { CurrentPrice } from 'src/app/services/market-api/coin-gecko-types';
import { MarketApiService } from 'src/app/services/market-api/market-api.service';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';

@Component({
    selector: 'app-overview-page',
    templateUrl: './overview-page.component.html',
    styleUrls: ['./overview-page.component.scss'],
})
export class OverviewPageComponent implements OnInit {
    private pillarAprDataIndexSubject = new BehaviorSubject<number>(0);

    currencyToUse: keyof CurrentPrice = 'usd';
    znnPriceHistory$ = this.marketApiService.znnPriceHistory7d$;
    qsrPriceHistory$ = this.marketApiService.znnPriceHistory7d$.pipe(
        map((history) => {
            return history.map((item: number): number => {
                return item / 10;
            });
        })
    );
    znnTradingVolume$ = this.marketApiService.znnTradingVolume7d$.pipe(
        map((history) => {
            return history[history.length - 1];
        })
    );
    qsrTradingVolume$ = this.marketApiService.znnTradingVolume7d$.pipe(
        map((history) => {
            return history[history.length - 1] / 10;
        })
    );
    znnTradingVolumeHistory$ = this.marketApiService.znnTradingVolume7d$;
    qsrTradingVolumeHistory$ = this.marketApiService.znnTradingVolume7d$.pipe(
        map((history) => {
            return history.map((item: number): number => {
                return item / 10;
            });
        })
    );
    znnPriceDelta$ = this.znnPriceHistory$.pipe(
        map((history) => {
            return (
                ((history[history.length - 1] - history[0]) / history[0]) * 100
            );
        })
    );
    qsrPriceDelta$ = this.znnPriceHistory$.pipe(
        map((history) => {
            return (
                ((history[history.length - 1] - history[0]) / history[0]) * 100
            );
        })
    );
    znnVolumeDelta$ = this.znnTradingVolumeHistory$.pipe(
        map((history) => {
            return (
                ((history[history.length - 1] - history[0]) / history[0]) * 100
            );
        })
    );
    qsrVolumeDelta$ = this.qsrTradingVolumeHistory$.pipe(
        map((history) => {
            return (
                ((history[history.length - 1] - history[0]) / history[0]) * 100
            );
        })
    );

    /* currentZnnPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse])
    );

    currentQsrPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse] / 10)
    ); */

    currentZnnPrice$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.znnPriceUsd)
    );

    currentQsrPrice$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.qsrPriceUsd)
    );

    stakingApr$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.stakingApr)
    );

    totalStakedZnn$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.totalStakedZnn.amount)
    );

    delegateApr$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.delegateApr)
    );

    totalDelegatedZnn$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.totalDelegatedZnn)
    );

    impermanentLoss$ = this.zenonToolsApiService.pcsPoolData$.pipe(
        map((pcsPool) => pcsPool.impermanentLossPast7d)
    );

    liquidityApr$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.lpApr)
    );

    totalLiquidityUsd$ = this.zenonToolsApiService.pcsPoolData$.pipe(
        map((pcsPool) => pcsPool.liquidityUsd)
    );

    sentinelApr$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.sentinelApr)
    );

    sentinelCount$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.sentinelCount)
    );

    pillarAprTop30$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.pillarAprTop30)
    );

    pillarAprNotTop30$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.pillarAprNotTop30)
    );

    pillarCount$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.pillarCount)
    );

    public pillarApr$ = this.pillarAprDataIndexSubject.pipe(
        distinctUntilChanged(),
        switchMap((index) =>
            index == 0 ? this.pillarAprTop30$ : this.pillarAprNotTop30$
        )
    );

    constructor(
        private zenonToolsApiService: ZenonToolsApiService,
        private marketApiService: MarketApiService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    onSelectPillarAprData(index: number) {
        this.pillarAprDataIndexSubject.next(index);
    }

    onSelectStake() {
        this.router.navigate(['/calculator', 'stake']);
    }

    onSelectDelegation() {
        this.router.navigate(['/calculator', 'delegation']);
    }

    onSelectLiquidity() {
        this.router.navigate(['/calculator', 'liquidity']);
    }

    onSelectSentinel() {
        this.router.navigate(['/calculator', 'sentinel']);
    }

    onSelectPillar() {
        this.router.navigate(['/calculator', 'pillar']);
    }
}
