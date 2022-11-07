import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, take } from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    faCopy,
    faSearch,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Clipboard } from '@angular/cdk/clipboard';
import {
    TokenListItem,
    TokenListItems,
} from 'src/app/services/zenon-tools-api/interfaces/token-list-item';

export interface TokenRow {
    name: string;
    symbol: string;
    domain: string;
    tokenStandard: string;
    totalSupply: number;
    maxSupply: number;
    icon: string;
    holderCount: number;
}

@Component({
    selector: 'app-tokens-page',
    templateUrl: './tokens-page.component.html',
    styleUrls: ['./tokens-page.component.scss'],
})
export class TokensPageComponent implements OnInit {
    @ViewChild('searchInput', { static: false })
    searchInput!: ElementRef;

    faSearch = faSearch;
    faCopy = faCopy;
    faArrowUpRightFromSquare = faArrowUpRightFromSquare;

    tokens$!: Observable<TokenListItems>;
    tokensObservableSubject$ = new Subject<Observable<TokenListItems>>();
    tokensObservableSubscription!: Subscription;

    isLoading: boolean = true;
    activePage: number = 1;

    activeSearchText: string = '';
    endText: string = 'End of tokens.';

    dataSource = new MatTableDataSource<TokenRow>();

    hasItems: boolean = true;
    itemsPerPage: number = 20;

    displayedColumns: string[] = [
        'token',
        'domain',
        'totalSupply',
        'tokenStandard',
        'holderCount',
    ];

    tokensWithIcon: string[] = [
        'zts1znnxxxxxxxxxxxxx9z4ulx',
        'zts1qsrxxxxxxxxxxxxxmrhjll',
    ];

    constructor(
        public dialog: MatDialog,
        private zenonToolsApiService: ZenonToolsApiService,
        private router: Router,
        private route: ActivatedRoute,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.tokensObservableSubscription =
            this.tokensObservableSubject$.subscribe(
                (observable: Observable<TokenListItems>) => {
                    observable
                        .pipe(take(1))
                        .subscribe((tokens: TokenListItems) => {
                            this.isLoading = false;

                            this.hasItems = tokens.length > 0;

                            this.dataSource.data = tokens.map(
                                (item: TokenListItem): TokenRow => ({
                                    name: item.name,
                                    symbol: item.symbol,
                                    domain: item.domain,
                                    tokenStandard: item.tokenStandard,
                                    totalSupply:
                                        item.totalSupply /
                                        Math.pow(10, item.decimals),
                                    maxSupply: item.maxSupply,
                                    icon: this.getTokenIconPath(
                                        item.tokenStandard
                                    ),
                                    holderCount: item.holderCount,
                                })
                            );
                        });
                }
            );

        this.route.queryParams.subscribe((param) => {
            const page = parseInt(param['page'] ?? 1);
            this.activePage = page;
            this.tokensObservableSubject$.next(
                this.zenonToolsApiService.getTokens(page, this.activeSearchText)
            );
        });
    }

    ngOnDestroy(): void {
        this.tokensObservableSubscription.unsubscribe();
    }

    onSearch(searchText: string) {
        this.isLoading = true;
        this.activePage = 1;
        this.activeSearchText = searchText;
        this.endText = 'End of results.';
        this.tokensObservableSubject$.next(
            this.zenonToolsApiService.getTokens(
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
        this.tokensObservableSubject$.next(
            this.zenonToolsApiService.getTokens(
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

    onRowPressed(id: string) {
        this.router.navigate(['/tokens', id]);
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }

    private getTokenIconPath(id: string) {
        return this.tokensWithIcon.includes(id)
            ? `../../../assets/images/tokens/${id}_50.png`
            : '';
    }
}
