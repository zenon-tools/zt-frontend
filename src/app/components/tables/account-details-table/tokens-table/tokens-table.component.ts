import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription, take } from 'rxjs';
import {
    TokenBalance,
    TokenBalances,
} from 'src/app/services/zenon-tools-api/interfaces/account/token-balance';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';

export interface TokenRow {
    token: string;
    balance: number;
    symbol: string;
    tokenId: string;
    balancePipe: string;
}

@Component({
    selector: 'app-tokens-table',
    templateUrl: './tokens-table.component.html',
    styleUrls: ['./tokens-table.component.scss'],
})
export class TokensTableComponent implements OnChanges {
    @Input() address!: string;

    isLoading: boolean = true;
    hasItems: boolean = true;

    dataSource = new MatTableDataSource<TokenRow>();

    displayedColumns: string[] = ['token', 'balance', 'tokenId'];

    itemsPerPage: number = 10;
    activePage: number = 1;

    itemsObservableSubject$ = new Subject<Observable<TokenBalances>>();
    itemsObservableSubscription!: Subscription;

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['address'] && changes['address'].currentValue != null) {
            this.isLoading = true;
            this.activePage = 1;
            this.itemsObservableSubscription =
                this.itemsObservableSubject$.subscribe(
                    (observable: Observable<TokenBalances>) => {
                        observable
                            .pipe(take(1))
                            .subscribe((transactions: TokenBalances) => {
                                this.isLoading = false;

                                this.hasItems = transactions.length > 0;

                                this.dataSource.data = transactions.map(
                                    (item: TokenBalance): TokenRow => ({
                                        token: item.name,
                                        balance:
                                            item.balance /
                                            Math.pow(10, item.decimals),
                                        symbol: item.symbol,
                                        tokenId: item.tokenStandard,
                                        balancePipe: `1.${item.decimals}-${item.decimals}`,
                                    })
                                );
                            });
                    }
                );

            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getAccountTokens(
                    this.address,
                    this.activePage
                )
            );
        }
    }

    onNextSelected() {
        this.isLoading = true;
        this.activePage++;
        this.itemsObservableSubject$.next(
            this.zenonToolsApiService.getAccountTokens(
                this.address,
                this.activePage
            )
        );
    }

    onPreviousSelected() {
        if (this.activePage > 1) {
            this.isLoading = true;
            this.activePage--;
            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getAccountTokens(
                    this.address,
                    this.activePage
                )
            );
        }
    }
}
