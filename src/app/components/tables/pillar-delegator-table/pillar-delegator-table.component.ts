import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Observable, take } from 'rxjs';
import {
    Delegator,
    Delegators,
} from 'src/app/services/zenon-tools-api/interfaces/delegator';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { faCopy, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import Common from 'src/app/utils/common';

export interface DelegatorRow {
    address: string;
    delegationAmount: number;
    share: number;
    delegationStartTimestamp: number;
    isSelfDelegation: boolean;
}

@Component({
    selector: 'app-pillar-delegator-table',
    templateUrl: './pillar-delegator-table.component.html',
    styleUrls: ['./pillar-delegator-table.component.scss'],
})
export class PillarDelegatorTableComponent implements OnInit {
    @Input() pillarName!: string;
    @Input() ownerAddress!: string;
    @Input() withdrawAddress!: string;

    faCopy = faCopy;
    faDownload = faDownload;

    coinDecimals: number = 100000000;

    delegators$!: Observable<Delegators>;
    delegators?: Delegators;

    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;

    hasDelegators: boolean = false;
    hasResults: boolean = false;
    isLoading: boolean = true;

    activePage: number = 1;

    dataSource = new MatTableDataSource<DelegatorRow>();

    displayedColumns: string[] = [
        'address',
        'delegationAmount',
        'share',
        'delegationStartTimestamp',
    ];

    activeSearchText: string = '';

    itemsPerPage: number = 10;

    isInitialized: boolean = false;

    constructor(
        private zenonToolsApiService: ZenonToolsApiService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.delegators$ = this.zenonToolsApiService.getPillarDelegators(
            this.pillarName
        );
        this.delegators$.pipe(take(1)).subscribe((delegators: Delegators) => {
            this.isLoading = false;
            this.hasDelegators = delegators.length > 0;
            this.delegators = delegators;
            this.updateDataSource();
            this.isInitialized = true;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes['pillarName'] &&
                changes['pillarName'].currentValue != null) ||
            (changes['ownerAddress'] &&
                changes['ownerAddress'].currentValue != null) ||
            (changes['withdrawAddress'] &&
                changes['withdrawAddress'].currentValue != null)
        ) {
            if (this.isInitialized) {
                this.updateDataSource();
            }
        }
    }

    onSearch(searchText: string) {
        this.activePage = 1;
        this.activeSearchText = searchText;
        this.updateDataSource();
    }

    onClearSearch() {
        this.activePage = 1;
        this.activeSearchText = '';
        this.updateDataSource();
    }

    onNextSelected() {
        this.activePage++;
        this.updateDataSource();
    }

    onPreviousSelected() {
        if (this.activePage > 1) {
            this.activePage--;
            this.updateDataSource();
        }
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }

    onDownloadSelected() {
        if (this.delegators != null && this.delegators.length > 0) {
            const totalWeight = this.calculateTotalWeight();
            let csv =
                'Address,Weight (ZNN),Share (%),Delegation Start (UNIX)\n';
            for (const d of this.delegators) {
                const share = Math.min(
                    (d.delegationAmount / totalWeight) * 100,
                    100
                );
                csv += `${d.address},${(
                    d.delegationAmount / this.coinDecimals
                ).toFixed(8)},${share.toFixed(2)},${
                    d.delegationStartTimestamp
                }\n`;
            }
            const timestamp = Math.floor(new Date().getTime() / 1000);
            const fileName = `delegators_${this.pillarName}_${timestamp}.csv`;
            Common.initiateCsvDownload(fileName, csv);
        }
    }

    private updateDataSource() {
        const startIndex = (this.activePage - 1) * this.itemsPerPage;
        const filteredDelegators = this.delegators?.filter((item) =>
            item.address.includes(this.activeSearchText)
        );
        const delegatorsToShow =
            filteredDelegators?.slice(
                startIndex,
                startIndex + this.itemsPerPage
            ) ?? [];
        const totalWeight = this.calculateTotalWeight();
        this.hasResults = delegatorsToShow.length > 0;
        this.dataSource.data = delegatorsToShow.map(
            (delegator: Delegator, index: number): DelegatorRow => ({
                address: delegator.address,
                delegationAmount:
                    delegator.delegationAmount / this.coinDecimals,
                share: Math.min(
                    (delegator.delegationAmount / totalWeight) * 100,
                    100
                ),
                delegationStartTimestamp: delegator.delegationStartTimestamp,
                isSelfDelegation:
                    delegator.address == this.ownerAddress ||
                    delegator.address == this.withdrawAddress,
            })
        );
    }

    private calculateTotalWeight() {
        return (
            this.delegators?.reduce((acc, e) => {
                return acc + e.delegationAmount;
            }, 1) ?? 1
        );
    }
}
