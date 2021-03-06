import { Component, Input, OnInit } from '@angular/core';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { ProposalListItem } from 'src/app/services/zenon-tools-api/interfaces/proposal-list-item';

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
    statusText: string = '';
    statusChipGradientStart: string = '';
    statusChipGradientEnd: string = '';
    votingStatusText: string = '';
    formattedUrl: string = '';
    isNew: boolean = false;

    constructor() {}

    ngOnInit(): void {
        this.updateTitle();
        this.updateVotingStatusText();
        this.formatUrl();
        this.updateIsNew();
    }

    onLinkPressed(event: Event) {
        event.stopPropagation();
    }

    private updateTitle() {
        this.title = this.proposal.projectName;
        if (this.isPhase()) {
            this.title = this.title + ': ' + this.proposal.phaseName;
        }
    }

    private updateVotingStatusText() {
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

    private updateIsNew() {
        const nowSeconds = Date.now() / 1000;
        const dayInSeconds = 24 * 60 * 60;
        const daysAsNew = 3;
        this.isNew =
            this.proposal.creationTimestamp >
            nowSeconds - daysAsNew * dayInSeconds;
    }

    private formatUrl() {
        this.formattedUrl = this.proposal.url.startsWith('http')
            ? this.proposal.url
            : 'https://' + this.proposal.url;
    }

    private convertToDaysAndHours(milliseconds: number) {
        const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
        const daysMs = milliseconds % (24 * 60 * 60 * 1000);
        const hours = Math.floor(daysMs / (60 * 60 * 1000));
        return days + 'd ' + hours + 'h';
    }

    private isPhase() {
        return this.proposal.phaseName.length > 0;
    }
}
