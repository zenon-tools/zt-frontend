import { Injectable } from '@angular/core';
import { interval, map, shareReplay } from 'rxjs';
import { Prices } from 'src/app/components/calculator-widget/calculator-widget.component';
import { DelegationInputs } from 'src/app/components/calculator-widget/delegation-inputs/delegation-inputs.component';
import { LiquidityInputs } from 'src/app/components/calculator-widget/liquidity-inputs/liquidity-inputs.component';
import { PillarInputs } from 'src/app/components/calculator-widget/pillar-inputs/pillar-inputs.component';
import { SentinelInputs } from 'src/app/components/calculator-widget/sentinel-inputs/sentinel-inputs.component';
import { StakeInputs } from 'src/app/components/calculator-widget/stake-inputs/stake-inputs.component';
import { NomData } from '../zenon-tools-api/interfaces/nom-data';
import { LiquidityPoolData } from '../zenon-tools-api/interfaces/liquidity-pool-data';
import { Pillars } from '../zenon-tools-api/interfaces/pillar';

export interface Rewards {
    znnRewards: number;
    qsrRewards: number;
    tradingFeeRewards: number;
    rewardsInUsd: number;
    roi: number;
    holdingsInUsd: number;
    hasZnnRewards: boolean;
    hasQsrRewards: boolean;
    hasTradingFeeRewards: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class RewardCalculatorService {
    // Constants
    private readonly QSR_REWARD_SHARE_FOR_STAKERS = 0.5;
    private readonly QSR_REWARD_SHARE_FOR_SENTINELS = 0.25;
    private readonly ZNN_REWARD_SHARE_FOR_SENTINELS = 0.13;
    private readonly QSR_REWARD_SHARE_FOR_LPS = 0.25;
    private readonly ZNN_REWARD_SHARE_FOR_LPS = 0.13;
    private readonly ZNN_REWARD_SHARE_FOR_PILLAR_DELEGATES = 0.24;
    private readonly ZNN_REWARD_SHARE_FOR_PILLAR_MOMENTUMS = 0.5;

    private readonly TOTAL_MOMENTUMS_PER_DAY = 8640;
    private readonly DAYS_PER_MONTH = 30;
    private readonly DAYS_PER_YEAR = 360;

    private readonly SENTINEL_ZNN_COLLATERAL = 5000;
    private readonly PILLAR_ZNN_COLLATERAL = 15000;
    private readonly SENTINEL_QSR_COLLATERAL = 50000;

    private readonly DECIMALS = 100000000;

    private readonly DAILY_ZNN_REWARDS_BY_MONTH = [
        14400, 8640, 7200, 10080, 7200, 5760, 10080, 5760, 4320, 10080, 4320,
        4320,
    ];
    private readonly DAILY_QSR_REWARDS_BY_MONTH = [
        20000, 20000, 20000, 20000, 15000, 15000, 15000, 5000, 5000, 5000, 5000,
        5000,
    ];

    constructor() {}

    computeStakingRewards(
        nomData: NomData,
        usdPrices: Prices,
        inputs: StakeInputs
    ): Rewards {
        const roi = this.computeStakingRoi(
            nomData,
            usdPrices,
            inputs.amount,
            inputs.lockUpMonths,
            inputs.timePeriodInDays
        );
        const amountInUsd = inputs.amount * usdPrices.znn;
        const rewardsInUsd = amountInUsd * roi;
        const qsrRewards = usdPrices.qsr > 0 ? rewardsInUsd / usdPrices.qsr : 0;
        return {
            znnRewards: 0,
            qsrRewards: qsrRewards,
            tradingFeeRewards: 0,
            rewardsInUsd: rewardsInUsd,
            roi: roi * 100,
            holdingsInUsd: inputs.amount * usdPrices.znn,
            hasZnnRewards: false,
            hasQsrRewards: true,
            hasTradingFeeRewards: false,
        };
    }

    computeDelegationRewards(
        nomData: NomData,
        usdPrices: Prices,
        pillars: Pillars,
        inputs: DelegationInputs
    ): Rewards {
        const roi = this.computeDelegationRoi(
            nomData,
            pillars,
            inputs.amount,
            inputs.pillar,
            inputs.addToPillarWeight,
            inputs.timePeriodInDays
        );
        const znnRewards = inputs.amount * roi;
        return {
            znnRewards: znnRewards,
            qsrRewards: 0,
            tradingFeeRewards: 0,
            rewardsInUsd: znnRewards * usdPrices.znn,
            roi: roi * 100,
            holdingsInUsd: inputs.amount * usdPrices.znn,
            hasZnnRewards: true,
            hasQsrRewards: false,
            hasTradingFeeRewards: false,
        };
    }

    computeLiquidityRewards(
        nomData: NomData,
        usdPrices: Prices,
        poolData: LiquidityPoolData,
        inputs: LiquidityInputs
    ): Rewards {
        const holdingsInUsd =
            inputs.amount * usdPrices.znn +
            inputs.pairedTokenAmount * poolData.pairedTokenPriceUsd;
        const weightedRewardShare =
            (inputs.lpTokenAmount * inputs.lockUpMonths) /
            nomData.znnEthLpInfo.totalStaked.weightedAmount;
        const poolRewardShare =
            inputs.lpTokenAmount / poolData.lpTokenTotalSupply;

        const znnRewards =
            ((weightedRewardShare * nomData.yearlyZnnRewardPoolForLps) /
                this.DAYS_PER_YEAR) *
            inputs.timePeriodInDays;
        const qsrRewards =
            ((weightedRewardShare * nomData.yearlyQsrRewardPoolForLps) /
                this.DAYS_PER_YEAR) *
            inputs.timePeriodInDays;
        const tradingFeeRewards =
            (poolData.yearlyTradingFeesUsd / this.DAYS_PER_YEAR) *
            inputs.timePeriodInDays *
            poolRewardShare;
        const rewardsInUsd =
            znnRewards * usdPrices.znn +
            qsrRewards * usdPrices.qsr +
            tradingFeeRewards;

        const roi = holdingsInUsd > 0 ? rewardsInUsd / holdingsInUsd : 0;

        return {
            znnRewards: znnRewards,
            qsrRewards: qsrRewards,
            tradingFeeRewards: tradingFeeRewards,
            rewardsInUsd: rewardsInUsd,
            roi: roi * 100,
            holdingsInUsd: holdingsInUsd,
            hasZnnRewards: true,
            hasQsrRewards: true,
            hasTradingFeeRewards: true,
        };
    }

    computeSentinelRewards(
        nomData: NomData,
        usdPrices: Prices,
        inputs: SentinelInputs
    ): Rewards {
        const sentinelValueUsd = this.computeValueInUsd(
            usdPrices,
            this.SENTINEL_ZNN_COLLATERAL,
            this.SENTINEL_QSR_COLLATERAL
        );
        const roi = this.computeSentinelRoi(
            nomData,
            usdPrices,
            inputs.timePeriodInDays,
            sentinelValueUsd
        );

        const znnRewardPool =
            this.computeRewardPoolForTimePeriod(
                this.DAILY_ZNN_REWARDS_BY_MONTH,
                inputs.timePeriodInDays
            ) * this.ZNN_REWARD_SHARE_FOR_SENTINELS;
        const qsrRewardPool =
            this.computeRewardPoolForTimePeriod(
                this.DAILY_QSR_REWARDS_BY_MONTH,
                inputs.timePeriodInDays
            ) * this.QSR_REWARD_SHARE_FOR_SENTINELS;

        const znnRewards =
            (znnRewardPool / nomData.sentinelCount) * inputs.amount;
        const qsrRewards =
            (qsrRewardPool / nomData.sentinelCount) * inputs.amount;

        return {
            znnRewards: znnRewards,
            qsrRewards: qsrRewards,
            tradingFeeRewards: 0,
            rewardsInUsd:
                znnRewards * usdPrices.znn + qsrRewards * usdPrices.qsr,
            roi: roi * 100,
            holdingsInUsd: sentinelValueUsd * inputs.amount,
            hasZnnRewards: true,
            hasQsrRewards: true,
            hasTradingFeeRewards: false,
        };
    }

    computePillarRewards(
        usdPrices: Prices,
        pillars: Pillars,
        inputs: PillarInputs
    ): Rewards {
        const pillarValueUsd = this.computeValueInUsd(
            usdPrices,
            this.PILLAR_ZNN_COLLATERAL,
            inputs.slotCost
        );
        const roi = this.computePillarRoi(
            usdPrices,
            pillars,
            inputs.timePeriodInDays,
            inputs.isTop30,
            pillarValueUsd
        );

        const pillarValueInZnn =
            usdPrices.znn > 0 ? pillarValueUsd / usdPrices.znn : 0;
        const znnRewards = inputs.amount * pillarValueInZnn * roi;

        return {
            znnRewards: znnRewards,
            qsrRewards: 0,
            tradingFeeRewards: 0,
            rewardsInUsd: znnRewards * usdPrices.znn,
            roi: roi * 100,
            holdingsInUsd: pillarValueUsd * inputs.amount,
            hasZnnRewards: true,
            hasQsrRewards: false,
            hasTradingFeeRewards: false,
        };
    }

    public daysLeftInPhaseZero$ = interval(60000).pipe(
        map(() => this.computeDaysLeftInPhaseZero()),
        shareReplay(1)
    );

    computeDaysLeftInPhaseZero(): number {
        const phaseZeroEnd = Date.UTC(2022, 10, 19, 12);
        const now = new Date();
        const nowUtc = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );
        const hours = (phaseZeroEnd - nowUtc) / 1000 / 60 / 60;
        return Math.floor(hours / 24);
    }

    private computeStakingRoi(
        nomData: NomData,
        usdPrices: Prices,
        stakedAmount: number,
        lockupMonths: number,
        timePeriodInDays: number
    ): number {
        if (stakedAmount <= 0 || usdPrices.znn <= 0 || usdPrices.qsr <= 0) {
            return 0;
        }

        const rewardPoolInUsd =
            this.computeRewardPoolForTimePeriod(
                this.DAILY_QSR_REWARDS_BY_MONTH,
                timePeriodInDays
            ) *
            this.QSR_REWARD_SHARE_FOR_STAKERS *
            usdPrices.qsr;

        const weightedStake = ((9 + lockupMonths) * stakedAmount) / 10;
        const rewardShareInUsd =
            rewardPoolInUsd *
            (weightedStake / nomData.totalStakedZnn.weightedAmount);

        return rewardShareInUsd / (stakedAmount * usdPrices.znn);
    }

    private computeDelegationRoi(
        nomData: NomData,
        pillars: Pillars,
        delegationAmount: number,
        pillarOwnerAddress: string,
        addToPillarWeight: boolean,
        timePeriodInDays: number
    ) {
        if (delegationAmount == 0) {
            return 0;
        }
        const delegate = pillars.get(pillarOwnerAddress);
        const totalDelegated =
            Array.from(pillars.values()).reduce((sum, p) => sum + p.weight, 0) /
                this.DECIMALS +
            (addToPillarWeight ? delegationAmount : 0);

        const totalZnnRewardPool = this.computeRewardPoolForTimePeriod(
            this.DAILY_ZNN_REWARDS_BY_MONTH,
            timePeriodInDays
        );
        const delegateRewardPool =
            totalZnnRewardPool * this.ZNN_REWARD_SHARE_FOR_PILLAR_DELEGATES;
        const momentumRewardPool =
            totalZnnRewardPool * this.ZNN_REWARD_SHARE_FOR_PILLAR_MOMENTUMS;

        const expectedMomentumRatio =
            this.computeExpectedMomentumsRatioForPillars(pillars.size);
        const expectedMomentumShare =
            delegate?.rank! < 30
                ? expectedMomentumRatio
                : 1 - expectedMomentumRatio;
        const momentumRewardPoolForGroup =
            momentumRewardPool * expectedMomentumShare;

        const newDelegateWeight = addToPillarWeight
            ? delegate?.weight! / this.DECIMALS + delegationAmount
            : delegate?.weight! / this.DECIMALS;

        const delegateRewardShare = newDelegateWeight / totalDelegated;
        const delegateRewardPoolForDelegators =
            delegateRewardPool *
            delegateRewardShare *
            (delegate?.giveDelegateRewardPercentage! / 100);
        const delegationRewards =
            newDelegateWeight > 0
                ? delegateRewardPoolForDelegators *
                  (delegationAmount / newDelegateWeight)
                : 0;

        const momentumRewardPoolForDelegators =
            (momentumRewardPoolForGroup /
                (delegate?.rank! < 30 ? 30 : pillars.size - 30)) *
            (delegate?.giveMomentumRewardPercentage! / 100);
        const momentumRewards =
            newDelegateWeight > 0
                ? momentumRewardPoolForDelegators *
                  (delegationAmount / newDelegateWeight)
                : 0;

        return (delegationRewards + momentumRewards) / delegationAmount;
    }

    private computeSentinelRoi(
        nomData: NomData,
        usdPrices: Prices,
        timePeriodInDays: number,
        sentinelValueUsd: number
    ): number {
        if (usdPrices.znn <= 0 || usdPrices.qsr <= 0) {
            return 0;
        }

        const usdRewardPool =
            this.computeRewardPoolForTimePeriod(
                this.DAILY_ZNN_REWARDS_BY_MONTH,
                timePeriodInDays
            ) *
                this.ZNN_REWARD_SHARE_FOR_SENTINELS *
                usdPrices.znn +
            this.computeRewardPoolForTimePeriod(
                this.DAILY_QSR_REWARDS_BY_MONTH,
                timePeriodInDays
            ) *
                this.QSR_REWARD_SHARE_FOR_SENTINELS *
                usdPrices.qsr;
        return usdRewardPool / nomData.sentinelCount / sentinelValueUsd;
    }

    private computePillarRoi(
        usdPrices: Prices,
        pillars: Pillars,
        timePeriodInDays: number,
        isTop30: boolean,
        pillarValueUsd: number
    ) {
        if (usdPrices.znn <= 0 || usdPrices.qsr <= 0) {
            return 0;
        }

        const expectedMomentumRatio =
            this.computeExpectedMomentumsRatioForPillars(pillars.size);
        const expectedMomentumShare = isTop30
            ? expectedMomentumRatio
            : 1 - expectedMomentumRatio;

        let totalMomentumRewardSharing = 0;
        let totalDelegateRewardSharing = 0;
        let totalDelegatedForGroup = 0;
        let totalDelegatedForAll = 0;

        for (const [k, v] of pillars.entries()) {
            if (isTop30 && v.rank < 30) {
                totalMomentumRewardSharing += v.giveMomentumRewardPercentage;
                totalDelegateRewardSharing += v.giveDelegateRewardPercentage;
                totalDelegatedForGroup += v.weight / this.DECIMALS;
            } else if (!isTop30 && v.rank >= 30) {
                totalMomentumRewardSharing += v.giveMomentumRewardPercentage;
                totalDelegateRewardSharing += v.giveDelegateRewardPercentage;
                totalDelegatedForGroup += v.weight / this.DECIMALS;
            }
            totalDelegatedForAll += v.weight / this.DECIMALS;
        }

        const totalZnnRewardPool = this.computeRewardPoolForTimePeriod(
            this.DAILY_ZNN_REWARDS_BY_MONTH,
            timePeriodInDays
        );

        const momentumRewardPoolForGroup =
            totalZnnRewardPool *
            this.ZNN_REWARD_SHARE_FOR_PILLAR_MOMENTUMS *
            expectedMomentumShare;

        const delegateRewardPoolForGroup =
            totalZnnRewardPool *
            this.ZNN_REWARD_SHARE_FOR_PILLAR_DELEGATES *
            (totalDelegatedForGroup / totalDelegatedForAll);

        const groupPillarCount = isTop30 ? 30 : pillars.size - 30;
        const avgMomentumRewardSharing =
            totalMomentumRewardSharing / groupPillarCount / 100;
        const avgDelegateRewardSharing =
            totalDelegateRewardSharing / groupPillarCount / 100;

        const momentumRewardsForPillar =
            (momentumRewardPoolForGroup / groupPillarCount) *
            (1 - avgMomentumRewardSharing);
        const delegateRewardsForPillar =
            (delegateRewardPoolForGroup / groupPillarCount) *
            (1 - avgDelegateRewardSharing);

        return (
            ((momentumRewardsForPillar + delegateRewardsForPillar) *
                usdPrices.znn) /
            pillarValueUsd
        );
    }

    private computeValueInUsd(
        usdPrices: Prices,
        znnAmount: number,
        qsrAmount: number
    ): number {
        return znnAmount * usdPrices.znn + qsrAmount * usdPrices.qsr;
    }

    // Calculates remaining reward pool for time period
    private computeRewardPoolForTimePeriod(
        rewardsByMonth: Array<number>,
        timePeriodInDays: number
    ): number {
        const currentEpoch = this.computeCurrentEpoch();

        let rewardsForTimePeriod = 0;

        for (let i = currentEpoch; i < currentEpoch + timePeriodInDays; i++) {
            const month = Math.floor(i / this.DAYS_PER_MONTH);
            if (month < rewardsByMonth.length) {
                rewardsForTimePeriod += rewardsByMonth[month];
            } else {
                rewardsForTimePeriod +=
                    rewardsByMonth[rewardsByMonth.length - 1];
            }
        }

        return rewardsForTimePeriod;
    }

    private computeCurrentEpoch(): number {
        const genesis = Date.UTC(2021, 10, 24, 12);
        const now = new Date();
        const nowUtc = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );
        const hours = (nowUtc - genesis) / 1000 / 60 / 60;
        return Math.floor(hours / 24);
    }

    // Get the ratio of how much of all momentums should be produced by top 30 Pillars.
    private computeExpectedMomentumsRatioForPillars(
        pillarCount: number
    ): number {
        // Group B size (includes half of the top 30 pillars and all non top 30 pillars)
        const groupBSize = pillarCount - 15;

        // Momentum allocations for group A (15 Pillars from top 30) and group B (all the remaining Pillars not in group A)
        const momentumsAllocatedForGroupA = this.TOTAL_MOMENTUMS_PER_DAY * 0.5;
        const momentumsAllocatedForGroupB = this.TOTAL_MOMENTUMS_PER_DAY * 0.5;

        const totalExpectedDailyMomentumsTop30 =
            momentumsAllocatedForGroupA +
            momentumsAllocatedForGroupB * (15 / groupBSize);
        //int totalExpectedDailyMomentumsNotTop30 = momentumsAllocatedForGroupB *  ((groupBSize - 15) / groupBSize);

        return totalExpectedDailyMomentumsTop30 / this.TOTAL_MOMENTUMS_PER_DAY;
    }
}
