import { Component, Input, OnInit } from '@angular/core';
import { map, take } from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { ProposalStatus } from '../project-status-chip/project-status-chip.component';

@Component({
    selector: 'app-vote-breakdown-card',
    templateUrl: './vote-breakdown-card.component.html',
    styleUrls: ['./vote-breakdown-card.component.scss'],
})
export class VoteBreakdownCardComponent implements OnInit {
    @Input() yesVotes: number = 0;
    @Input() noVotes: number = 0;
    @Input() totalVotes: number = 0;
    @Input() proposalStatus: ProposalStatus = ProposalStatus.Voting;

    yesPercent: number = 0;
    noPercent: number = 0;
    quorumPercent: number = 0;
    votesUntilQuorumText: string = '';

    quorumCount$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => Math.ceil(nom.pillarCount * 0.33))
    );

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnInit(): void {
        this.quorumCount$.pipe(take(1)).subscribe((quorumCount: number) => {
            this.updatePercentages(quorumCount);
        });
    }

    updatePercentages(quorumCount: number) {
        if (this.yesVotes + this.noVotes > 0) {
            this.yesPercent =
                (this.yesVotes / (this.yesVotes + this.noVotes)) * 100;
            this.noPercent =
                (this.noVotes / (this.yesVotes + this.noVotes)) * 100;
        } else {
            this.noPercent = 100;
        }

        const proposalIsAccepted =
            this.proposalStatus == ProposalStatus.Active ||
            this.proposalStatus == ProposalStatus.Completed ||
            this.proposalStatus == ProposalStatus.Paid;

        const votesUntilQuorum = quorumCount - this.totalVotes;
        this.votesUntilQuorumText =
            votesUntilQuorum > 0 && !proposalIsAccepted
                ? votesUntilQuorum == 1
                    ? `${votesUntilQuorum} vote until quorum`
                    : `${votesUntilQuorum} votes until quorum`
                : 'Quorum reached';

        if (votesUntilQuorum > 0 && this.proposalStatus == ProposalStatus.Closed) {
            this.votesUntilQuorumText = 'Quorum not reached';
        }

        this.quorumPercent =
            this.totalVotes / quorumCount > 1 || proposalIsAccepted
                ? 100
                : (this.totalVotes / quorumCount) * 100;
    }
}
