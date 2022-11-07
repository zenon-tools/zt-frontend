import {
    shareReplay,
    partition,
    Observable,
    takeUntil,
    repeatWhen,
    fromEvent,
} from 'rxjs';
import { Pillars } from '../services/zenon-tools-api/interfaces/pillar';

export default class Common {
    static whenPageVisible() {
        const visibilitychange$ = fromEvent(document, 'visibilitychange').pipe(
            shareReplay({ refCount: true, bufferSize: 1 })
        );

        const [pageVisible$, pageHidden$] = partition(
            visibilitychange$,
            () => document.visibilityState === 'visible'
        );

        return function <T>(source: Observable<T>) {
            return source.pipe(
                takeUntil(pageHidden$),
                repeatWhen(() => pageVisible$)
            );
        };
    }

    static tryGetAddressLabel(
        address: string,
        pillars: Pillars,
        returnAddress: boolean = false
    ) {
        switch (address) {
            case 'z1qxemdeddedxplasmaxxxxxxxxxxxxxxxxsctrp':
                return 'Plasma Contract';
            case 'z1qxemdeddedxpyllarxxxxxxxxxxxxxxxsy3fmg':
                return 'Pillar Contract';
            case 'z1qxemdeddedxt0kenxxxxxxxxxxxxxxxxh9amk0':
                return 'Token Contract';
            case 'z1qxemdeddedxsentynelxxxxxxxxxxxxxwy0r2r':
                return 'Sentinel Contract';
            case 'z1qxemdeddedxswapxxxxxxxxxxxxxxxxxxl4yww':
                return 'Swap Contract';
            case 'z1qxemdeddedxstakexxxxxxxxxxxxxxxxjv8v62':
                return 'Stake Contract';
            case 'z1qxemdeddedxsp0rkxxxxxxxxxxxxxxxx956u48':
                return 'Spork Contract';
            case 'z1qxemdeddedxaccelerat0rxxxxxxxxxxp4tk22':
                return 'Accelerator-Z Contract';
            case 'z1qxemdeddedxlyquydytyxxxxxxxxxxxxflaaae':
                return 'Liquidity Contract';
            case 'z1qzlytaqdahg5t02nz5096frflfv7dm3y7yxmg7':
                return 'Binance Smart Chain Bridge';
            case 'z1qqw8f3qxx9zg92xgckqdpfws3dw07d26afsj74':
                return 'Liquidity Mining Treasury';
            case 'z1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsggv2f':
                return 'Empty Address';
            case 'z1qquatn97szsv7m8ztna509cunu2tks4wtzveku':
                return 'Zenon Tools Donation Address';
            case 'z1qzyzqtszv6fnw56rpnlq0npqt70tux0cl0yn5k':
                return 'Alien Valley Plasma Bot';
            default:
                if ((pillars.get(address)?.name ?? '').length > 0) {
                    return pillars.get(address)?.name ?? '';
                }
                return returnAddress ? address : '';
        }
    }

    static initiateCsvDownload(fileName: string, content: string) {
        const link = document.createElement('a');
        link.setAttribute(
            'href',
            'data:text/csv;charset=utf-8,' + encodeURIComponent(content)
        );
        link.setAttribute('download', fileName);
        link.click();
        link.remove();
    }
}
