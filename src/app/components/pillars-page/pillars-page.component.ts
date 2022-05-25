import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest } from 'rxjs';
import { Pillar } from 'src/app/services/zenon-tools-api/interfaces/pillar';
import {
    Links,
    PillarsOffChainInfo,
} from 'src/app/services/zenon-tools-api/interfaces/pillar-off-chain-info';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { CalculatorModalComponent } from '../modals/calculator-modal/calculator-modal.component';
import { faCalculator, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export interface PillarRow {
    name: string;
    rank: number;
    giveMomentumRewardPercentage: number;
    giveDelegateRewardPercentage: number;
    producedMomentums: number;
    expectedMomentums: number;
    weight: number;
    epochMomentumRewards: number;
    epochDelegateRewards: number;
    apr: number;
    delegateApr: number;
    links: Links;
    avatar: string;
    isActive: boolean;
    address: string;
}

@Component({
    selector: 'app-pillars-page',
    templateUrl: './pillars-page.component.html',
    styleUrls: ['./pillars-page.component.scss'],
})
export class PillarsPageComponent implements OnInit {
    faCalculator = faCalculator;
    faCircleInfo = faCircleInfo;

    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    pillars$ = this.zenonToolsApiService.pillars$;
    pillarsOffChainInfo$ = this.zenonToolsApiService.pillarsOffChainInfo$;
    intervalSecondsUntilRefresh$ =
        this.zenonToolsApiService.intervalSecondsUntilRefresh$;

    dataSource = new MatTableDataSource<PillarRow>();

    pillarsOffChainInfo!: PillarsOffChainInfo;

    constructor(
        public dialog: MatDialog,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    // NOTE: The column name must match the property name exactly for sorting to work properly for the column.
    displayedColumns: string[] = [
        'rank',
        'name',
        'weight',
        'momentums',
        'rewardSharing',
        //'apr',
        'delegateApr',
        'social',
    ];

    ngOnInit(): void {
        this.dataSource.sort = this.sort;
        combineLatest([this.pillars$, this.pillarsOffChainInfo$]).subscribe(
            ([pillars, offChainInfo]) => {
                this.dataSource.data = Array.from(pillars.entries()).map(
                    ([key, pillar]: [string, Pillar]): PillarRow => {
                        const links: Links = offChainInfo.get(key)?.links || {
                            telegram: '',
                            twitter: '',
                            website: '',
                            github: '',
                            medium: '',
                        };
                        return {
                            ...pillar,
                            links,
                            avatar: offChainInfo.get(key)?.avatar || '',
                            isActive:
                                pillar.producedMomentums === 0 &&
                                pillar.expectedMomentums >= 3
                                    ? false
                                    : true,
                            address: key,
                        };
                    }
                );
            }
        );
    }

    onCalculatorPressed(pillarName: string) {
        this.dialog.open(CalculatorModalComponent, {
            data: pillarName,
        });
    }
}
