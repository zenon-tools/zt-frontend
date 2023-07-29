export interface LiquidityPoolData {
    timestamp: number;
    baseTokenPriceUsd: number;
    pairedTokenPriceUsd: number;
    impermanentLossPast7d: number;
    liquidityUsd: number;
    yearlyTradingFeesUsd: number;
    lpTokenTotalSupply: number;
}