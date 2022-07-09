import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-page-selector',
    templateUrl: './page-selector.component.html',
    styleUrls: ['./page-selector.component.scss'],
})
export class PageSelectorComponent {
    @Input() hidePreviousBtn: boolean = false;
    @Input() hideNextBtn: boolean = false;
    @Output() selectPrevious = new EventEmitter<void>();
    @Output() selectNext = new EventEmitter<void>();

    faAngleLeft = faAngleLeft;
    faAngleRight = faAngleRight;

    constructor() {}

    onPreviousSelected() {
        this.selectPrevious.emit();
    }

    onNextSelected() {
        this.selectNext.emit();
    }
}
