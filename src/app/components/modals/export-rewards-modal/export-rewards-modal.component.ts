import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import Common from 'src/app/utils/common';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';
import { take } from 'rxjs';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-export-rewards-modal',
    templateUrl: './export-rewards-modal.component.html',
    styleUrls: ['./export-rewards-modal.component.scss'],
})
export class ExportRewardsModalComponent implements OnInit {
    faDownload = faDownload;

    yearItems: Array<TabSelectorItem> = [
        { label: '2021', value: '2021' },
        { label: '2022', value: '2022' },
        { label: 'ALL', value: 'all' },
    ];

    currencyItems: Array<TabSelectorItem> = [
        { label: 'USD', value: 'usd' },
        { label: 'EUR', value: 'eur' },
        { label: 'GBP', value: 'gbp' },
        { label: 'CAD', value: 'cad' },
        { label: 'AUD', value: 'aud' },
    ];

    includeQsrItems: Array<TabSelectorItem> = [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
    ];

    year: string = '2021';
    currency: string = 'usd';
    includeQsr: boolean = true;
    isLoading: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ExportRewardsModalComponent>,
        private zenonToolsApiService: ZenonToolsApiService,
        @Inject(MAT_DIALOG_DATA) public address: string
    ) {}

    ngOnInit(): void {}

    onClose(): void {
        this.dialogRef.close();
    }

    onYearChanged(value: string) {
        this.year = value;
    }

    onCurrencyChanged(value: string) {
        this.currency = value;
    }

    onIncludeQsrChanged(value: boolean) {
        this.includeQsr = value;
    }

    onExportSelected() {
        this.isLoading = true;
        this.zenonToolsApiService
            .getAccountRewardsCsv(
                this.address,
                this.year,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                this.currency,
                this.includeQsr
            )
            .pipe(take(1))
            .subscribe((csv) => {
                const timestamp = Math.floor(new Date().getTime() / 1000);
                const fileName = `rewards_${this.year.toLowerCase()}_${
                    this.address
                }_${timestamp}.csv`;
                Common.initiateCsvDownload(fileName, csv.toString());
                this.isLoading = false;
            });
    }
}
