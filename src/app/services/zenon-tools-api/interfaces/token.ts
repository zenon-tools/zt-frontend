export interface Token {
    name: string;
    symbol: string;
    domain: string;
    decimals: number;
    owner: string;
    totalSupply: number;
    maxSupply: number;
    isBurnable: boolean;
    isMintable: boolean;
    isUtility: boolean;
}
