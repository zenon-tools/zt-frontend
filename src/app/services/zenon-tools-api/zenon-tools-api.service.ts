import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, map, shareReplay, startWith, switchMap } from 'rxjs';
import { whenPageVisible } from 'src/app/utils/common';
import { environment } from 'src/environments/environment';
import { NomData } from './interfaces/nom-data';
import { PcsPoolData } from './interfaces/pcs-pool-data';
import { Pillars } from './interfaces/pillar';
import { PillarsOffChainInfo } from './interfaces/pillar-off-chain-info';

@Injectable({
    providedIn: 'root',
})
export class ZenonToolsApiService {
    private baseUrl = environment.ztApiUrl;

    private baseDataRefreshRate = 15;
    private intervalMs = this.baseDataRefreshRate * 1000;
    private pillarsOffChainInfoIntervalMs = 1000 * 60 * 5;
    private pcsPoolDataIntervalMs = 1000 * 60 * 5;

    public intervalSecondsUntilRefresh$ = interval(1000).pipe(
        whenPageVisible(),
        map(
            (index) =>
                this.baseDataRefreshRate -
                ((index % this.baseDataRefreshRate) + 1)
        ),
        shareReplay(1)
    );

    public dataRefreshInterval$ = interval(this.intervalMs);

    public nomData$ = this.dataRefreshInterval$.pipe(
        startWith(0),
        whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<NomData>(`${this.baseUrl}/nom-data`)
        ),
        shareReplay(1)
    );

    public pillars$ = this.dataRefreshInterval$.pipe(
        startWith(0),
        whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<Pillars>(`${this.baseUrl}/pillars`)
        ),
        map((i) => new Map(Object.entries(i))),
        shareReplay(1)
    );

    public pillarsOffChainInfo$ = interval(
        this.pillarsOffChainInfoIntervalMs
    ).pipe(
        startWith(0),
        whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<PillarsOffChainInfo>(
                `${this.baseUrl}/pillars-off-chain`
            )
        ),
        map((i) => new Map(Object.entries(i))),
        shareReplay(1)
    );

    public pcsPoolData$ = interval(this.pcsPoolDataIntervalMs).pipe(
        startWith(0),
        whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<PcsPoolData>(`${this.baseUrl}/pcs-pool`)
        ),
        shareReplay(1)
    );

    constructor(private httpClient: HttpClient) {}
}