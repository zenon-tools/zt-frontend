import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, take } from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { faCopy, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
    AccountListItem,
    AccountListItems,
} from 'src/app/services/zenon-tools-api/interfaces/account-list-item';
import { Clipboard } from '@angular/cdk/clipboard';
import Common from 'src/app/utils/common';
import { TokenDetails } from 'src/app/services/zenon-tools-api/interfaces/token/token-details';

export interface AccountRow {
    address: string;
    info: string;
    znnBalance: number;
    qsrBalance: number;
    height: number;
    percentage: number;
}

@Component({
    selector: 'app-accounts-page',
    templateUrl: './accounts-page.component.html',
    styleUrls: ['./accounts-page.component.scss'],
})
export class AccountsPageComponent implements OnInit {
    @ViewChild('searchInput', { static: false })
    searchInput!: ElementRef;

    faSearch = faSearch;
    faCopy = faCopy;

    accounts$!: Observable<AccountListItems>;
    accountsObservableSubject$ = new Subject<Observable<AccountListItems>>();
    accountsObservableSubscription!: Subscription;

    isLoading: boolean = true;
    activePage: number = 1;

    activeSearchText: string = '';
    endText: string = 'End of accounts.';

    coinDecimals: number = 100000000;

    dataSource = new MatTableDataSource<AccountRow>();

    hasItems: boolean = true;
    itemsPerPage: number = 20;

    znnTokenId: string = 'zts1znnxxxxxxxxxxxxx9z4ulx';

    displayedColumns: string[] = [
        'address',
        'znnBalance',
        'qsrBalance',
        'height',
        'percentage',
    ];

    constructor(
        public dialog: MatDialog,
        private zenonToolsApiService: ZenonToolsApiService,
        private router: Router,
        private route: ActivatedRoute,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.zenonToolsApiService
            .getTokenDetails(this.znnTokenId)
            .pipe(take(1))
            .subscribe((znn: TokenDetails) => {
                this.accountsObservableSubscription =
                    this.accountsObservableSubject$.subscribe(
                        (observable: Observable<AccountListItems>) => {
                            observable
                                .pipe(take(1))
                                .subscribe((transactions: AccountListItems) => {
                                    this.isLoading = false;

                                    this.hasItems = transactions.length > 0;

                                    this.dataSource.data = transactions.map(
                                        (
                                            item: AccountListItem
                                        ): AccountRow => ({
                                            address: item.address,
                                            info: Common.tryGetAddressLabel(
                                                item.address
                                            ),
                                            znnBalance:
                                                item.znnBalance /
                                                this.coinDecimals,
                                            qsrBalance:
                                                item.qsrBalance /
                                                this.coinDecimals,
                                            height: item.blockCount,
                                            percentage:
                                                (item.znnBalance /
                                                    znn.totalSupply) *
                                                100,
                                        })
                                    );
                                });
                        }
                    );

                this.route.queryParams.subscribe((param) => {
                    const page = parseInt(param['page'] ?? 1);
                    this.activePage = page;
                    this.accountsObservableSubject$.next(
                        this.zenonToolsApiService.getAccounts(
                            page,
                            this.activeSearchText
                        )
                    );
                });
            });
    }

    ngOnDestroy(): void {
        this.accountsObservableSubscription.unsubscribe();
    }

    onSearch(searchText: string) {
        this.isLoading = true;
        this.activePage = 1;
        this.activeSearchText = searchText;
        this.endText = 'End of results.';
        this.accountsObservableSubject$.next(
            this.zenonToolsApiService.getAccounts(
                this.activePage,
                this.activeSearchText
            )
        );
    }

    onClearSearch() {
        this.isLoading = true;
        this.activePage = 1;
        this.activeSearchText = '';
        this.endText = 'End of projects.';
        this.accountsObservableSubject$.next(
            this.zenonToolsApiService.getAccounts(
                this.activePage,
                this.activeSearchText
            )
        );
    }

    onNextSelected() {
        this.isLoading = true;
        this.activePage++;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: this.activePage },
        });
    }

    onPreviousSelected() {
        this.isLoading = true;
        if (this.activePage > 1) {
            this.activePage--;
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { page: this.activePage },
            });
        }
    }

    onRowPressed(address: string) {
        this.router.navigate(['/accounts', address]);
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }
}
