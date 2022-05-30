import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ZenonToolsApiService } from './services/zenon-tools-api/zenon-tools-api.service';
import { HttpClientModule } from '@angular/common/http';
import { PillarsPageComponent } from './components/pillars-page/pillars-page.component';
import { OverviewPageComponent } from './components/overview-page/overview-page.component';
import { CalculatorPageComponent } from './components/calculator-page/calculator-page.component';
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
import { PillarProfilePageComponent } from './components/pillar-profile-page/pillar-profile-page.component';
import { TwemojiPipe } from './pipes/twemoji.pipe';

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
        FontAwesomeModule
    ],
    providers: [ZenonToolsApiService],
    bootstrap: [AppComponent],
    entryComponents: [PillarSelectionModalComponent]
})
export class AppModule {}
