import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Donation } from 'src/app/services/zenon-tools-api/interfaces/donation';

export interface ContributionRow {
    address: string;
    pillarName: string;
    amount: number;
    tokenSymbol: string;
    timestamp: number;
    icon: string;
}

@Component({
    selector: 'app-contributor-table',
    templateUrl: './contributor-table.component.html',
    styleUrls: ['./contributor-table.component.scss'],
})
export class ContributorTableComponent implements OnChanges {
    @Input() contributions: Array<Donation> = [];

    dataSource = new MatTableDataSource<ContributionRow>();

    displayedColumns: string[] = ['contributor', 'timestamp'];

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['contributions'] &&
            changes['contributions'].currentValue != null &&
            changes['contributions'].currentValue.length > 0
        ) {
            this.dataSource.data = changes['contributions'].currentValue.map(
                (donation: Donation): ContributionRow => ({
                    address: donation.address,
                    pillarName: donation.pillar,
                    amount: donation.amount / Math.pow(10, donation.decimals),
                    tokenSymbol: donation.symbol,
                    timestamp: donation.momentumTimestamp,
                    icon: this.getIcon(
                        donation.amount / Math.pow(10, donation.decimals)
                    ),
                })
            );
        }
    }

    getIcon(donation: number) {
        switch (donation) {
            case 100:
                return '../../../assets/images/alien_commander.png';
            case 50:
                return '../../../assets/images/spaceship_engineer.png';
            case 10:
                return '../../../assets/images/repair_robot.png';
            default:
                return '../../../assets/images/rocket_fuel.png';
        }
    }
}
