import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    combineLatest,
    distinctUntilChanged,
    fromEvent,
    map,
    Observable,
    of,
    startWith,
    Subject,
} from 'rxjs';
import {
    Pillar,
    Pillars,
} from 'src/app/services/zenon-tools-api/interfaces/pillar';

@Component({
    selector: 'app-calculator-modal',
    templateUrl: './calculator-modal.component.html',
    styleUrls: ['./calculator-modal.component.scss'],
})
export class CalculatorModalComponent {
    constructor(
        public dialogRef: MatDialogRef<CalculatorModalComponent>,
        @Inject(MAT_DIALOG_DATA) public pillarName: string
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
