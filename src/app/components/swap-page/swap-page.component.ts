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
        'https://pancakeswap.finance/swap?inputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&outputCurrency=0x84b174628911896a3b87fa6980d05dbc2ee74836';

    constructor() {}

    ngOnInit(): void {}

    openLink(url: string) {
        window.open(url, '_blank');
    }
}
