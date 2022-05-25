import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-result-item',
    templateUrl: './result-item.component.html',
    styleUrls: ['./result-item.component.scss'],
})
export class ResultItemComponent {
    @Input() label: string = '';
    @Input() value: string = '';
    @Input() info: string = '';
    @Input() valueColor: string = '#FFFFFF';

    constructor() {}
}
