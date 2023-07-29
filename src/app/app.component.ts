import { Component, OnInit } from '@angular/core';
import { combineLatest, take } from 'rxjs';
import { MarketApiService } from './services/market-api/market-api.service';
import { ZenonToolsApiService } from './services/zenon-tools-api/zenon-tools-api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    isInitializing: boolean = true;

    constructor(
        private zenonToolsApiService: ZenonToolsApiService,
        private marketApiService: MarketApiService
    ) {}

    ngOnInit(): void {
        combineLatest([
            this.zenonToolsApiService.nomData$,
            this.zenonToolsApiService.znnEthPoolData$,
            this.zenonToolsApiService.pillars$,
            this.zenonToolsApiService.pillarsOffChainInfo$,
        ])
            .pipe(take(1))
            .subscribe(() => {
                this.isInitializing = false;
            });

        this.zenonToolsApiService.intervalSecondsUntilRefresh$.subscribe();
    }
}
