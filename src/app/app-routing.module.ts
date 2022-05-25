import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculatorPageComponent } from './components/calculator-page/calculator-page.component';
import { OverviewPageComponent } from './components/overview-page/overview-page.component';
import { PillarsPageComponent } from './components/pillars-page/pillars-page.component';

const routes: Routes = [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    {
        path: 'overview',
        component: OverviewPageComponent,
    },
    {
        path: 'calculator',
        component: CalculatorPageComponent,
    },
    {
        path: 'pillars',
        component: PillarsPageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
