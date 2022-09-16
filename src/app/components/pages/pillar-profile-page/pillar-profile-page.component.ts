import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    PillarOffChainInfo,
    PillarsOffChainInfo,
} from 'src/app/services/zenon-tools-api/interfaces/pillar-off-chain-info';
import {
    Pillar,
    Pillars,
} from 'src/app/services/zenon-tools-api/interfaces/pillar';
import {
    faCopy,
    faCircleInfo,
    faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { PillarProfile } from 'src/app/services/zenon-tools-api/interfaces/pillar-profile';
import { MatDialog } from '@angular/material/dialog';
import { CalculatorModalComponent } from '../../modals/calculator-modal/calculator-modal.component';

@Component({
    selector: 'app-pillar-profile-page',
    templateUrl: './pillar-profile-page.component.html',
    styleUrls: ['./pillar-profile-page.component.scss'],
})
export class PillarProfilePageComponent implements OnInit {
    @HostListener('document:click', ['$event.target'])
    onClick(target: Element) {
        if (!target.closest('.menu-icon')) {
            this.isMenuOpen = false;
        }
    }

    faCopy = faCopy;
    faCircleInfo = faCircleInfo;
    faEllipsisH = faEllipsisH;

    coinDecimals: number = 100000000;

    pillarName: string = '';
    pillarDescription: string = '';

    pillarsOffChainInfo$ = this.zenonToolsApiService.pillarsOffChainInfo$;
    pillarOffChainInfo?: PillarOffChainInfo;

    pillars$ = this.zenonToolsApiService.pillars$;
    pillar?: Pillar;

    pillarProfile?: PillarProfile;

    hasSocialLinks: boolean = false;
    isLoading: boolean = true;
    isMenuOpen: boolean = false;

    constructor(
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private zenonToolsApiService: ZenonToolsApiService,
        private clipboard: Clipboard
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.pillarName = params['name'];

            this.pillarsOffChainInfo$
                .pipe(take(1))
                .subscribe((pillarInfos: PillarsOffChainInfo) => {
                    this.pillarOffChainInfo = Array.from(
                        pillarInfos.values()
                    ).find((item) => item.name == this.pillarName);
                    this.hasSocialLinks =
                        this.pillarOffChainInfo?.links != null &&
                        Object.keys(this.pillarOffChainInfo!.links).length > 0;
                    this.pillarDescription =
                        this.pillarOffChainInfo?.description ?? '';
                });

            this.pillars$.pipe(take(1)).subscribe((pillars: Pillars) => {
                this.pillar = Array.from(pillars.values()).find(
                    (item) => item.name == this.pillarName
                );
            });

            this.zenonToolsApiService
                .getPillarProfile(this.pillarName)
                .pipe(take(1))
                .subscribe((profile: PillarProfile) => {
                    this.isLoading = false;
                    this.pillarProfile = profile;
                });
        });
    }

    onMenuSelected() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    onManageProfileSelected() {
        this.router.navigate([`/pillars/${this.pillarName}/manage`]);
    }

    onCopyText(text: string) {
        this.clipboard.copy(text);
    }

    onCalculatorSelected(pillarName: string) {
        this.dialog.open(CalculatorModalComponent, {
            data: pillarName,
        });
    }
}
