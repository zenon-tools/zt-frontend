export interface TotalStakedZnn {
    weightedAmount: number;
    amount: number;
}

export interface NomData {
    momentumHeight: number;
    timestamp: number;
    nodeVersion: string;
    znnPriceUsd: number;
    qsrPriceUsd: number;
    totalStakedZnn: TotalStakedZnn;
    avgStakingLockupTimeInDays: number;
    totalDelegatedZnn: number;
    sentinelCount: number;
    pillarCount: number;
    znnSupply: number;
    qsrSupply: number;
    stakingApr: number;
    delegateApr: number;
    lpApr: number;
    sentinelApr: number;
    pillarAprTop30: number;
    pillarAprNotTop30: number;
    yearlyZnnRewardPoolForLps: number;
    yearlyZnnRewardPoolForSentinels: number;
    yearlyQsrRewardPoolForStakers: number;
    yearlyQsrRewardPoolForLps: number;
    yearlyQsrRewardPoolForSentinels: number;
    yearlyQsrRewardPoolForLpProgram: number;
    yearlyZnnMomentumRewardPoolForPillarsTop30: number;
    yearlyZnnMomentumRewardPoolForPillarsNotTop30: number;
    yearlyZnnDelegateRewardPoolForPillars: number;
    lpProgramParticipationRate: number;
}
