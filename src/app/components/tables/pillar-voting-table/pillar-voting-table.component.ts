import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
    faAngleLeft,
    faAngleRight,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject, Subscription, take } from 'rxjs';
import { Vote, Votes } from 'src/app/services/zenon-tools-api/interfaces/vote';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';

export interface VoteRow {
    projectName: string;
    phaseName: string;
    vote: string;
    voteIconHex: string;
    timestamp: number;
    url: string;
    projectId: string;
}

enum VoteType {
    'Yes' = 0,
    'No' = 1,
    'Abstain' = 2,
}

@Component({
    selector: 'app-pillar-voting-table',
    templateUrl: './pillar-voting-table.component.html',
    styleUrls: ['./pillar-voting-table.component.scss'],
})
export class PillarVotingTableComponent implements OnInit {
    @Input() pillarName!: string;

    votesObservableSubject$ = new Subject<Observable<Votes>>();
    votesObservableSubscription!: Subscription;

    faArrowUpRightFromSquare = faArrowUpRightFromSquare;
    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;

    hasVotes: boolean = false;
    isLoading: boolean = true;

    activePage: number = 1;

    dataSource = new MatTableDataSource<VoteRow>();

    displayedColumns: string[] = ['proposal', 'vote', 'timestamp', 'url'];

    constructor(
        private zenonToolsApiService: ZenonToolsApiService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.votesObservableSubscription =
            this.votesObservableSubject$.subscribe(
                (observable: Observable<Votes>) => {
                    observable.pipe(take(1)).subscribe((votes: Votes) => {
                        this.isLoading = false;
                        this.hasVotes = votes.length > 0;

                        this.dataSource.data = votes.map(
                            (vote: Vote): VoteRow => ({
                                projectName: vote.projectName ?? '',
                                phaseName: vote.phaseName ?? '',
                                vote: VoteType[vote.vote],
                                voteIconHex: this.getVoteIconHex(vote.vote),
                                timestamp: vote.momentumTimestamp,
                                url: vote.projectUrl ?? '',
                                projectId: vote.projectId,
                            })
                        );
                    });
                }
            );

        this.votesObservableSubject$.next(
            this.zenonToolsApiService.getVotesByPillar(
                this.pillarName,
                this.activePage
            )
        );
    }

    ngOnDestroy(): void {
        this.votesObservableSubscription.unsubscribe();
    }

    onRowPressed(projectId: string) {
        this.router.navigate(['/accelerator', projectId]);
    }

    onNextSelected() {
        this.isLoading = true;
        this.activePage++;
        this.votesObservableSubject$.next(
            this.zenonToolsApiService.getVotesByPillar(
                this.pillarName,
                this.activePage
            )
        );
    }

    onPreviousSelected() {
        this.isLoading = true;
        if (this.activePage > 1) {
            this.activePage--;
            this.votesObservableSubject$.next(
                this.zenonToolsApiService.getVotesByPillar(
                    this.pillarName,
                    this.activePage
                )
            );
        }
    }

    private getVoteIconHex(vote: number) {
        return vote == 0 ? '2705' : vote == 1 ? '274C' : '2B55';
    }
}
