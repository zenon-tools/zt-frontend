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
}

export type Pillars = Map<string, Pillar>;
