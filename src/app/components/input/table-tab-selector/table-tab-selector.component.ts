import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { TabSelectorItem } from '../tab-selector/tab-selector.component';

@Component({
    selector: 'app-table-tab-selector',
    templateUrl: './table-tab-selector.component.html',
    styleUrls: ['./table-tab-selector.component.scss'],
})
export class TableTabSelectorComponent implements OnChanges {
    @Input() items!: Array<TabSelectorItem>;
    @Input() initialIndex: number = 0;
    @Output() selectIndex = new EventEmitter<number>();

    currentIndex: number = 0;

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['initialIndex'] &&
            changes['initialIndex'].currentValue != this.currentIndex
        ) {
            this.currentIndex = this.initialIndex;
        }
    }

    onTabSelected(e: MouseEvent, i: number) {
        this.currentIndex = i;
        this.selectIndex.emit(i);
    }
}
