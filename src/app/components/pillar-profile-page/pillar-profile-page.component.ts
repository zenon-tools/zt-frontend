import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Votes } from 'src/app/services/zenon-tools-api/interfaces/vote';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    PillarOffChainInfo,
    PillarsOffChainInfo,
} from 'src/app/services/zenon-tools-api/interfaces/pillar-off-chain-info';

@Component({
    selector: 'app-pillar-profile-page',
    templateUrl: './pillar-profile-page.component.html',
    styleUrls: ['./pillar-profile-page.component.scss'],
})
export class PillarProfilePageComponent implements OnInit {
    pillarName: string = '';

    pillarsOffChainInfo$ = this.zenonToolsApiService.pillarsOffChainInfo$;
    pillarOffChainInfo?: PillarOffChainInfo;

    hasSocialLinks: boolean = false;
    isLoading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private zenonToolsApiService: ZenonToolsApiService
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
                });
        });
    }
}
