import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { Donations } from 'src/app/services/zenon-tools-api/interfaces/donation';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { DonateModalComponent } from '../modals/donate-modal/donate-modal.component';

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
    nowDate: Date = new Date();

    constructor(
        public dialog: MatDialog,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngOnInit(): void {
        this.donations$ = this.zenonToolsApiService.getDonations();
        this.donations$.pipe(take(1)).subscribe((donations: Donations) => {
            this.isLoading = false;
            this.computeMonthlyDonations(donations);
        });
    }

    onDonateSelected(donationAmount: number) {
        this.dialog.open(DonateModalComponent, {
            data: donationAmount,
        });
    }

    private computeMonthlyDonations(donations: Donations) {
        const startTime = new Date();
        startTime.setDate(startTime.getDate() - 30);
        this.monthlyDonations = Math.floor(
            donations.reduce((acc, donation) => {
                return (
                    acc +
                    (donation.momentumTimestamp >= (startTime.getTime() / 1000) &&
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
