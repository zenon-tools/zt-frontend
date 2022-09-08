import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription, take } from 'rxjs';
import {
    AzProposal,
    AzProposals,
} from 'src/app/services/zenon-tools-api/interfaces/account/az-proposal';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { ProposalStatus } from 'src/app/components/project-status-chip/project-status-chip.component';
import { Router } from '@angular/router';

export interface ProposalRow {
    projectName: string;
    phaseName: string;
    projectId: string;
    creationTimestamp: number;
    url: string;
    status: string;
}

@Component({
    selector: 'app-proposals-table',
    templateUrl: './proposals-table.component.html',
    styleUrls: ['./proposals-table.component.scss'],
})
export class ProposalsTableComponent implements OnChanges {
    @Input() address!: string;

    isLoading: boolean = true;
    hasItems: boolean = true;

    dataSource = new MatTableDataSource<ProposalRow>();

    displayedColumns: string[] = [
        'proposal',
        'timestamp',
        'status',
        'projectId',
    ];

    itemsPerPage: number = 10;
    activePage: number = 1;

    itemsObservableSubject$ = new Subject<Observable<AzProposals>>();
    itemsObservableSubscription!: Subscription;

    constructor(
        private router: Router,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['address'] && changes['address'].currentValue != null) {
            this.isLoading = true;
            this.activePage = 1;
            this.itemsObservableSubscription =
                this.itemsObservableSubject$.subscribe(
                    (observable: Observable<AzProposals>) => {
                        observable
                            .pipe(take(1))
                            .subscribe((proposals: AzProposals) => {
                                this.isLoading = false;

                                this.hasItems = proposals.length > 0;

                                this.dataSource.data = proposals.map(
                                    (item: AzProposal): ProposalRow => ({
                                        projectName: item.projectName,
                                        phaseName: item.phaseName,
                                        projectId: item.projectId,
                                        creationTimestamp:
                                            item.creationTimestamp,
                                        url: item.url,
                                        status: this.getProposalStatusText(
                                            item.status
                                        ),
                                    })
                                );
                            });
                    }
                );

            this.itemsObservableSubject$.next(
                this.zenonToolsApiService.getAccountAzProposals(
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
            this.zenonToolsApiService.getAccountAzProposals(
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
                this.zenonToolsApiService.getAccountAzProposals(
                    this.address,
                    this.activePage
                )
            );
        }
    }

    onRowPressed(projectId: string) {
        this.router.navigate(['/accelerator', projectId]);
    }

    private getProposalStatusText(status: number) {
        switch (status) {
            case ProposalStatus.Voting:
                return 'Voting open';
            case ProposalStatus.Active:
                return 'Accepted';
            case ProposalStatus.Paid:
                return 'Funded';
            case ProposalStatus.Completed:
                return 'Completed';
            case ProposalStatus.Closed:
                return 'Not accepted';
            default:
                return '';
        }
    }
}
