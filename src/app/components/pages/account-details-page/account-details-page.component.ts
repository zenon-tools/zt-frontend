import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { combineLatest, map, take } from 'rxjs';
import { AccountDetails } from 'src/app/services/zenon-tools-api/interfaces/account/account-details';
import {
    faCopy,
    faCircleInfo,
    faDownload,
    faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { MarketApiService } from 'src/app/services/market-api/market-api.service';
import { CurrentPrice } from 'src/app/services/market-api/coin-gecko-types';
import { ParticipationDetails } from 'src/app/services/zenon-tools-api/interfaces/account/participation-details';
import Common from 'src/app/utils/common';
import { Pillars } from 'src/app/services/zenon-tools-api/interfaces/pillar';
import { MatDialog } from '@angular/material/dialog';
import { ExportRewardsModalComponent } from '../../modals/export-rewards-modal/export-rewards-modal.component';

@Component({
    selector: 'app-account-details-page',
    templateUrl: './account-details-page.component.html',
    styleUrls: ['./account-details-page.component.scss'],
})
export class AccountDetailsPageComponent implements OnInit {
    @HostListener('document:click', ['$event.target'])
    onClick(target: Element) {
        if (!target.closest('.menu-icon')) {
            this.isMenuOpen = false;
        }
    }

    faCopy = faCopy;
    faCircleInfo = faCircleInfo;
    faDownload = faDownload;
    faEllipsisH = faEllipsisH;

    address: string = '';
    usdValue: number = 0;
    isLoading: boolean = true;
    addressDetails?: AccountDetails;
    coinDecimals: number = 100000000;

    currencyToUse: keyof CurrentPrice = 'usd';

    /* currentZnnPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse])
    ); */

    /* currentQsrPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse] / 10)
    ); */

    currentZnnPrice$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.znnPriceUsd)
    );

    currentQsrPrice$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => nom.qsrPriceUsd)
    );

    smartContractLabel: string = '';

    participationDetails?: ParticipationDetails;
    hasParticipationDetails: boolean = false;
    isMenuOpen: boolean = false;
    rewardsCount: number = 0;

    constructor(
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private zenonToolsApiService: ZenonToolsApiService,
        private marketApiService: MarketApiService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.zenonToolsApiService.pillars$
            .pipe(take(1))
            .subscribe((pillars: Pillars) => {
                this.route.params.subscribe((params) => {
                    this.address = params['address'];
                    this.smartContractLabel = Common.tryGetAddressLabel(
                        this.address,
                        pillars
                    );

                    this.zenonToolsApiService
                        .getAccountRewardsCount(this.address)
                        .pipe(take(1))
                        .subscribe((count: number) => {
                            this.rewardsCount = count;

                            this.zenonToolsApiService
                                .getAccountDetails(this.address)
                                .pipe(take(1))
                                .subscribe((details: AccountDetails) => {
                                    this.isLoading = false;
                                    this.addressDetails = details;

                                    combineLatest([
                                        this.currentZnnPrice$,
                                        this.currentQsrPrice$,
                                    ])
                                        .pipe(take(1))
                                        .subscribe(([znnPrice, qsrPrice]) => {
                                            this.usdValue =
                                                (details.znnBalance /
                                                    this.coinDecimals) *
                                                    znnPrice +
                                                (details.qsrBalance /
                                                    this.coinDecimals) *
                                                    qsrPrice;
                                        });
                                });
                        });

                    this.zenonToolsApiService
                        .getAccountParticipation(this.address)
                        .pipe(take(1))
                        .subscribe((details: ParticipationDetails) => {
                            this.hasParticipationDetails =
                                Object.keys(details.delegation).length > 0 ||
                                details.stakes.length > 0 ||
                                Object.keys(details.sentinel).length > 0 ||
                                Object.keys(details.pillar).length > 0;
                            this.participationDetails = details;
                        });
                });
            });
    }

    onCopyAddress(address: string) {
        this.clipboard.copy(address);
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }

    onExportRewardsSelected() {
        this.dialog.open(ExportRewardsModalComponent, {
            data: this.address,
        });
    }

    onMenuSelected() {
        this.isMenuOpen = !this.isMenuOpen;
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
