export interface Donation {
    address: string;
    momentumTimestamp: number;
    amount: number;
    symbol: string;
    decimals: number;
    pillar: string;
}

export type Donations = Array<Donation>;