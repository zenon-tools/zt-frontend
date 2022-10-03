import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild,
} from '@angular/core';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    first,
    fromEvent,
    map,
    startWith,
    Subject,
    switchMap,
} from 'rxjs';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { Prices } from '../calculator-widget.component';

@Component({
    selector: 'app-price-inputs',
    templateUrl: './price-inputs.component.html',
    styleUrls: ['./price-inputs.component.scss'],
})
export class PriceInputsComponent implements AfterViewInit {
    @Output() customPrices = new EventEmitter<Prices>();

    @ViewChild('znnPriceInput', { static: false })
    znnPriceInput!: ElementRef;

    @ViewChild('qsrPriceInput', { static: false })
    qsrPriceInput!: ElementRef;

    public znnPriceToShow: number = 10;
    public qsrPriceToShow: number = 1;

    private currentZnnPrice$ = new BehaviorSubject<number>(10);
    private currentQsrPrice$ = new BehaviorSubject<number>(1);

    private customZnnPrice$ = new BehaviorSubject<number>(10);
    private customQsrPrice$ = new BehaviorSubject<number>(1);

    public useCustomZnnPriceSubject$ = new BehaviorSubject<boolean>(false);
    public useCustomQsrPriceSubject$ = new BehaviorSubject<boolean>(false);

    private znnPriceToUse$ = this.useCustomZnnPriceSubject$.pipe(
        switchMap((useCustomPrice) => {
            return useCustomPrice
                ? this.customZnnPrice$
                : this.currentZnnPrice$;
        })
    );

    private qsrPriceToUse$ = this.useCustomQsrPriceSubject$.pipe(
        switchMap((useCustomPrice) => {
            return useCustomPrice
                ? this.customQsrPrice$
                : this.currentQsrPrice$;
        })
    );

    public znnPrice$ = new Subject<number>();
    public qsrPrice$ = new Subject<number>();

    constructor(
        private cdr: ChangeDetectorRef,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngAfterViewInit() {
        this.zenonToolsApiService.nomData$
            .pipe(first())
            .subscribe((nomData) => {
                this.currentZnnPrice$.next(nomData.znnPriceUsd);
                this.currentQsrPrice$.next(nomData.qsrPriceUsd);
                this.znnPriceToShow = nomData.znnPriceUsd;
                this.qsrPriceToShow = nomData.qsrPriceUsd;

                fromEvent(this.znnPriceInput.nativeElement, 'keyup')
                    .pipe(
                        distinctUntilChanged(),
                        map((value) =>
                            Number(this.znnPriceInput.nativeElement.value)
                        ),
                        startWith(this.znnPriceToShow)
                    )
                    .subscribe((value) => {
                        if (!this.useCustomZnnPriceSubject$.value) {
                            this.useCustomZnnPriceSubject$.next(true);
                        }
                        this.customZnnPrice$.next(value);
                    });

                fromEvent(this.qsrPriceInput.nativeElement, 'keyup')
                    .pipe(
                        distinctUntilChanged(),
                        map((value) =>
                            Number(this.qsrPriceInput.nativeElement.value)
                        ),
                        startWith(this.qsrPriceToShow)
                    )
                    .subscribe((value) => {
                        if (!this.useCustomQsrPriceSubject$.value) {
                            this.useCustomQsrPriceSubject$.next(true);
                        }
                        this.customQsrPrice$.next(value);
                    });

                combineLatest([
                    this.znnPriceToUse$,
                    this.qsrPriceToUse$,
                ]).subscribe(([znnPrice, qsrPrice]) => {
                    if (znnPrice > 0 && this.znnPriceToShow != znnPrice) {
                        this.znnPriceToShow = znnPrice;
                    }
                    if (qsrPrice > 0 && this.qsrPriceToShow != qsrPrice) {
                        this.qsrPriceToShow = qsrPrice;
                    }
                    this.customPrices.emit({
                        znn: znnPrice,
                        qsr: qsrPrice,
                    });
                });
            });

        this.zenonToolsApiService.nomData$.subscribe((nomData) => {
            this.currentZnnPrice$.next(nomData.znnPriceUsd);
            this.currentQsrPrice$.next(nomData.qsrPriceUsd);
        });

        this.cdr.detectChanges();
    }

    onZnnPriceReset() {
        this.useCustomZnnPriceSubject$.next(false);
    }

    onQsrPriceReset() {
        this.useCustomQsrPriceSubject$.next(false);
    }
}
