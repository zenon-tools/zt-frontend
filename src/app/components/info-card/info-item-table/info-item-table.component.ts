import { Component, Input, OnInit } from '@angular/core';
import { InfoLineCell } from '../info-line-cell/info-line-cell.component';

@Component({
    selector: 'app-info-item-table',
    templateUrl: './info-item-table.component.html',
    styleUrls: ['./info-item-table.component.scss'],
})
export class InfoItemTableComponent implements OnInit {
    @Input() infoItems: Array<InfoLineCell> = [];

    constructor() {}

    ngOnInit(): void {}
}
