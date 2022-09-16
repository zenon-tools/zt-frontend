import { Component, Input, OnInit } from '@angular/core';

export interface InfoItem {
    label?: string;
    value?: string;
    fullValue?: string;
    hoverText?: string;
    toolTipText?: string;
    emoji?: string;
    isCopyable?: boolean;
    isExternalLink?: boolean;
    routerLink?: any;
}

@Component({
    selector: 'app-info-item-table',
    templateUrl: './info-item-table.component.html',
    styleUrls: ['./info-item-table.component.scss'],
})
export class InfoItemTableComponent implements OnInit {
    @Input() infoItems: Array<InfoItem> = [];

    constructor() {}

    ngOnInit(): void {}
}
