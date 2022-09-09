import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Observable, take } from 'rxjs';
import {
    Delegator,
    Delegators,
} from 'src/app/services/zenon-tools-api/interfaces/delegator';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';

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
    @Input() totalWeight!: number;
    @Input() ownerAddress!: string;
    @Input() withdrawAddress!: string;

    faCopy = faCopy;

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
        });
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
        this.hasResults = delegatorsToShow.length > 0;
        this.dataSource.data = delegatorsToShow.map(
            (delegator: Delegator, index: number): DelegatorRow => ({
                address: delegator.address,
                delegationAmount:
                    delegator.delegationAmount / this.coinDecimals,
                share: Math.min(
                    (delegator.delegationAmount / this.totalWeight) * 100,
                    100
                ),
                delegationStartTimestamp: delegator.delegationStartTimestamp,
                isSelfDelegation:
                    delegator.address == this.ownerAddress ||
                    delegator.address == this.withdrawAddress,
            })
        );
    }
}
