import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, map, shareReplay, startWith, switchMap } from 'rxjs';
import Common from 'src/app/utils/common';
import { environment } from 'src/environments/environment';
import { NomData } from './interfaces/nom-data';
import { LiquidityPoolData } from './interfaces/liquidity-pool-data';
import { Pillars } from './interfaces/pillar';
import { PillarsOffChainInfo } from './interfaces/pillar-off-chain-info';
import { Project } from './interfaces/project';
import { ProposalVotes } from './interfaces/proposal-vote';
import { ProposalListItems } from './interfaces/proposal-list-item';
import { Votes } from './interfaces/vote';
import { RewardShareChanges } from './interfaces/rewardShareChange';
import { Delegators } from './interfaces/delegator';
import { PillarProfile } from './interfaces/pillar-profile';
import { Donations } from './interfaces/donation';
import { AccountDetails } from './interfaces/account/account-details';
import { ParticipationDetails } from './interfaces/account/participation-details';
import { AccountTransactions } from './interfaces/account/account-transaction';
import { TokenBalances } from './interfaces/account/token-balance';
import { AzProposals } from './interfaces/account/az-proposal';
import { PlasmaFusions } from './interfaces/account/plasma-fusion';
import { AccountListItems } from './interfaces/account-list-item';
import { TokenListItems } from './interfaces/token-list-item';
import { TokenDetails } from './interfaces/token/token-details';
import { TokenHolders } from './interfaces/token/token-holders';
import { TokenTransactions } from './interfaces/token/token-transactions';

@Injectable({
    providedIn: 'root',
})
export class ZenonToolsApiService {
    private baseUrl = environment.ztApiUrl;

    private baseDataRefreshRate = 15;
    private intervalMs = this.baseDataRefreshRate * 1000;
    private pillarsOffChainInfoIntervalMs = 1000 * 60 * 5;
    private liquidityPoolDataIntervalMs = 1000 * 60 * 5;

    public intervalSecondsUntilRefresh$ = interval(1000).pipe(
        Common.whenPageVisible(),
        map(
            (index) =>
                this.baseDataRefreshRate -
                ((index % this.baseDataRefreshRate) + 1)
        ),
        shareReplay(1)
    );

    public dataRefreshInterval$ = interval(this.intervalMs);

    public nomData$ = this.dataRefreshInterval$.pipe(
        startWith(0),
        Common.whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<NomData>(`${this.baseUrl}/nom-data`)
        ),
        shareReplay(1)
    );

    public pillars$ = this.dataRefreshInterval$.pipe(
        startWith(0),
        Common.whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<Pillars>(`${this.baseUrl}/pillars`)
        ),
        map((i) => new Map(Object.entries(i))),
        shareReplay(1)
    );

    public pillarsOffChainInfo$ = interval(
        this.pillarsOffChainInfoIntervalMs
    ).pipe(
        startWith(0),
        Common.whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<PillarsOffChainInfo>(
                `${this.baseUrl}/pillars-off-chain`
            )
        ),
        map((i) => new Map(Object.entries(i))),
        shareReplay(1)
    );

    public znnEthPoolData$ = interval(this.liquidityPoolDataIntervalMs).pipe(
        startWith(0),
        Common.whenPageVisible(),
        switchMap(() =>
            this.httpClient.get<LiquidityPoolData>(`${this.baseUrl}/znn-eth-pool`)
        ),
        shareReplay(1)
    );

    constructor(private httpClient: HttpClient) {}

    getVotesByPillar(pillar: string, page: number, searchText: string = '') {
        return this.httpClient
            .get<Votes>(
                `${environment.ztApiUrl}/votes?pillar=${pillar}&page=${page}&search=${searchText}`
            )
            .pipe(shareReplay(1));
    }

    getProposals(page: number, searchText: string = '') {
        return this.httpClient
            .get<ProposalListItems>(
                `${environment.ztApiUrl}/projects?page=${page}&search=${searchText}`
            )
            .pipe(shareReplay(1));
    }

    getProject(projectId: string) {
        return this.httpClient
            .get<Project>(
                `${environment.ztApiUrl}/project?projectId=${projectId}`
            )
            .pipe(shareReplay(1));
    }

    getProjectVotes(projectId: string) {
        return this.httpClient
            .get<ProposalVotes>(
                `${environment.ztApiUrl}/project-votes?projectId=${projectId}`
            )
            .pipe(shareReplay(1));
    }

    getPhaseVotes(phaseId: string) {
        return this.httpClient
            .get<ProposalVotes>(
                `${environment.ztApiUrl}/phase-votes?phaseId=${phaseId}`
            )
            .pipe(shareReplay(1));
    }

    getRewardShareChanges(pillar: string) {
        return this.httpClient
            .get<RewardShareChanges>(
                `${environment.ztApiUrl}/reward-share-history?pillar=${pillar}`
            )
            .pipe(shareReplay(1));
    }

    getPillarDelegators(pillar: string) {
        return this.httpClient
            .get<Delegators>(
                `${environment.ztApiUrl}/pillar-delegators?pillar=${pillar}`
            )
            .pipe(shareReplay(1));
    }

    getPillarProfile(pillar: string) {
        return this.httpClient
            .get<PillarProfile>(
                `${environment.ztApiUrl}/pillar-profile?pillar=${pillar}`
            )
            .pipe(shareReplay(1));
    }

    getDonations() {
        return this.httpClient
            .get<Donations>(`${environment.ztApiUrl}/donations`)
            .pipe(shareReplay(1));
    }

    getAccounts(page: number, searchText: string = '') {
        return this.httpClient
            .get<AccountListItems>(
                `${environment.ztApiUrl}/accounts?page=${page}&search=${searchText}`
            )
            .pipe(shareReplay(1));
    }

    getAccountDetails(address: string) {
        return this.httpClient
            .get<AccountDetails>(`${environment.ztApiUrl}/accounts/${address}`)
            .pipe(shareReplay(1));
    }

    getAccountParticipation(address: string) {
        return this.httpClient
            .get<ParticipationDetails>(
                `${environment.ztApiUrl}/accounts/${address}/participation`
            )
            .pipe(shareReplay(1));
    }

    getAccountTransactions(
        address: string,
        page: number,
        getReceived: boolean = true
    ) {
        const endpoint = getReceived ? 'received' : 'unreceived';
        return this.httpClient
            .get<AccountTransactions>(
                `${environment.ztApiUrl}/accounts/${address}/transactions/${endpoint}?page=${page}`
            )
            .pipe(shareReplay(1));
    }

    getAccountTokens(address: string, page: number) {
        return this.httpClient
            .get<TokenBalances>(
                `${environment.ztApiUrl}/accounts/${address}/tokens?page=${page}`
            )
            .pipe(shareReplay(1));
    }

    getAccountAzProposals(address: string, page: number) {
        return this.httpClient
            .get<AzProposals>(
                `${environment.ztApiUrl}/accounts/${address}/proposals?page=${page}`
            )
            .pipe(shareReplay(1));
    }

    getAccountPlasmaFusions(address: string, page: number) {
        return this.httpClient
            .get<PlasmaFusions>(
                `${environment.ztApiUrl}/accounts/${address}/fusions?page=${page}`
            )
            .pipe(shareReplay(1));
    }

    getAccountRewardsCsv(
        address: string,
        year: string,
        timezone: string,
        currency: string,
        includeQsr: boolean
    ) {
        return this.httpClient.get<String>(
            `${environment.ztApiUrl}/accounts/${address}/rewards/csv?year=${year}&timezone=${timezone}&currency=${currency}&qsr=${includeQsr}`,
            { responseType: 'text' as any }
        );
    }

    getAccountRewardsCount(address: string) {
        return this.httpClient
            .get<number>(
                `${environment.ztApiUrl}/accounts/${address}/rewards/count`
            )
            .pipe(shareReplay(1));
    }

    getTokens(page: number, searchText: string = '') {
        return this.httpClient
            .get<TokenListItems>(
                `${environment.ztApiUrl}/tokens?page=${page}&search=${searchText}`
            )
            .pipe(shareReplay(1));
    }

    getTokenDetails(tokenId: string) {
        return this.httpClient
            .get<TokenDetails>(`${environment.ztApiUrl}/tokens/${tokenId}`)
            .pipe(shareReplay(1));
    }

    getTokenHolders(tokenId: string, page: number, searchText: string = '') {
        return this.httpClient
            .get<TokenHolders>(
                `${environment.ztApiUrl}/tokens/${tokenId}/holders?page=${page}&search=${searchText}`
            )
            .pipe(shareReplay(1));
    }

    getTokenTransactions(
        tokenId: string,
        page: number,
        searchText: string = ''
    ) {
        return this.httpClient
            .get<TokenTransactions>(
                `${environment.ztApiUrl}/tokens/${tokenId}/transactions?page=${page}&search=${searchText}`
            )
            .pipe(shareReplay(1));
    }

    putPillarOffChainInfo(data: any) {
        return this.httpClient.put<any>(
            `${environment.ztApiUrl}/pillar-off-chain`,
            data
        );
    }
}
