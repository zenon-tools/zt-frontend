export interface Pillar {
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
    votingActivity: number;
    producedMomentumCount: number;
    dailyMomentumAvg: number;
    uptime30d: number;
    delegateApr30d: number;
}

export type Pillars = Map<string, Pillar>;
