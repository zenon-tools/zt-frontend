export interface Vote {
    momentumHash: string;
    momentumTimestamp: number;
    projectUrl: string;
    projectName: string;
    phaseName: string;
    vote: number;
}

export type Votes = Array<Vote>;
