import { Component, OnInit } from '@angular/core';
import {
    faArrowUpRightFromSquare,
    faWallet,
    faBolt,
    faArrowRightArrowLeft,
    faCalculator,
    faBridgeWater,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-swap-page',
    templateUrl: './swap-page.component.html',
    styleUrls: ['./swap-page.component.scss'],
})
export class SwapPageComponent implements OnInit {
    faArrowUpRightFromSquare = faArrowUpRightFromSquare;
    faWallet = faWallet;
    faBolt = faBolt;
    faArrowRightArrowLeft = faArrowRightArrowLeft;
    faCalculator = faCalculator;
    faBridgeWater = faBridgeWater;

    pcsUrl: string =
        'https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0x84b174628911896a3b87Fa6980D05Dbc2eE74836&chainId=56';

    constructor() {}

    ngOnInit(): void {}

    openLink(url: string) {
        window.open(url, '_blank');
    }
}
