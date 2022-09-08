import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription, take } from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    PlasmaFusion,
    PlasmaFusions,
} from 'src/app/services/zenon-tools-api/interfaces/account/plasma-fusion';
import Common from 'src/app/utils/common';

export interface Fusionrow {
    providerAddress: string;
    beneficiaryAddress: string;
    providerLabel: string;
    beneficiaryLabel: string;
    fusedQsr: number;
    timestamp: number;
}

@Component({
    selector: 'app-plasma-table',
    templateUrl: './plasma-table.component.html',
    styleUrls: ['./plasma-table.component.scss'],
})
export class PlasmaTableComponent implements OnChanges {
    @Input() address!: string;

    isLoading: boolean = true;
    hasItems: boolean = true;

    dataSource = new MatTableDataSource<Fusionrow>();

    coinDecimals: number = 100000000;

    displayedColumns: string[] = [
        'provider',
        'beneficiary',
        'fusedQsr',
        'timestamp',
    ];

    itemsPerPage: number = 10;
    activePage: number = 1;

    itemsObservableSubject$ = new Subject<Observable<PlasmaFusions>>();
    itemsObservableSubscription!: Subscription;

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['address'] && changes['address'].currentValue != null) {
            this.isLoading = true;
            this.activePage = 1;
            this.itemsObservableSubscription =
                this.itemsObservableSubject$.subscribe(
                    (observable: Observable<PlasmaFusions>) => {
                        observable
                            .pipe(take(1))
                            .subscribe((fusions: PlasmaFusions) => {
                                this.isLoading = false;

                                this.hasItems = fusions.length > 0;

                                this.dataSource.data = fusions.map(
                                    (item: PlasmaFusion): Fusionrow => ({
                                        providerAddress: item.address,
                                        beneficiaryAddress: item.beneficiary,
                                        providerLabel:
                                            Common.tryGetAddressLabel(
                                                item.address,
                                                true
                                            ),
                                        beneficiaryLabel:
                                            Common.tryGetAddressLabel(
                                                item.beneficiary,
                                                true
                                            ),
                                        fusedQsr: item.qsrAmount,
                                        timestamp: item.momentumTimestamp,
                                    })
                                );
                            });
                    }
                );

            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getAccountPlasmaFusions(
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
            this.zenonToolsApiService.getAccountPlasmaFusions(
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
                this.zenonToolsApiService.getAccountPlasmaFusions(
                    this.address,
                    this.activePage
                )
            );
        }
    }
}
