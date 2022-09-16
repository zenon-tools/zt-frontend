import { Component, Input, OnInit } from '@angular/core';
import { InfoItem } from '../info-item-table/info-item-table.component';
import {
    faArrowUpRightFromSquare,
    faCopy,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'app-info-line-cell',
    templateUrl: './info-line-cell.component.html',
    styleUrls: ['./info-line-cell.component.scss'],
})
export class InfoLineCellComponent implements OnInit {
    @Input() item!: InfoItem;

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
