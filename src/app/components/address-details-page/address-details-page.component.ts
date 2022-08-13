import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { combineLatest, map, take } from 'rxjs';
import { AddressDetails } from 'src/app/services/zenon-tools-api/interfaces/address-details';
import { faCopy, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { MarketApiService } from 'src/app/services/market-api/market-api.service';
import { CurrentPrice } from 'src/app/services/market-api/coin-gecko-types';

@Component({
    selector: 'app-address-details-page',
    templateUrl: './address-details-page.component.html',
    styleUrls: ['./address-details-page.component.scss'],
})
export class AddressDetailsPageComponent implements OnInit {
    faCopy = faCopy;
    faCircleInfo = faCircleInfo;

    address: string = '';
    usdValue: number = 0;
    isLoading: boolean = true;
    addressDetails?: AddressDetails;
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
        private router: Router,
        private zenonToolsApiService: ZenonToolsApiService,
        private marketApiService: MarketApiService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.address = params['address'];

            this.zenonToolsApiService
                .getAddressDetails(this.address)
                .pipe(take(1))
                .subscribe((details: AddressDetails) => {
                    this.isLoading = false;
                    this.addressDetails = details;

                    combineLatest([
                        this.currentZnnPrice$,
                        this.currentQsrPrice$,
                    ])
                        .pipe(take(1))
                        .subscribe(([znnPrice, qsrPrice]) => {
                            this.usdValue =
                                (details.znnBalance / this.coinDecimals) *
                                    znnPrice +
                                (details.qsrBalance / this.coinDecimals) *
                                    qsrPrice;
                        });
                });
        });
    }
}
