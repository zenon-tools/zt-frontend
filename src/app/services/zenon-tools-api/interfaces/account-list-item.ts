export interface AccountListItem {
    address: string;
    znnBalance: number;
    qsrBalance: number;
    blockCount: number;
}

export type AccountListItems = Array<AccountListItem>;
