import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ZenonToolsApiService } from './services/zenon-tools-api/zenon-tools-api.service';
import { HttpClientModule } from '@angular/common/http';
import { PillarsPageComponent } from './components/pages/pillars-page/pillars-page.component';
import { OverviewPageComponent } from './components/pages/overview-page/overview-page.component';
import { CalculatorPageComponent } from './components/pages/calculator-page/calculator-page.component';
import { MarketDataCardComponent } from './components/market-data-card/market-data-card.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { AprCardComponent } from './components/apr-card/apr-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CalculatorWidgetComponent } from './components/calculator-widget/calculator-widget.component';
import { CalculatorDropdownComponent } from './components/calculator-widget/calculator-dropdown/calculator-dropdown.component';
import { StakeInputsComponent } from './components/calculator-widget/stake-inputs/stake-inputs.component';
import { SentinelInputsComponent } from './components/calculator-widget/sentinel-inputs/sentinel-inputs.component';
import { LiquidityInputsComponent } from './components/calculator-widget/liquidity-inputs/liquidity-inputs.component';
import { PillarInputsComponent } from './components/calculator-widget/pillar-inputs/pillar-inputs.component';
import { DelegationInputsComponent } from './components/calculator-widget/delegation-inputs/delegation-inputs.component';
import { InputFieldComponent } from './components/input/input-field/input-field.component';
import { TabSelectorComponent } from './components/input/tab-selector/tab-selector.component';
import { TimePeriodSelectorComponent } from './components/input/time-period-selector/time-period-selector.component';
import { ResultCardComponent } from './components/calculator-widget/result-card/result-card.component';
import { PillarSelectionModalComponent } from './components/modals/pillar-selection-modal/pillar-selection-modal.component';
import { DropdownComponent } from './components/input/dropdown/dropdown.component';
import { ResultItemComponent } from './components/calculator-widget/result-item/result-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PriceInputsComponent } from './components/calculator-widget/price-inputs/price-inputs.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CalculatorModalComponent } from './components/modals/calculator-modal/calculator-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PillarProfilePageComponent } from './components/pages/pillar-profile-page/pillar-profile-page.component';
import { TwemojiPipe } from './pipes/twemoji.pipe';
import { AcceleratorPageComponent } from './components/pages/accelerator-page/accelerator-page.component';
import { ProposalCardComponent } from './components/proposal-card/proposal-card.component';
import { ProjectPageComponent } from './components/pages/project-page/project-page.component';
import { ProjectStatusChipComponent } from './components/project-status-chip/project-status-chip.component';
import { VoteBreakdownCardComponent } from './components/vote-breakdown-card/vote-breakdown-card.component';
import { ProposalInfoCardComponent } from './components/pages/project-page/proposal-info-card/proposal-info-card.component';
import { MiddleEllipsisPipe } from './pipes/middle-ellipsis.pipe';
import { PillarVotingTableComponent } from './components/tables/pillar-voting-table/pillar-voting-table.component';
import { PillarRewardShareTableComponent } from './components/tables/pillar-reward-share-table/pillar-reward-share-table.component';
import { RewardShareGraphCardComponent } from './components/reward-share-graph-card/reward-share-graph-card.component';
import { PillarDelegatorTableComponent } from './components/tables/pillar-delegator-table/pillar-delegator-table.component';
import { PillarProfileManagementPageComponent } from './components/pages/pillar-profile-management-page/pillar-profile-management-page.component';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';
import { SearchBarComponent } from './components/input/search-bar/search-bar.component';
import { DonationsPageComponent } from './components/pages/donations-page/donations-page.component';
import { ContributorTableComponent } from './components/tables/contributor-table/contributor-table.component';
import { DonateModalComponent } from './components/modals/donate-modal/donate-modal.component';
import { AccountDetailsPageComponent } from './components/pages/account-details-page/account-details-page.component';
import { AcccountDetailsTableComponent } from './components/tables/account-details-table/account-details-table.component';
import { TransactionsTableComponent } from './components/tables/account-details-table/transactions-table/transactions-table.component';
import { TableTabSelectorComponent } from './components/input/table-tab-selector/table-tab-selector.component';
import { ParticipationCardComponent } from './components/participation-card/participation-card.component';
import { TokensTableComponent } from './components/tables/account-details-table/tokens-table/tokens-table.component';
import { ParticipationListItemComponent } from './components/participation-card/participation-list-item/participation-list-item.component';
import { ProposalsTableComponent } from './components/tables/account-details-table/proposals-table/proposals-table.component';
import { PlasmaTableComponent } from './components/tables/account-details-table/plasma-table/plasma-table.component';
import { AccountsPageComponent } from './components/pages/accounts-page/accounts-page.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { InfoItemTableComponent } from './components/info-card/info-item-table/info-item-table.component';
import { InfoLineCellComponent } from './components/info-card/info-line-cell/info-line-cell.component';
import { ContextContainerComponent } from './components/containers/context-container/context-container.component';
import { BasicContainerComponent } from './components/containers/basic-container/basic-container.component';
import { DividerComponent } from './components/divider/divider.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PillarsPageComponent,
        OverviewPageComponent,
        CalculatorPageComponent,
        MarketDataCardComponent,
        LineChartComponent,
        AprCardComponent,
        FooterComponent,
        CalculatorWidgetComponent,
        CalculatorDropdownComponent,
        StakeInputsComponent,
        SentinelInputsComponent,
        LiquidityInputsComponent,
        PillarInputsComponent,
        DelegationInputsComponent,
        InputFieldComponent,
        TabSelectorComponent,
        TimePeriodSelectorComponent,
        ResultCardComponent,
        PillarSelectionModalComponent,
        DropdownComponent,
        ResultItemComponent,
        PriceInputsComponent,
        CalculatorModalComponent,
        LoaderComponent,
        PillarProfilePageComponent,
        TwemojiPipe,
        AcceleratorPageComponent,
        ProposalCardComponent,
        ProjectPageComponent,
        ProjectStatusChipComponent,
        VoteBreakdownCardComponent,
        ProposalInfoCardComponent,
        MiddleEllipsisPipe,
        PillarVotingTableComponent,
        PillarRewardShareTableComponent,
        RewardShareGraphCardComponent,
        PillarDelegatorTableComponent,
        PillarProfileManagementPageComponent,
        PageSelectorComponent,
        SearchBarComponent,
        DonationsPageComponent,
        ContributorTableComponent,
        DonateModalComponent,
        AccountDetailsPageComponent,
        AcccountDetailsTableComponent,
        TransactionsTableComponent,
        TableTabSelectorComponent,
        ParticipationCardComponent,
        TokensTableComponent,
        ParticipationListItemComponent,
        ProposalsTableComponent,
        PlasmaTableComponent,
        AccountsPageComponent,
        InfoCardComponent,
        InfoItemTableComponent,
        InfoLineCellComponent,
        ContextContainerComponent,
        BasicContainerComponent,
        DividerComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatDialogModule,
        MatTooltipModule,
        FontAwesomeModule,
    ],
    providers: [ZenonToolsApiService],
    bootstrap: [AppComponent],
    entryComponents: [PillarSelectionModalComponent],
})
export class AppModule {}
