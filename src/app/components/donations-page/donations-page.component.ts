import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Donations } from 'src/app/services/zenon-tools-api/interfaces/donation';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';

@Component({
    selector: 'app-donations-page',
    templateUrl: './donations-page.component.html',
    styleUrls: ['./donations-page.component.scss'],
})
export class DonationsPageComponent implements OnInit {
    donations$!: Observable<Donations>;

    isLoading: boolean = true;
    monthlyDonations: number = 0;
    barValue: number = 0;

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnInit(): void {
        this.donations$ = this.zenonToolsApiService.getDonations();
        this.donations$.pipe(take(1)).subscribe((donations: Donations) => {
            this.isLoading = false;
            this.computeMonthlyDonations(donations);
        });
    }

    computeMonthlyDonations(donations: Donations) {
        const now = new Date();
        const startOfMonth =
            new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000;
        this.monthlyDonations = Math.floor(
            donations.reduce((acc, donation) => {
                return (
                    acc +
                    (donation.momentumTimestamp >= startOfMonth &&
                    donation.symbol === 'ZNN'
                        ? donation.amount / Math.pow(10, donation.decimals)
                        : 0)
                );
            }, 0)
        );
        this.barValue =
            this.monthlyDonations > 100 ? 100 : this.monthlyDonations;
    }
}
