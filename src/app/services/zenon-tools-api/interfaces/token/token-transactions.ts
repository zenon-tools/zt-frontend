export interface TokenTransaction {
    hash: string;
    momentumTimestamp: number;
    method: string;
    amount: number;
    address: string;
    toAddress: string;
}

export type TokenTransactions = Array<TokenTransaction>;
