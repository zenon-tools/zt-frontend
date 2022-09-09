export interface PlasmaFusion {
    momentumHeight: number;
    momentumTimestamp: number;
    qsrAmount: number;
    expirationHeight: number;
    address: string;
    beneficiary: string;
}

export type PlasmaFusions = Array<PlasmaFusion>;
