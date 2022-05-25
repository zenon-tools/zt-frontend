import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    BehaviorSubject,
    combineLatest,
    fromEvent,
    Observable,
    ReplaySubject,
    Subject,
} from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import {
    Pillar,
    Pillars,
} from 'src/app/services/zenon-tools-api/interfaces/pillar';
import { ZenonToolsApiService } from 'src/app/services/zenon-tools-api/zenon-tools-api.service';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';
import { PillarSelectionModalComponent } from '../../modals/pillar-selection-modal/pillar-selection-modal.component';

export interface DelegationInputs {
    amount: number;
    addToPillarWeight: boolean;
    pillar: string;
    timePeriodInDays: number;
}

@Component({
    selector: 'app-delegation-inputs',
    templateUrl: './delegation-inputs.component.html',
    styleUrls: ['./delegation-inputs.component.scss'],
})
export class DelegationInputsComponent implements AfterViewInit {
    @Input() initialPillar: string = '';
    @Output() delegationInputs = new EventEmitter<DelegationInputs>();

    @ViewChild('delegationAmountInput', { static: false })
    delegationAmountInput!: ElementRef;

    public defaultDelegationAmount: number = 100;

    public pillars$ = this.zenonToolsApiService.pillars$;

    public selectedPillarAddress$ = new Subject<string>();
    public selectedPillar$ = new ReplaySubject<Pillar>();

    public addToPillarWeightItems: Array<TabSelectorItem> = Array.from([
        { label: 'No', value: false },
        { label: 'Yes', value: true },
    ]);

    private delegationAmount$!: Observable<number>;
    private addToWeightSubject$ = new BehaviorSubject<boolean>(true);
    private timePeriodSubject$ = new BehaviorSubject<number>(1);

    private pillars!: Pillar[];

    // TODO: Fix this
    private isInitialized: boolean = false;

    constructor(
        public dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private zenonToolsApiService: ZenonToolsApiService
    ) {}

    ngAfterViewInit() {
        this.pillars$.subscribe((pillars: Pillars) => {
            this.pillars = [...pillars.values()].sort(
                (a, b) => b.delegateApr - a.delegateApr
            );
            if (!this.isInitialized) {
                this.isInitialized = true;
                if (this.initialPillar.length > 0) {
                    this.selectedPillar$.next(pillars.get(this.initialPillar)!);
                } else {
                    this.selectedPillar$.next(this.pillars[0]);
                }
            }
        });

        this.delegationAmount$ = fromEvent(
            this.delegationAmountInput.nativeElement,
            'keyup'
        ).pipe(
            distinctUntilChanged(),
            map((value) =>
                Number(this.delegationAmountInput.nativeElement.value)
            ),
            startWith(this.defaultDelegationAmount)
        );

        combineLatest([
            this.delegationAmount$,
            this.selectedPillarAddress$,
            this.addToWeightSubject$,
            this.timePeriodSubject$,
        ]).subscribe(
            ([delegationAmount, selectedPillar, addToWeight, timePeriod]) => {
                this.delegationInputs.emit({
                    amount: delegationAmount,
                    addToPillarWeight: addToWeight,
                    pillar: selectedPillar,
                    timePeriodInDays: timePeriod,
                });
            }
        );

        combineLatest([this.selectedPillar$, this.pillars$]).subscribe(
            ([selectedPillar, pillars]) => {
                for (let [address, value] of pillars) {
                    if (value.name == selectedPillar.name) {
                        this.selectedPillarAddress$.next(address);
                        break;
                    }
                }
            }
        );

        this.cdr.detectChanges();
    }

    onSelectPillar() {
        const dialogRef = this.dialog.open(PillarSelectionModalComponent, {
            data: this.pillars, maxWidth: '100vw'
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result != undefined) {
                this.selectedPillar$.next(result);
            }
        });
    }

    onAddToPillarWeightChanged(value: boolean) {
        this.addToWeightSubject$.next(value);
    }

    onTimePeriodChanged(value: number) {
        this.timePeriodSubject$.next(value);
    }
}
