import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { ParticipationDetails } from 'src/app/services/zenon-tools-api/interfaces/account/participation-details';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { map, take, combineLatest } from 'rxjs';
import {
    faDollarSign,
    faClone,
    faXmark,
    faChevronDown,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { RewardCalculatorService } from 'src/app/services/reward-calculator/reward-calculator.service';
import { NomData } from 'src/app/services/zenon-tools-api/interfaces/nom-data';
import { CurrentPrice } from 'src/app/services/market-api/coin-gecko-types';
import { MarketApiService } from 'src/app/services/market-api/market-api.service';
import { Pillars } from 'src/app/services/zenon-tools-api/interfaces/pillar';

interface StakeItem {
    amount: number;
    startTimestamp: number;
    lockUpDuration: string;
    apr: string;
}

interface DelegationItem {
    delegate: string;
    amount: number;
    startTimestamp: number;
    apr: string;
}

interface SentinelItem {
    startTimestamp: number;
    isRevocable: string;
    apr: string;
}

interface PillarItem {
    name: string;
    startTimestamp: number;
    slotCost: number;
    isRevocable: string;
    revokeCooldown: string;
}

@Component({
    selector: 'app-participation-card',
    templateUrl: './participation-card.component.html',
    styleUrls: ['./participation-card.component.scss'],
})
export class ParticipationCardComponent implements OnChanges {
    @Input() participationDetails?: ParticipationDetails;

    faChevronDown = faChevronDown;

    coinDecimals: number = 100000000;

    currencyToUse: keyof CurrentPrice = 'usd';

    currentZnnPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse])
    );

    currentQsrPrice$ = this.marketApiService.currentZnnPrice$.pipe(
        map((i) => i[this.currencyToUse] / 10)
    );

    currentZnnPrice: number = 0;
    currentQsrPrice: number = 0;

    znnAmount: number = 0;
    qsrAmount: number = 0;
    usdValue: number = 0;

    showDetails: boolean = false;

    nomData!: NomData;
    pillars!: Pillars;

    stakeItems: Array<StakeItem> = [];
    delegationItem?: DelegationItem;
    sentinelItem?: SentinelItem;
    pillarItem?: PillarItem;

    isLoading: boolean = false;

    constructor(
        private calculatorService: RewardCalculatorService,
        private marketApiService: MarketApiService,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['participationDetails'] &&
            changes['participationDetails'].currentValue != null
        ) {
            this.stakeItems = [];
            this.delegationItem = undefined;
            this.sentinelItem = undefined;
            this.pillarItem = undefined;
            combineLatest([
                this.zenonToolsApiService.nomData$,
                this.zenonToolsApiService.pillars$,
                this.currentZnnPrice$,
                this.currentQsrPrice$,
            ])
                .pipe(take(1))
                .subscribe(([nomData, pillars, znnPrice, qsrPrice]) => {
                    this.nomData = nomData;
                    this.pillars = pillars;
                    this.currentZnnPrice = znnPrice;
                    this.currentQsrPrice = qsrPrice;
                    this.isLoading = false;

                    if (this.participationDetails) {
                        if (this.participationDetails.stakes.length > 0) {
                            this.znnAmount +=
                                this.participationDetails.stakes.reduce(
                                    (acc, stake) => {
                                        return acc + stake.stakedAmount;
                                    },
                                    0
                                );

                            for (const stake of this.participationDetails
                                .stakes) {
                                const lockUpMonths =
                                    this.convertSecondsToMonths(
                                        stake.lockUpDurationInSec
                                    );
                                this.stakeItems.push({
                                    amount:
                                        stake.stakedAmount / this.coinDecimals,
                                    startTimestamp: stake.startTimestamp * 1000,
                                    lockUpDuration:
                                        lockUpMonths === 1
                                            ? `${lockUpMonths} month`
                                            : `${lockUpMonths} months`,
                                    apr: this.getStakeApr(
                                        stake.stakedAmount,
                                        lockUpMonths
                                    ),
                                });
                            }
                        }

                        if (
                            Object.keys(this.participationDetails.delegation)
                                .length > 0
                        ) {
                            this.znnAmount +=
                                this.participationDetails.delegation.delegatedBalance;
                            this.delegationItem = {
                                delegate:
                                    this.participationDetails.delegation
                                        .delegate,
                                amount:
                                    this.participationDetails.delegation
                                        .delegatedBalance / this.coinDecimals,
                                startTimestamp:
                                    this.participationDetails.delegation
                                        .delegationStartTimestamp * 1000,
                                apr: this.getDelegationApr(
                                    this.participationDetails.delegation
                                        .delegatedBalance,
                                    this.participationDetails.delegation
                                        .delegate
                                ),
                            };
                        }

                        if (
                            Object.keys(this.participationDetails.sentinel)
                                .length > 0
                        ) {
                            this.znnAmount += 5000 * this.coinDecimals;
                            this.qsrAmount += 50000 * this.coinDecimals;
                            this.sentinelItem = {
                                startTimestamp:
                                    this.participationDetails.sentinel
                                        .registrationTimestamp * 1000,
                                isRevocable: this.participationDetails.sentinel
                                    .isRevocable
                                    ? 'Yes'
                                    : 'No',
                                apr: this.getSentinelApr(),
                            };
                        }

                        if (
                            Object.keys(this.participationDetails.pillar)
                                .length > 0
                        ) {
                            this.znnAmount += 15000 * this.coinDecimals;
                            this.pillarItem = {
                                name: this.participationDetails.pillar.name,
                                startTimestamp:
                                    this.participationDetails.pillar
                                        .spawnTimestamp === 0
                                        ? 1635076800000
                                        : this.participationDetails.pillar
                                              .spawnTimestamp * 1000,
                                slotCost:
                                    this.participationDetails.pillar
                                        .slotCostQsr === 0
                                        ? 150000
                                        : this.participationDetails.pillar
                                              .slotCostQsr / this.coinDecimals,
                                isRevocable: this.participationDetails.pillar
                                    .isRevocable
                                    ? 'Yes'
                                    : 'No',
                                revokeCooldown: this.convertToDaysAndHours(
                                    this.participationDetails.pillar
                                        .revokeCooldown * 1000
                                ),
                            };
                        }
                    }

                    this.znnAmount = this.znnAmount / this.coinDecimals;
                    this.qsrAmount = this.qsrAmount / this.coinDecimals;
                    this.usdValue =
                        this.znnAmount * this.currentZnnPrice +
                        this.qsrAmount * this.currentQsrPrice;
                });
        }
    }

    onShowDetailsPressed() {
        this.showDetails = !this.showDetails;
    }

    convertToDaysAndHours(milliseconds: number) {
        const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
        const daysMs = milliseconds % (24 * 60 * 60 * 1000);
        const hours = Math.floor(daysMs / (60 * 60 * 1000));
        return days + 'd ' + hours + 'h';
    }

    convertSecondsToMonths(seconds: number) {
        return seconds / 30 / 24 / 60 / 60;
    }

    getStakeApr(amount: number, lockUpMonths: number) {
        const rewards = this.calculatorService.computeStakingRewards(
            this.nomData,
            { znn: this.currentZnnPrice, qsr: this.currentQsrPrice },
            {
                amount: amount,
                timePeriodInDays: 360,
                lockUpMonths: lockUpMonths,
            }
        );
        return rewards.roi.toFixed(2) + '% APR';
    }

    getDelegationApr(amount: number, pillar: string) {
        const pillarAddress =
            Array.from(this.pillars.keys()).find(
                (k) => this.pillars.get(k)?.name === pillar
            ) ?? '';
        const rewards = this.calculatorService.computeDelegationRewards(
            this.nomData,
            { znn: this.currentZnnPrice, qsr: this.currentQsrPrice },
            this.pillars,
            {
                amount: amount,
                timePeriodInDays: 360,
                addToPillarWeight: false,
                pillar: pillarAddress,
            }
        );
        return rewards.roi.toFixed(2) + '% APR';
    }

    getSentinelApr() {
        const rewards = this.calculatorService.computeSentinelRewards(
            this.nomData,
            { znn: this.currentZnnPrice, qsr: this.currentQsrPrice },
            { amount: 1, timePeriodInDays: 360 }
        );
        return rewards.roi.toFixed(2) + '% APR';
    }
}
