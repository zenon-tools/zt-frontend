import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    interval,
    map,
    pluck,
    shareReplay,
    startWith,
    switchMap,
    tap,
} from 'rxjs';
import { whenPageVisible } from 'src/app/utils/common';
import { environment } from 'src/environments/environment';
import { CoinGeckoResponse, MarketChart, MarketData } from './coin-gecko-types';

@Injectable({
    providedIn: 'root',
})
export class MarketApiService {
    private baseUrl = environment.coinGeckoUrl;
    private currentPriceIntervalMs = 1000 * 60 * 5;
    private historyIntervalMs = 1000 * 60 * 10;

    private coinHistory$ = this.getCoinHistory('zenon', 'usd');

    public currentZnnPrice$ = this.getCurrentCoinPrice('zenon');
    public znnPriceHistory7d$ = this.getCoinPriceHistory('zenon', 'usd');
    public znnTradingVolume7d$ = this.getCoinTradingVolume('zenon', 'usd');

    constructor(private httpClient: HttpClient) {}

    private getCurrentCoinPrice(coin: string) {
        return interval(this.currentPriceIntervalMs).pipe(
            startWith(0),
            whenPageVisible(),
            switchMap(() =>
                this.httpClient
                    .get<CoinGeckoResponse>(`${this.baseUrl}/coins/${coin}`)
                    .pipe(pluck('market_data', 'current_price'))
            ),
            shareReplay(1)
        );
    }

    private getCoinPriceHistory(coin: string, currency: string) {
        return interval(this.historyIntervalMs).pipe(
            startWith(0),
            whenPageVisible(),
            switchMap(() =>
                this.coinHistory$.pipe(
                    map((response) => response.prices.map((i) => i[1]))
                )
            )
        );
    }

    private getCoinTradingVolume(coin: string, currency: string) {
        return this.coinHistory$.pipe(
            whenPageVisible(),
            map((response) => response.total_volumes.map((i) => i[1]))
        );
    }

    private getCoinHistory(coin: string, currency: string) {
        const historyDataUrl = new URL(
            `${this.baseUrl}/coins/${coin}/market_chart`
        );
        [
            ['vs_currency', currency],
            ['days', '7'],
            ['interval', 'daily'],
        ].forEach(([key, value]) =>
            historyDataUrl.searchParams.set(key, value)
        );
        return this.httpClient
            .get<MarketChart>(historyDataUrl.toString())
            .pipe(shareReplay(1));
    }
}
