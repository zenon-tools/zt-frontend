import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { take } from 'rxjs';
import { TokenDetails } from 'src/app/services/zenon-tools-api/interfaces/token/token-details';

@Component({
    selector: 'app-token-details-page',
    templateUrl: './token-details-page.component.html',
    styleUrls: ['./token-details-page.component.scss'],
})
export class TokenDetailsPageComponent implements OnInit {
    tokenStandard: string = '';
    usdValue: number = 0;
    isLoading: boolean = true;
    tokenDetails?: TokenDetails;
    coinDecimals: number = 1;

    iconPath: string = '';

    tokensWithIcon: string[] = [
        'zts1znnxxxxxxxxxxxxx9z4ulx',
        'zts1qsrxxxxxxxxxxxxxmrhjll',
        'zts1gs8cvx7z8dsglk8srtu0nm'
    ];

    constructor(
        private route: ActivatedRoute,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.tokenStandard = params['token'];
            this.iconPath = this.getTokenIconPath(this.tokenStandard);

            this.zenonToolsApiService
                .getTokenDetails(this.tokenStandard)
                .pipe(take(1))
                .subscribe((details: TokenDetails) => {
                    this.isLoading = false;
                    this.coinDecimals = Math.pow(10, details.decimals);
                    this.tokenDetails = details;
                });
        });
    }

    private getTokenIconPath(id: string) {
        return this.tokensWithIcon.includes(id)
            ? `../../../assets/images/tokens/${id}_50.png`
            : '';
    }
}
