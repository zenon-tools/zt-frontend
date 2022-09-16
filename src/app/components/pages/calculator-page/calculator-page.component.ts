import { Component, ViewChild } from '@angular/core';
import { CalculatorWidgetComponent } from '../../calculator-widget/calculator-widget.component';

@Component({
    selector: 'app-calculator-page',
    templateUrl: './calculator-page.component.html',
    styleUrls: ['./calculator-page.component.scss'],
})
export class CalculatorPageComponent {
    @ViewChild('primaryCalculator', { static: false })
    private primaryCalculator?: CalculatorWidgetComponent;

    public duplicateCalculator: boolean = false;

    constructor() {}

    onDuplicateCalculatorPressed(duplicateCalculator: boolean) {
        this.duplicateCalculator = duplicateCalculator;
    }

    onCloseCalculatorPressed(isDuplicate: boolean) {
        if (isDuplicate) {
            this.duplicateCalculator = false;
            this.primaryCalculator?.duplicateCalculatorSubject$.next(false);
        }
    }
}
