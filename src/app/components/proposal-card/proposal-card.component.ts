import { Component, Input, OnInit } from '@angular/core';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { map, take } from 'rxjs';
import { ProposalListItem } from 'src/app/services/zenon-tools-api/interfaces/proposal-list-item';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';

enum ProposalStatus {
    Voting,
    Active,
    Paid,
    Closed,
    Completed,
}

@Component({
    selector: 'app-proposal-card',
    templateUrl: './proposal-card.component.html',
    styleUrls: ['./proposal-card.component.scss'],
})
export class ProposalCardComponent implements OnInit {
    @Input() proposal!: ProposalListItem;

    faArrowUpRightFromSquare = faArrowUpRightFromSquare;

    coinDecimals: number = 100000000;

    title: string = '';
    yesPercent: number = 0;
    noPercent: number = 0;
    quorumPercent: number = 0;
    votesUntilQuorumText: string = '';
    statusText: string = '';
    statusChipGradientStart: string = '';
    statusChipGradientEnd: string = '';
    votingStatusText: string = '';

    quorumCount$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => Math.round(nom.pillarCount * 0.33))
    );

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnInit(): void {
        this.quorumCount$.pipe(take(1)).subscribe((quorumCount: number) => {
            this.updateTitle();
            this.updatePercentages(quorumCount);
            this.updateStatusChip();
            this.updateVotingStatusText();
        });
    }

    updateTitle() {
        this.title = this.proposal.projectName;
        if (this.isPhase()) {
            this.title = this.title + ': ' + this.proposal.phaseName;
        }
    }

    updatePercentages(quorumCount: number) {
        if (this.proposal.yesVotes + this.proposal.noVotes > 0) {
            this.yesPercent =
                (this.proposal.yesVotes /
                    (this.proposal.yesVotes + this.proposal.noVotes)) *
                100;
            this.noPercent =
                (this.proposal.noVotes /
                    (this.proposal.yesVotes + this.proposal.noVotes)) *
                100;
        } else {
            this.noPercent = 100;
        }

        const votesUntilQuorum = quorumCount - this.proposal.totalVotes;
        this.votesUntilQuorumText =
            votesUntilQuorum > 0
                ? votesUntilQuorum == 1
                    ? `${votesUntilQuorum} vote until quorum`
                    : `${votesUntilQuorum} votes until quorum`
                : 'Quorum reached';

        this.quorumPercent =
            this.proposal.totalVotes / quorumCount > 1
                ? 100
                : (this.proposal.totalVotes / quorumCount) * 100;
    }

    updateStatusChip() {
        switch (this.proposal.status) {
            case ProposalStatus.Voting:
                this.statusText = 'Voting open';
                this.statusChipGradientStart = '#6D48BF';
                this.statusChipGradientEnd = '#4E3577';
                break;
            case ProposalStatus.Active:
            case ProposalStatus.Paid:
            case ProposalStatus.Completed:
                this.statusText = 'Accepted';
                this.statusChipGradientStart = '#387E28';
                this.statusChipGradientEnd = '#28601B';
                break;
            case ProposalStatus.Closed:
                this.statusText = 'Not accepted';
                this.statusChipGradientStart = '#535F60';
                this.statusChipGradientEnd = '#3B4748';
                break;
        }
    }

    updateVotingStatusText() {
        switch (this.proposal.status) {
            case ProposalStatus.Voting:
                if (!this.isPhase()) {
                    const twoWeeksMs = 3600 * 24 * 14 * 1000;
                    const timeDeltaMs =
                        this.proposal.creationTimestamp * 1000 +
                        twoWeeksMs -
                        Date.now();
                    this.votingStatusText =
                        'Voting ends in ' +
                        this.convertToDaysAndHours(timeDeltaMs);
                } else {
                    this.votingStatusText = 'Voting open';
                }
                break;
            default:
                this.votingStatusText = 'Voting ended';
        }
    }

    convertToDaysAndHours(milliseconds: number) {
        const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
        const daysMs = milliseconds % (24 * 60 * 60 * 1000);
        const hours = Math.floor(daysMs / (60 * 60 * 1000));
        return days + 'd ' + hours + 'h ';
    }

    isPhase() {
        return this.proposal.phaseName.length > 0;
    }

    formatUrl(url: string) {
        return url.startsWith('http') ? url : 'https://' + url;
    }
}
