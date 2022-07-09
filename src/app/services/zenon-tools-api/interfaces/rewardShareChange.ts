export interface RewardShareChange {
    momentumHeight: string;
    momentumTimestamp: number;
    giveBlockRewardPercentage: number;
    giveDelegateRewardPercentage: number;
}

export type RewardShareChanges = Array<RewardShareChange>;
