import { Component, Input, OnInit } from '@angular/core';
import {
    faArrowUpRightFromSquare,
    faCopy,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';

export interface InfoLineCell {
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
    selector: 'app-info-line-cell',
    templateUrl: './info-line-cell.component.html',
    styleUrls: ['./info-line-cell.component.scss'],
})
export class InfoLineCellComponent implements OnInit {
    @Input() item!: InfoLineCell;

    faArrowUpRightFromSquare = faArrowUpRightFromSquare;
    faCopy = faCopy;
    faCircleInfo = faCircleInfo;

    constructor(private clipboard: Clipboard) {}

    ngOnInit(): void {}

    onValuePressed(text?: string) {
        if (this.item.isCopyable && text != null) {
            this.clipboard.copy(text);
        }
    }
}
