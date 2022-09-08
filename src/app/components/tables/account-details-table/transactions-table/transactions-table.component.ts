import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription, take } from 'rxjs';
import {
    AccountTransaction,
    AccountTransactions,
} from 'src/app/services/zenon-tools-api/interfaces/account/account-transaction';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Common from 'src/app/utils/common';

export interface TransactionRow {
    fromAddress: string;
    toAddress: string;
    fromLabel: string;
    toLabel: string;
    value: number;
    symbol: string;
    method: string;
    timestamp: number;
    isIncoming: boolean;
}

@Component({
    selector: 'app-transactions-table',
    templateUrl: './transactions-table.component.html',
    styleUrls: ['./transactions-table.component.scss'],
})
export class TransactionsTableComponent implements OnChanges {
    @Input() address!: string;
    @Input() showReceived: boolean = true;

    faArrowDown = faArrowDown;
    faArrowUp = faArrowUp;

    isLoading: boolean = true;
    hasItems: boolean = true;

    dataSource = new MatTableDataSource<TransactionRow>();

    displayedColumns: string[] = ['fromTo', 'method', 'value', 'timestamp'];

    itemsPerPage: number = 10;
    activePage: number = 1;

    itemsObservableSubject$ = new Subject<Observable<AccountTransactions>>();
    itemsObservableSubscription!: Subscription;

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['address'] && changes['address'].currentValue != null) {
            this.isLoading = true;
            this.activePage = 1;
            this.itemsObservableSubscription =
                this.itemsObservableSubject$.subscribe(
                    (observable: Observable<AccountTransactions>) => {
                        observable
                            .pipe(take(1))
                            .subscribe((transactions: AccountTransactions) => {
                                this.isLoading = false;

                                this.hasItems = transactions.length > 0;

                                this.dataSource.data = transactions.map(
                                    (
                                        item: AccountTransaction
                                    ): TransactionRow => ({
                                        fromAddress: item.address,
                                        toAddress: item.toAddress,
                                        fromLabel: Common.tryGetAddressLabel(
                                            item.address,
                                            true
                                        ),
                                        toLabel: Common.tryGetAddressLabel(
                                            item.toAddress,
                                            true
                                        ),
                                        value:
                                            item.amount /
                                            Math.pow(10, item.decimals),
                                        symbol: item.symbol,
                                        method: item.method,
                                        timestamp: item.momentumTimestamp,
                                        isIncoming:
                                            item.toAddress == this.address,
                                    })
                                );
                            });
                    }
                );

            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getAccountTransactions(
                    this.address,
                    this.activePage,
                    this.showReceived
                )
            );
        }
    }

    onNextSelected() {
        this.isLoading = true;
        this.activePage++;
        this.itemsObservableSubject$.next(
            this.zenonToolsApiService.getAccountTransactions(
                this.address,
                this.activePage,
                this.showReceived
            )
        );
    }

    onPreviousSelected() {
        if (this.activePage > 1) {
            this.isLoading = true;
            this.activePage--;
            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getAccountTransactions(
                    this.address,
                    this.activePage,
                    this.showReceived
                )
            );
        }
    }
}
