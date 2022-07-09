import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, take } from 'rxjs';
import {
    ProposalVote,
    ProposalVotes,
} from 'src/app/services/zenon-tools-api/interfaces/proposal-vote';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { ProposalStatus } from '../project-status-chip/project-status-chip.component';
import {
    faChevronDown,
    faArrowUpRightFromSquare,
    faAngleRight,
    faCopy,
} from '@fortawesome/free-solid-svg-icons';
import { Phase } from 'src/app/services/zenon-tools-api/interfaces/phase';
import { Clipboard } from '@angular/cdk/clipboard';

interface VoteRow {
    pillarName: string;
    vote: string;
    voteIconHex: string;
    timestamp: number;
}

enum VoteType {
    'Yes' = 0,
    'No' = 1,
    'Abstain' = 2,
}

enum StatusCardState {
    Disabled,
    PendingPhase,
    PhaseVoting,
}

@Component({
    selector: 'app-proposal-info-card',
    templateUrl: './proposal-info-card.component.html',
    styleUrls: ['./proposal-info-card.component.scss'],
})
export class ProposalInfoCardComponent implements OnInit {
    @Input() status: ProposalStatus = ProposalStatus.Voting;
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() isPhase: boolean = false;
    @Input() znnFundsNeeded: number = 0;
    @Input() qsrFundsNeeded: number = 0;
    @Input() url: string = '';
    @Input() owner: string = '';
    @Input() projectId: string = '';
    @Input() phaseId: string = '';
    @Input() creationTimestamp: number = 0;
    @Input() lastUpdateTimestamp: number = 0;
    @Input() yesVotes: number = 0;
    @Input() noVotes: number = 0;
    @Input() totalVotes: number = 0;
    @Input() phases: Array<Phase> = [];
    @Output() showPhases = new EventEmitter<void>();

    faChevronDown = faChevronDown;
    faArrowUpRightFromSquare = faArrowUpRightFromSquare;
    faAngleRight = faAngleRight;
    faCopy = faCopy;

    votes$!: Observable<ProposalVotes>;

    dataSource = new MatTableDataSource<VoteRow>();

    displayedColumns: string[] = ['pillar', 'vote', 'timestamp'];

    coinDecimals: number = 100000000;
    votingStatusText: string = '';
    formattedUrl: string = '';
    showVotes: boolean = false;
    statusCardText: string = '';
    statusCardIconHex: string = '';
    statusCardGradientStart: string = '';
    statusCardGradientEnd: string = '';
    statusCardState: StatusCardState = StatusCardState.Disabled;
    znnFundsReceived: number = 0;
    qsrFundsReceived: number = 0;

    showVotingDot: boolean = true;

    constructor(
        private zenonToolsApiService: ZenonToolsApiService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.updateVotingStatusText();
        this.formatUrl();

        if (!this.isPhase) {
            this.updateStatusCard();
        }

        if (this.isPhase) {
            this.votes$ = this.zenonToolsApiService.getPhaseVotes(this.phaseId);
        } else {
            this.votes$ = this.zenonToolsApiService.getProjectVotes(
                this.projectId
            );
        }
        this.votes$.pipe(take(1)).subscribe((votes: ProposalVotes) => {
            this.dataSource.data = votes.map(
                (vote: ProposalVote): VoteRow => ({
                    pillarName: vote.pillarName ?? '',
                    vote: VoteType[vote.vote],
                    voteIconHex: this.getVoteIconHex(vote.vote),
                    timestamp: vote.momentumTimestamp,
                })
            );
        });

        // NOTE: Hide blinking voting dot on Safari due to issue with shadow flickering
        if (
            navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') <= -1
        ) {
            this.showVotingDot = false;
        }
    }

    onToggleVotesPressed() {
        this.showVotes = !this.showVotes;
    }

    onStatusCardPressed(state: StatusCardState) {
        if (state == StatusCardState.PhaseVoting) {
            this.showPhases.emit();
        }
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }

    private updateVotingStatusText() {
        switch (this.status) {
            case ProposalStatus.Voting:
                if (!this.isPhase) {
                    const twoWeeksMs = 3600 * 24 * 14 * 1000;
                    const timeDeltaMs =
                        this.creationTimestamp * 1000 + twoWeeksMs - Date.now();
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

    private updateStatusCard() {
        if (this.phases.length > 0) {
            const votingOpenPhase = this.phases.find(
                (phase) => phase.status === ProposalStatus.Voting
            );
            if (votingOpenPhase !== undefined) {
                this.statusCardState = StatusCardState.PhaseVoting;
                this.statusCardText = 'Phase voting open';
                this.statusCardIconHex = '1F5F3';
                this.statusCardGradientStart = '#4e3577';
                this.statusCardGradientEnd = '#6d48bf';
            }
            this.znnFundsReceived = this.phases.reduce((acc, phase) => {
                return acc + phase.status === ProposalStatus.Paid
                    ? phase.znnFundsNeeded
                    : 0;
            }, 0);
            this.qsrFundsReceived = this.phases.reduce((acc, phase) => {
                return acc + phase.status === ProposalStatus.Paid
                    ? phase.qsrFundsNeeded
                    : 0;
            }, 0);
        } else if (this.status === ProposalStatus.Active) {
            this.statusCardState = StatusCardState.PendingPhase;
            this.statusCardText = 'Waiting for a Phase to be submitted';
            this.statusCardIconHex = '23F3';
            this.statusCardGradientStart = '#3B4748';
            this.statusCardGradientEnd = '#535F60';
        }
    }

    private formatUrl() {
        this.formattedUrl = this.url.startsWith('http')
            ? this.url
            : 'https://' + this.url;
    }

    private convertToDaysAndHours(milliseconds: number) {
        const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
        const daysMs = milliseconds % (24 * 60 * 60 * 1000);
        const hours = Math.floor(daysMs / (60 * 60 * 1000));
        return days + 'd ' + hours + 'h';
    }

    private getVoteIconHex(vote: number) {
        return vote == 0 ? '2705' : vote == 1 ? '274C' : '2B55';
    }
}
