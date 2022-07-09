export interface Links {
    telegram: string;
    twitter: string;
    website: string;
    github: string;
    medium: string;
    email: string;
}

export interface PillarOffChainInfo {
    name: string;
    links: Links;
    avatar: string;
    description: string;
}

export type PillarsOffChainInfo = Map<string, PillarOffChainInfo>;