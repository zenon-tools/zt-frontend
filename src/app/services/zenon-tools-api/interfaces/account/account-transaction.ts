export interface AccountTransaction {
    momentumTimestamp: number;
    method: string;
    amount: number;
    symbol: string;
    decimals: number;
    address: string;
    toAddress: string;
    isReceived: boolean;
}

export type AccountTransactions = Array<AccountTransaction>;