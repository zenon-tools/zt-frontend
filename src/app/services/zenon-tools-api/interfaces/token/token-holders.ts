export interface TokenHolder {
    address: string;
    balance: number;
    decimals: number;
}

export type TokenHolders = Array<TokenHolder>;
