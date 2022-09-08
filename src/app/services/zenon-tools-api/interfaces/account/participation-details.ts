interface Stake {
    startTimestamp: number;
    lockUpDurationInSec: number;
    stakedAmount: number;
}

interface Delegation {
    delegate: string;
    delegationStartTimestamp: number;
    delegatedBalance: number;
}

interface Sentinel {
    registrationTimestamp: number;
    isRevocable: boolean;
    active: boolean;
}

interface Pillar {
    name: string;
    spawnTimestamp: number;
    slotCostQsr: number;
    isRevocable: boolean;
    revokeCooldown: number;
    revokeTimestamp: number;
}

export interface ParticipationDetails {
    address: string;
    stakes: Stake[];
    delegation: Delegation;
    sentinel: Sentinel;
    pillar: Pillar;
}