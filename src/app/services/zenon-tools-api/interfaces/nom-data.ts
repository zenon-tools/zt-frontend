export interface TotalStaked {
    weightedAmount: number;
    amount: number;
}

export interface LpInfo {
    avgStakingLockupTimeInDays: number;
    participationRate: number;
    totalStaked: TotalStaked;
}

export interface NomData {
    momentumHeight: number;
    timestamp: number;
    nodeVersion: string;
    znnPriceUsd: number;
    qsrPriceUsd: number;
    totalStakedZnn: TotalStaked;
    avgStakingLockupTimeInDays: number;
    znnEthLpInfo: LpInfo;
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
    yearlyZnnMomentumRewardPoolForPillarsTop30: number;
    yearlyZnnMomentumRewardPoolForPillarsNotTop30: number;
    yearlyZnnDelegateRewardPoolForPillars: number;
    orbitalRewardMultiplier: number;
}
