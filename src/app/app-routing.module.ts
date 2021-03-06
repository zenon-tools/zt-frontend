import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceleratorPageComponent } from './components/accelerator-page/accelerator-page.component';
import { CalculatorPageComponent } from './components/calculator-page/calculator-page.component';
import { DonationsPageComponent } from './components/donations-page/donations-page.component';
import { OverviewPageComponent } from './components/overview-page/overview-page.component';
import { PillarProfileManagementPageComponent } from './components/pillar-profile-management-page/pillar-profile-management-page.component';
import { PillarProfilePageComponent } from './components/pillar-profile-page/pillar-profile-page.component';
import { PillarsPageComponent } from './components/pillars-page/pillars-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';

const routes: Routes = [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    {
        path: 'overview',
        component: OverviewPageComponent,
    },
    {
        path: 'pillars',
        component: PillarsPageComponent,
    },
    {
        path: 'pillars/:name',
        component: PillarProfilePageComponent,
    },
    {
        path: 'pillars/:name/manage',
        component: PillarProfileManagementPageComponent,
    },
    {
        path: 'accelerator',
        component: AcceleratorPageComponent,
    },
    {
        path: 'accelerator/:projectId',
        component: ProjectPageComponent,
    },
    {
        path: 'calculator',
        component: CalculatorPageComponent,
    },
    {
        path: 'calculator/:type',
        component: CalculatorPageComponent,
    },
    {
        path: 'donate',
        component: DonationsPageComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
