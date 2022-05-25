export interface Links {
    telegram: string;
    twitter: string;
    website: string;
    github: string;
    medium: string;
}

export interface PillarOffChainInfo {
    name: string;
    links: Links;
    avatar: string;
}

export type PillarsOffChainInfo = Map<string, PillarOffChainInfo>;