import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    map,
    Subject,
    switchMap,
    take,
    shareReplay,
} from 'rxjs';
import { RewardCalculatorService } from 'src/app/services/reward-calculator/reward-calculator.service';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import {
    DropdownItem,
    ParticipationType,
} from './calculator-dropdown/calculator-dropdown.component';
import { DelegationInputs } from './delegation-inputs/delegation-inputs.component';
import { LiquidityInputs } from './liquidity-inputs/liquidity-inputs.component';
import { PillarInputs } from './pillar-inputs/pillar-inputs.component';
import { SentinelInputs } from './sentinel-inputs/sentinel-inputs.component';
import { StakeInputs } from './stake-inputs/stake-inputs.component';
import {
    faDollarSign,
    faClone,
    faXmark,
    faChevronDown,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { PriceInputsComponent } from './price-inputs/price-inputs.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Pillars } from 'src/app/services/zenon-tools-api/interfaces/pillar';

export interface Prices {
    znn: number;
    qsr: number;
}

@Component({
    selector: 'app-calculator-widget',
    templateUrl: './calculator-widget.component.html',
    styleUrls: ['./calculator-widget.component.scss'],
})
export class CalculatorWidgetComponent implements OnInit {
    @Input() isClosable: boolean = false;
    @Input() shouldScrollContent: boolean = false;
    @Input() initialPillar: string = '';
    @Input() useRoutes: boolean = true;
    @Output() duplicateCalculator = new EventEmitter<boolean>();
    @Output() closeCalculator = new EventEmitter<boolean>();
    @ViewChild('priceInputs', { static: false })
    priceInputs!: PriceInputsComponent;

    faDollarSign = faDollarSign;
    faClone = faClone;
    faXmark = faXmark;
    faChevronDown = faChevronDown;
    faArrowUpRightFromSquare = faArrowUpRightFromSquare;

    ParticipationType = ParticipationType;
    showDetails: boolean = false;

    customPricesSubject$ = new Subject<Prices>();
    useCustomPricesSubject$ = new BehaviorSubject<boolean>(false);
    duplicateCalculatorSubject$ = new BehaviorSubject<boolean>(false);
    participationTypeSubject$ = new BehaviorSubject<ParticipationType>(
        ParticipationType.Stake
    );

    isInitialPillarSet: boolean = false;

    private stakeInputsSubject$ = new BehaviorSubject<StakeInputs>({
        amount: 100,
        lockUpMonths: 1,
        timePeriodInDays: 30,
    });
    private delegationInputsSubject$ = new BehaviorSubject<DelegationInputs>({
        amount: 10000,
        pillar: '',
        addToPillarWeight: true,
        timePeriodInDays: 30,
    });
    public liquidityInputsSubject$ = new BehaviorSubject<LiquidityInputs>({
        amount: 100,
        wBnbAmout: 1.5,
        timePeriodInDays: 30,
    });
    public sentinelInputsSubject$ = new BehaviorSubject<SentinelInputs>({
        amount: 1,
        timePeriodInDays: 30,
    });
    public pillarInputsSubject$ = new BehaviorSubject<PillarInputs>({
        amount: 1,
        slotCost: 150000,
        isTop30: true,
        timePeriodInDays: 30,
    });

    public currentPricesSubject$ = this.zenonToolsApiService.nomData$.pipe(
        map((nom) => <Prices>{ znn: nom.znnPriceUsd, qsr: nom.qsrPriceUsd })
    );

    public pricesToUse$ = this.useCustomPricesSubject$.pipe(
        switchMap((useCustomPrices) => {
            return useCustomPrices
                ? this.customPricesSubject$
                : this.currentPricesSubject$;
        }),
        shareReplay(1)
    );

    public stakingRewards$ = combineLatest([
        this.zenonToolsApiService.nomData$,
        this.stakeInputsSubject$,
        this.pricesToUse$,
    ]).pipe(
        map(([nomData, inputs, prices]) =>
            this.calculatorService.computeStakingRewards(
                nomData,
                prices,
                inputs
            )
        )
    );

    public delegationRewards$ = combineLatest([
        this.zenonToolsApiService.nomData$,
        this.zenonToolsApiService.pillars$,
        this.delegationInputsSubject$,
        this.pricesToUse$,
    ]).pipe(
        map(([nomData, pillars, inputs, prices]) =>
            this.calculatorService.computeDelegationRewards(
                nomData,
                prices,
                pillars,
                inputs
            )
        )
    );

    public liquidityRewards$ = combineLatest([
        this.zenonToolsApiService.nomData$,
        this.zenonToolsApiService.pcsPoolData$,
        this.liquidityInputsSubject$,
        this.pricesToUse$,
    ]).pipe(
        map(([nomData, pcsPoolData, inputs, prices]) =>
            this.calculatorService.computeLiquidityRewards(
                nomData,
                prices,
                pcsPoolData,
                inputs
            )
        )
    );

    public sentinelRewards$ = combineLatest([
        this.zenonToolsApiService.nomData$,
        this.sentinelInputsSubject$,
        this.pricesToUse$,
    ]).pipe(
        map(([nomData, inputs, prices]) =>
            this.calculatorService.computeSentinelRewards(
                nomData,
                prices,
                inputs
            )
        )
    );

    public pillarRewards$ = combineLatest([
        this.zenonToolsApiService.pillars$,
        this.pillarInputsSubject$,
        this.pricesToUse$,
    ]).pipe(
        map(([pillars, inputs, prices]) =>
            this.calculatorService.computePillarRewards(prices, pillars, inputs)
        )
    );

    public rewardsToDisplay$ = this.participationTypeSubject$.pipe(
        switchMap((type) => {
            switch (type) {
                case ParticipationType.Stake:
                    return this.stakingRewards$;
                case ParticipationType.Delegation:
                    return this.delegationRewards$;
                case ParticipationType.Liquidity:
                    return this.liquidityRewards$;
                case ParticipationType.Sentinel:
                    return this.sentinelRewards$;
                case ParticipationType.Pillar:
                    return this.pillarRewards$;
                default:
                    return this.stakingRewards$;
            }
        })
    );

    public pillars$ = this.zenonToolsApiService.pillars$;

    constructor(
        private calculatorService: RewardCalculatorService,
        private zenonToolsApiService: ZenonToolsApiService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (!this.useRoutes && this.initialPillar.length > 0) {
            this.participationTypeSubject$.next(ParticipationType.Delegation);
        }

        if (this.useRoutes) {
            combineLatest([this.route.params, this.route.queryParams])
                .pipe(debounceTime(0))
                .subscribe(([params, queryParams]) => {
                    if (Object.keys(params).length > 0) {
                        switch (params['type']) {
                            case 'stake':
                                this.participationTypeSubject$.next(
                                    ParticipationType.Stake
                                );
                                break;
                            case 'delegation':
                                if (!this.isInitialPillarSet) {
                                    this.pillars$
                                        .pipe(take(1))
                                        .subscribe((pillars: Pillars) => {
                                            this.initialPillar =
                                                this.pillarToNameToAddress(
                                                    pillars,
                                                    queryParams['pillar']
                                                );

                                            this.cdr.detectChanges();
                                        });
                                    this.isInitialPillarSet = true;
                                }

                                this.participationTypeSubject$.next(
                                    ParticipationType.Delegation
                                );
                                break;
                            case 'liquidity':
                                this.participationTypeSubject$.next(
                                    ParticipationType.Liquidity
                                );
                                break;
                            case 'sentinel':
                                this.participationTypeSubject$.next(
                                    ParticipationType.Sentinel
                                );
                                break;
                            case 'pillar':
                                this.participationTypeSubject$.next(
                                    ParticipationType.Pillar
                                );
                                break;
                        }

                        if (
                            queryParams['znnPrice'] ||
                            queryParams['qsrPrice']
                        ) {
                            const prices: Prices = { znn: 0, qsr: 0 };
                            if (queryParams['znnPrice']) {
                                prices.znn = Number(queryParams['znnPrice']);
                            }
                            if (queryParams['qsrPrice']) {
                                prices.qsr = Number(queryParams['qsrPrice']);
                            }
                            this.useCustomPricesSubject$.next(true);
                            this.customPricesSubject$.next(prices);
                        }
                    }
                });
        }
    }

    onUseCustomPricesPressed() {
        this.useCustomPricesSubject$.next(!this.useCustomPricesSubject$.value);
        if (!this.useCustomPricesSubject$.value) {
            this.priceInputs.onZnnPriceReset();
            this.priceInputs.onQsrPriceReset();
        }
    }

    onDuplicateCalculatorPressed() {
        this.duplicateCalculatorSubject$.next(
            !this.duplicateCalculatorSubject$.value
        );
        this.duplicateCalculator.emit(this.duplicateCalculatorSubject$.value);
    }

    onCloseCalculatorPressed() {
        this.closeCalculator.emit(this.isClosable);
    }

    onCustomPricesChanged(prices: Prices) {
        this.customPricesSubject$.next(prices);
    }

    onParticipationTypeChanged(item: DropdownItem) {
        if (this.useRoutes) {
            if (this.useCustomPricesSubject$.value) {
                this.pricesToUse$.pipe(take(1)).subscribe((prices: Prices) => {
                    this.navigateByParticipation(item.type, {
                        znnPrice: prices.znn,
                        qsrPrice: prices.qsr,
                    });
                });
            } else {
                this.navigateByParticipation(item.type);
            }
        } else {
            this.participationTypeSubject$.next(item.type);
        }
    }

    navigateByParticipation(type: ParticipationType, queryParams = {}) {
        switch (type) {
            case ParticipationType.Stake:
                this.router.navigate(['/calculator', 'stake'], {
                    queryParams: queryParams,
                });
                break;
            case ParticipationType.Delegation:
                this.router.navigate(['/calculator', 'delegation'], {
                    queryParams: queryParams,
                });
                break;
            case ParticipationType.Liquidity:
                this.router.navigate(['/calculator', 'liquidity'], {
                    queryParams: queryParams,
                });
                break;
            case ParticipationType.Sentinel:
                this.router.navigate(['/calculator', 'sentinel'], {
                    queryParams: queryParams,
                });
                break;
            case ParticipationType.Pillar:
                this.router.navigate(['/calculator', 'pillar'], {
                    queryParams: queryParams,
                });
                break;
        }
    }

    onStakeInputsChanged(inputs: StakeInputs) {
        this.stakeInputsSubject$.next(inputs);
    }

    onDelegationInputsChanged(inputs: DelegationInputs) {
        this.delegationInputsSubject$.next(inputs);

        if (this.useRoutes) {
            this.pillars$.pipe(take(1)).subscribe((pillars: Pillars) => {
                if (this.useCustomPricesSubject$.value) {
                    this.pricesToUse$
                        .pipe(take(1))
                        .subscribe((prices: Prices) => {
                            this.router.navigate([], {
                                relativeTo: this.route,
                                queryParams: {
                                    pillar: this.pillarAddressToName(
                                        pillars,
                                        inputs.pillar
                                    ),
                                    znnPrice: prices.znn,
                                    qsrPrice: prices.qsr,
                                },
                            });
                        });
                } else {
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: {
                            pillar: this.pillarAddressToName(
                                pillars,
                                inputs.pillar
                            ),
                        },
                    });
                }
            });
        }
    }

    onLiquidityInputsChanged(inputs: LiquidityInputs) {
        this.liquidityInputsSubject$.next(inputs);
    }

    onSentinelInputsChanged(inputs: SentinelInputs) {
        this.sentinelInputsSubject$.next(inputs);
    }

    onPillarInputsChanged(inputs: PillarInputs) {
        this.pillarInputsSubject$.next(inputs);
    }

    onShowDetailsPressed() {
        this.showDetails = !this.showDetails;
    }

    private pillarAddressToName(pillars: Pillars, address: string) {
        return pillars.get(address)?.name ?? '';
    }

    private pillarToNameToAddress(pillars: Pillars, name: string) {
        return (
            Array.from(pillars.entries()).find(
                (item) => item[1].name == name
            )?.[0] ?? ''
        );
    }
}
