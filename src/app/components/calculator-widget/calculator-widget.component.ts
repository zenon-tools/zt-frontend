import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Subject, switchMap } from 'rxjs';
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
    @Output() duplicateCalculator = new EventEmitter<boolean>();
    @Output() closeCalculator = new EventEmitter<boolean>();
    @ViewChild('priceInputs', {static: false}) priceInputs!: PriceInputsComponent;

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
        })
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

    constructor(
        private calculatorService: RewardCalculatorService,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngOnInit(): void {
        if (this.initialPillar.length > 0) {
            this.participationTypeSubject$.next(ParticipationType.Delegation);
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
        console.log('Active selection: ' + item.label);
        this.participationTypeSubject$.next(item.type);
    }

    onStakeInputsChanged(inputs: StakeInputs) {
        console.log('onInputStakeAmount: ' + inputs.amount.toString());
        this.stakeInputsSubject$.next(inputs);
    }

    onDelegationInputsChanged(inputs: DelegationInputs) {
        console.log('onInputStakeAmount: ' + inputs.amount.toString());
        this.delegationInputsSubject$.next(inputs);
    }

    onLiquidityInputsChanged(inputs: LiquidityInputs) {
        console.log('onInputStakeAmount: ' + inputs.amount.toString());
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
}
