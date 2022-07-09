export interface Delegator {
    address: string;
    delegationStartTimestamp: number;
    delegationAmount: number;
}

export type Delegators = Array<Delegator>;