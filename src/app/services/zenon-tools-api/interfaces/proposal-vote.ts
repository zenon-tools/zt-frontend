export interface ProposalVote {
    pillarName: string;
    vote: number;
    momentumTimestamp: number;
}

export type ProposalVotes = Array<ProposalVote>;
