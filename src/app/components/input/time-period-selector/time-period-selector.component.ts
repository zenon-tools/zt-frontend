import {
    AfterViewInit,
    Component,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RewardCalculatorService } from 'src/app/services/reward-calculator/reward-calculator.service';
import { TabSelectorItem } from '../tab-selector/tab-selector.component';

@Component({
    selector: 'app-time-period-selector',
    templateUrl: './time-period-selector.component.html',
    styleUrls: ['./time-period-selector.component.scss'],
})
export class TimePeriodSelectorComponent implements OnInit, AfterViewInit {
    @Output() selectedValue = new EventEmitter<number>();

    timePeriodItems$ = new BehaviorSubject<Array<TabSelectorItem>>([
        { label: 'Day', value: 1 },
        { label: 'Month', value: 30 },
        {
            label: '*End of Phase 0',
            value: this.calculatorService.computeDaysLeftInPhaseZero(),
        },
    ]);

    private daysLeftInPhaseZeroSubscription!: Subscription;

    constructor(private calculatorService: RewardCalculatorService) {}

    ngOnInit(): void {
        this.selectedValue.emit(
            this.calculatorService.computeDaysLeftInPhaseZero()
        );
    }

    ngAfterViewInit(): void {
        this.daysLeftInPhaseZeroSubscription =
            this.calculatorService.daysLeftInPhaseZero$.subscribe(
                (daysLeft) => {
                    console.log('Days left: ' + daysLeft);
                    this.timePeriodItems$.next([
                        { label: 'Day', value: 1 },
                        { label: 'Month', value: 30 },
                        { label: '*End of Phase 0', value: daysLeft },
                    ]);
                }
            );
    }

    ngOnDestroy() {
        this.daysLeftInPhaseZeroSubscription.unsubscribe();
    }

    onTimePeriodChanged(value: number) {
        this.selectedValue.emit(value);
    }
}
