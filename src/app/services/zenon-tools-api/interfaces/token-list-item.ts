export interface TokenListItem {
    tokenStandard: string;
    name: string;
    symbol: string;
    domain: string;
    owner: string;
    totalSupply: number;
    maxSupply: number;
    decimals: number;
    holderCount: number;
}

export type TokenListItems = Array<TokenListItem>;
