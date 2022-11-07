import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription, take } from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    faArrowDown,
    faArrowUp,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import Common from 'src/app/utils/common';
import {
    TokenTransaction,
    TokenTransactions,
} from 'src/app/services/zenon-tools-api/interfaces/token/token-transactions';
import { Pillars } from 'src/app/services/zenon-tools-api/interfaces/pillar';

export interface TransactionRow {
    fromAddress: string;
    toAddress: string;
    fromLabel: string;
    toLabel: string;
    value: number;
    symbol: string;
    method: string;
    timestamp: number;
}

@Component({
    selector: 'app-token-transactions-table',
    templateUrl: './token-transactions-table.component.html',
    styleUrls: ['./token-transactions-table.component.scss'],
})
export class TokenTransactionsTableComponent implements OnChanges {
    @Input() tokenStandard!: string;
    @Input() decimals!: number;
    @Input() symbol!: string;

    faArrowDown = faArrowDown;
    faArrowUp = faArrowUp;
    faArrowRight = faArrowRight;

    isLoading: boolean = true;
    hasItems: boolean = true;

    dataSource = new MatTableDataSource<TransactionRow>();

    displayedColumns: string[] = ['from', 'to', 'method', 'value', 'timestamp'];

    itemsPerPage: number = 10;
    activePage: number = 1;
    activeSearchText: string = '';

    itemsObservableSubject$ = new Subject<Observable<TokenTransactions>>();
    itemsObservableSubscription!: Subscription;

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['tokenStandard'] &&
            changes['tokenStandard'].currentValue != null
        ) {
            this.zenonToolsApiService.pillars$
                .pipe(take(1))
                .subscribe((pillars: Pillars) => {
                    this.isLoading = true;
                    this.activePage = 1;
                    this.itemsObservableSubscription =
                        this.itemsObservableSubject$.subscribe(
                            (observable: Observable<TokenTransactions>) => {
                                observable
                                    .pipe(take(1))
                                    .subscribe(
                                        (transactions: TokenTransactions) => {
                                            this.isLoading = false;

                                            this.hasItems =
                                                transactions.length > 0;

                                            this.dataSource.data =
                                                transactions.map(
                                                    (
                                                        item: TokenTransaction
                                                    ): TransactionRow => ({
                                                        fromAddress:
                                                            item.address,
                                                        toAddress:
                                                            item.toAddress,
                                                        fromLabel:
                                                            Common.tryGetAddressLabel(
                                                                item.address,
                                                                pillars,
                                                                true
                                                            ),
                                                        toLabel:
                                                            Common.tryGetAddressLabel(
                                                                item.toAddress,
                                                                pillars,
                                                                true
                                                            ),
                                                        value:
                                                            item.amount /
                                                            Math.pow(
                                                                10,
                                                                this.decimals
                                                            ),
                                                        symbol: this.symbol,
                                                        method: item.method,
                                                        timestamp:
                                                            item.momentumTimestamp,
                                                    })
                                                );
                                        }
                                    );
                            }
                        );
                });

            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getTokenTransactions(
                    this.tokenStandard,
                    this.activePage
                )
            );
        }
    }

    onNextSelected() {
        this.isLoading = true;
        this.activePage++;
        this.itemsObservableSubject$.next(
            this.zenonToolsApiService.getTokenTransactions(
                this.tokenStandard,
                this.activePage,
                this.activeSearchText
            )
        );
    }

    onPreviousSelected() {
        if (this.activePage > 1) {
            this.isLoading = true;
            this.activePage--;
            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getTokenTransactions(
                    this.tokenStandard,
                    this.activePage,
                    this.activeSearchText
                )
            );
        }
    }

    onSearch(searchText: string) {
        this.activePage = 1;
        this.activeSearchText = searchText;
        this.isLoading = true;
        this.itemsObservableSubject$.next(
            this.zenonToolsApiService.getTokenTransactions(
                this.tokenStandard,
                this.activePage,
                this.activeSearchText
            )
        );
    }

    onClearSearch() {
        if (this.activeSearchText.length > 0) {
            this.activePage = 1;
            this.activeSearchText = '';
            this.isLoading = true;
            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getTokenTransactions(
                    this.tokenStandard,
                    this.activePage,
                    this.activeSearchText
                )
            );
        }
    }
}
