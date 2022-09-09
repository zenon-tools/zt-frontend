export interface AzProposal {
    projectName: string;
    phaseName: string;
    projectId: string;
    creationTimestamp: number;
    url: string;
    status: number;
}

export type AzProposals = Array<AzProposal>;
