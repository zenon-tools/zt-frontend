import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TabSelectorItem } from '../tab-selector/tab-selector.component';

@Component({
    selector: 'app-time-period-selector',
    templateUrl: './time-period-selector.component.html',
    styleUrls: ['./time-period-selector.component.scss'],
})
export class TimePeriodSelectorComponent implements OnInit {
    @Output() selectedValue = new EventEmitter<number>();

    timePeriodItems$ = new BehaviorSubject<Array<TabSelectorItem>>([
        { label: 'Day', value: 1 },
        { label: 'Month', value: 30 },
        {
            label: 'Year',
            value: 360,
        },
    ]);

    constructor() {}

    ngOnInit(): void {
        this.selectedValue.emit(360);
    }

    onTimePeriodChanged(value: number) {
        this.selectedValue.emit(value);
    }
}
