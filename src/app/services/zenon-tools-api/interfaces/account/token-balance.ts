export interface TokenBalance {
    balance: number;
    name: string;
    symbol: string;
    decimals: number;
    tokenStandard: string;
}

export type TokenBalances = Array<TokenBalance>;