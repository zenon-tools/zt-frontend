export interface TokenDetails {
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
    totalBurned: number;
    lastUpdateTimestamp: number;
    creationTimestamp: number;
    holderCount: number;
}
