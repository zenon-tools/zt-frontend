import { Component, Input } from '@angular/core';
import {
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-result-item',
    templateUrl: './result-item.component.html',
    styleUrls: ['./result-item.component.scss'],
})
export class ResultItemComponent {
    @Input() label: string = '';
    @Input() value: string = '';
    @Input() info: string = '';
    @Input() tooltipText: string = '';
    @Input() valueColor: string = '#FFFFFF';

    faCircleInfo = faCircleInfo;

    constructor() {}
}
