import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Vote, Votes } from 'src/app/services/zenon-tools-api/interfaces/vote';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import {
    PillarOffChainInfo,
    PillarsOffChainInfo,
} from 'src/app/services/zenon-tools-api/interfaces/pillar-off-chain-info';

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
    selector: 'app-pillar-profile-page',
    templateUrl: './pillar-profile-page.component.html',
    styleUrls: ['./pillar-profile-page.component.scss'],
})
export class PillarProfilePageComponent implements OnInit {
    faArrowUpRightFromSquare = faArrowUpRightFromSquare;
    pillarName: string = '';
    votes$!: Observable<Votes>;

    dataSource = new MatTableDataSource<VoteRow>();

    displayedColumns: string[] = ['proposal', 'vote', 'timestamp', 'url'];

    pillarsOffChainInfo$ = this.zenonToolsApiService.pillarsOffChainInfo$;
    pillarOffChainInfo?: PillarOffChainInfo;

    hasSocialLinks: boolean = false;
    isLoading: boolean = true;
    hasVotes: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.pillarName = params['name'];

            this.votes$ = this.zenonToolsApiService.getVotesByPillar(
                this.pillarName,
                1
            );
            this.votes$.pipe(take(1)).subscribe((votes: Votes) => {
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

            this.pillarsOffChainInfo$
                .pipe(take(1))
                .subscribe((pillarInfos: PillarsOffChainInfo) => {
                    this.pillarOffChainInfo = Array.from(
                        pillarInfos.values()
                    ).find((item) => item.name == this.pillarName);
                    this.hasSocialLinks =
                        this.pillarOffChainInfo?.links != null &&
                        Object.keys(this.pillarOffChainInfo!.links).length > 0;
                });
        });
    }

    private getVoteIconHex(vote: number) {
        return vote == 0 ? '2705' : vote == 1 ? '274C' : '2B55';
    }
}
