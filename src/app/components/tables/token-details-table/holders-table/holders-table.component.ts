import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription, take } from 'rxjs';
import { Pillars } from 'src/app/services/zenon-tools-api/interfaces/pillar';
import {
    TokenHolder,
    TokenHolders,
} from 'src/app/services/zenon-tools-api/interfaces/token/token-holders';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import Common from 'src/app/utils/common';

export interface HolderRow {
    address: string;
    addressLabel: string;
    balance: number;
    share: number;
    isOwner: boolean;
}

@Component({
    selector: 'app-holders-table',
    templateUrl: './holders-table.component.html',
    styleUrls: ['./holders-table.component.scss'],
})
export class HoldersTableComponent implements OnChanges {
    @Input() tokenStandard!: string;
    @Input() decimals!: number;
    @Input() totalSupply!: number;
    @Input() symbol!: string;
    @Input() owner!: string;

    isLoading: boolean = true;
    hasItems: boolean = true;

    dataSource = new MatTableDataSource<HolderRow>();

    displayedColumns: string[] = ['address', 'balance', 'share'];

    itemsPerPage: number = 10;
    activePage: number = 1;
    activeSearchText: string = '';

    itemsObservableSubject$ = new Subject<Observable<TokenHolders>>();
    itemsObservableSubscription!: Subscription;

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            (changes['tokenStandard'] &&
                changes['tokenStandard'].currentValue != null) ||
            (changes['decimals'] && changes['decimals'].currentValue != null) ||
            (changes['totalSupply'] &&
                changes['totalSupply'].currentValue != null) ||
            (changes['symbol'] && changes['symbol'].currentValue != null) ||
            (changes['owner'] && changes['owner'].currentValue != null)
        ) {
            this.zenonToolsApiService.pillars$
                .pipe(take(1))
                .subscribe((pillars: Pillars) => {
                    this.isLoading = true;
                    this.activePage = 1;
                    this.itemsObservableSubscription =
                        this.itemsObservableSubject$.subscribe(
                            (observable: Observable<TokenHolders>) => {
                                observable
                                    .pipe(take(1))
                                    .subscribe((holders: TokenHolders) => {
                                        this.isLoading = false;

                                        this.hasItems = holders.length > 0;

                                        this.dataSource.data = holders.map(
                                            (item: TokenHolder): HolderRow => ({
                                                address: item.address,
                                                addressLabel:
                                                    Common.tryGetAddressLabel(
                                                        item.address,
                                                        pillars,
                                                        true
                                                    ),
                                                balance:
                                                    item.balance /
                                                    Math.pow(10, this.decimals),
                                                share:
                                                    (item.balance /
                                                        this.totalSupply) *
                                                    100,
                                                isOwner:
                                                    item.address == this.owner,
                                            })
                                        );
                                    });
                            }
                        );
                });

            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getTokenHolders(
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
            this.zenonToolsApiService.getTokenHolders(
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
                this.zenonToolsApiService.getTokenHolders(
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
            this.zenonToolsApiService.getTokenHolders(
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
                this.zenonToolsApiService.getTokenHolders(
                    this.tokenStandard,
                    this.activePage,
                    this.activeSearchText
                )
            );
        }
    }
}
