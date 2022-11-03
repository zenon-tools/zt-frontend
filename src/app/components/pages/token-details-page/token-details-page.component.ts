import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { combineLatest, map, take } from 'rxjs';
import { TokenDetails } from 'src/app/services/zenon-tools-api/interfaces/token/token-details';
import { faCopy, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { MarketApiService } from 'src/app/services/market-api/market-api.service';
import { CurrentPrice } from 'src/app/services/market-api/coin-gecko-types';

@Component({
    selector: 'app-token-details-page',
    templateUrl: './token-details-page.component.html',
    styleUrls: ['./token-details-page.component.scss'],
})
export class TokenDetailsPageComponent implements OnInit {
    faCopy = faCopy;
    faCircleInfo = faCircleInfo;

    tokenStandard: string = '';
    usdValue: number = 0;
    isLoading: boolean = true;
    tokenDetails?: TokenDetails;
    coinDecimals: number = 100000000;

    currencyToUse: keyof CurrentPrice = 'usd';

    currentZnnPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse])
    );

    currentQsrPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse] / 10)
    );

    constructor(
        private route: ActivatedRoute,
        private zenonToolsApiService: ZenonToolsApiService,
        private marketApiService: MarketApiService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.tokenStandard = params['token'];

            this.zenonToolsApiService
                .getTokenDetails(this.tokenStandard)
                .pipe(take(1))
                .subscribe((details: TokenDetails) => {
                    this.isLoading = false;
                    this.tokenDetails = details;
                });
        });
    }

    onCopyAddress(address: string) {
        this.clipboard.copy(address);
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }

    convertToDaysAndHours(milliseconds: number) {
        const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
        const daysMs = milliseconds % (24 * 60 * 60 * 1000);
        const hours = Math.floor(daysMs / (60 * 60 * 1000));
        return days + 'd ' + hours + 'h';
    }

    convertSecondsToMonths(seconds: number) {
        const months = seconds / 30 / 24 / 60 / 60;
        return months == 1 ? `${months} month` : `${months} months`;
    }
}
