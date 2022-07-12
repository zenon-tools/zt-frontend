import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Observable, take } from 'rxjs';
import {
    RewardShareChange,
    RewardShareChanges,
} from 'src/app/services/zenon-tools-api/interfaces/rewardShareChange';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';

export interface RewardShareRow {
    momentumRewardShare: number;
    delegateRewardShare: number;
    timestamp: number;
    momentumRewardShareIconHex: string;
    delegateRewardShareIconHex: string;
}

@Component({
    selector: 'app-pillar-reward-share-table',
    templateUrl: './pillar-reward-share-table.component.html',
    styleUrls: ['./pillar-reward-share-table.component.scss'],
})
export class PillarRewardShareTableComponent implements OnInit {
    @Input() pillarName!: string;
    @Input() currentMomentumRewardShare!: number;
    @Input() currentDelegateRewardShare!: number;

    rewardShareChanges$!: Observable<RewardShareChanges>;
    rewardShareChanges!: RewardShareChanges;

    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;

    hasRewardShareChanges: boolean = false;
    hasResults: boolean = false;
    isLoading: boolean = true;

    activePage: number = 1;

    dataSource = new MatTableDataSource<RewardShareRow>();
    momentumRewardShareChartData: number[] = [];
    delegateRewardShareChartData: number[] = [];
    rewardShareDates: number[] = [];

    displayedColumns: string[] = [
        'momentumRewardShare',
        'delegateRewardShare',
        'timestamp',
    ];

    constructor(private zenonToolsApiService: ZenonToolsApiService) {}

    ngOnInit(): void {
        this.rewardShareChanges$ =
            this.zenonToolsApiService.getRewardShareChanges(this.pillarName);
        this.rewardShareChanges$
            .pipe(take(1))
            .subscribe((rewardShareChanges: RewardShareChanges) => {
                this.isLoading = false;
                this.hasRewardShareChanges = rewardShareChanges.length > 0;
                this.rewardShareChanges = rewardShareChanges;
                this.updateDataSource();
            });
    }

    onNextSelected() {
        this.activePage++;
        this.updateDataSource();
    }

    onPreviousSelected() {
        if (this.activePage > 1) {
            this.activePage--;
            this.updateDataSource();
        }
    }

    private updateDataSource() {
        const startIndex = (this.activePage - 1) * 5;
        const changesToShow = this.rewardShareChanges.slice(
            startIndex,
            startIndex + 5
        );
        this.hasResults = changesToShow.length > 0;
        this.dataSource.data = changesToShow.map(
            (change: RewardShareChange, index: number): RewardShareRow => ({
                momentumRewardShare: change.giveBlockRewardPercentage,
                delegateRewardShare: change.giveDelegateRewardPercentage,
                timestamp: change.momentumTimestamp,
                momentumRewardShareIconHex: this.getMomentumRewardShareIconHex(
                    change,
                    startIndex + index,
                    this.rewardShareChanges
                ),
                delegateRewardShareIconHex: this.getDelegateRewardShareIconHex(
                    change,
                    startIndex + index,
                    this.rewardShareChanges
                ),
            })
        );

        this.momentumRewardShareChartData = this.rewardShareChanges
            .map((item) => item.giveBlockRewardPercentage)
            .reverse();
        this.delegateRewardShareChartData = this.rewardShareChanges
            .map((item) => item.giveDelegateRewardPercentage)
            .reverse();
        this.rewardShareDates = this.rewardShareChanges
            .map((item) => item.momentumTimestamp)
            .reverse();
    }

    private getMomentumRewardShareIconHex(
        currentItem: RewardShareChange,
        index: number,
        items: RewardShareChanges
    ) {
        if (index < items.length - 1) {
            if (
                currentItem.giveBlockRewardPercentage >
                items[index + 1].giveBlockRewardPercentage
            ) {
                return '2197';
            } else if (
                currentItem.giveBlockRewardPercentage <
                items[index + 1].giveBlockRewardPercentage
            ) {
                return '2198';
            }
        }
        return '2194';
    }

    private getDelegateRewardShareIconHex(
        currentItem: RewardShareChange,
        index: number,
        items: RewardShareChanges
    ) {
        if (index < items.length - 1) {
            if (
                currentItem.giveDelegateRewardPercentage >
                items[index + 1].giveDelegateRewardPercentage
            ) {
                return '2197';
            } else if (
                currentItem.giveDelegateRewardPercentage <
                items[index + 1].giveDelegateRewardPercentage
            ) {
                return '2198';
            }
        }
        return '2194';
    }
}
