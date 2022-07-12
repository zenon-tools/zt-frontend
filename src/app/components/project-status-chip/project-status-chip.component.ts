import { Component, Input, OnInit } from '@angular/core';

export enum ProposalStatus {
    Voting,
    Active,
    Paid,
    Closed,
    Completed,
}

@Component({
    selector: 'app-project-status-chip',
    templateUrl: './project-status-chip.component.html',
    styleUrls: ['./project-status-chip.component.scss'],
})
export class ProjectStatusChipComponent implements OnInit {
    @Input() status: ProposalStatus = ProposalStatus.Voting;
    @Input() isNew: boolean = false;
    @Input() isPhase: boolean = false;

    statusText: string = '';
    gradientStart: string = '';
    gradientEnd: string = '';

    constructor() {}

    ngOnInit(): void {
        if (this.isNew) {
            this.statusText = 'New';
            this.gradientStart = '#387E28';
            this.gradientEnd = '#28601B';
        } else if (this.isPhase) {
            this.statusText = 'Phase';
            this.gradientStart = '#535F60';
            this.gradientEnd = '#3B4748';
        } else {
            switch (this.status) {
                case ProposalStatus.Voting:
                    this.statusText = 'Voting open';
                    this.gradientStart = '#6D48BF';
                    this.gradientEnd = '#4E3577';
                    break;
                case ProposalStatus.Active:
                    this.statusText = 'Accepted';
                    this.gradientStart = '#387E28';
                    this.gradientEnd = '#28601B';
                    break;
                case ProposalStatus.Paid:
                    this.statusText = 'Funded';
                    this.gradientStart = '#387E28';
                    this.gradientEnd = '#28601B';
                    break;
                case ProposalStatus.Completed:
                    this.statusText = 'Completed';
                    this.gradientStart = '#387E28';
                    this.gradientEnd = '#28601B';
                    break;
                case ProposalStatus.Closed:
                    this.statusText = 'Not accepted';
                    this.gradientStart = '#535F60';
                    this.gradientEnd = '#3B4748';
                    break;
            }
        }
    }
}
