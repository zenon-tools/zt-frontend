import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { DropdownItem } from '../../input/dropdown/dropdown.component';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';

@Component({
    selector: 'app-account-details-table',
    templateUrl: './account-details-table.component.html',
    styleUrls: ['./account-details-table.component.scss'],
})
export class AcccountDetailsTableComponent implements OnChanges {
    @Input() address!: string;

    isLoading: boolean = true;
    activeTab: number = 0;

    tabs: Array<any> = Array.from([
        { label: 'Transactions', value: 0 },
        { label: 'Unreceived Transactions', value: 1 },
        { label: 'Tokens', value: 2 },
        { label: 'Plasma', value: 3 },
        { label: 'A-Z Proposals', value: 4 },
    ]);

    tabItems: Array<TabSelectorItem> = this.tabs;
    dropdownItems: Array<DropdownItem> = this.tabs;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['address'] && changes['address'].currentValue != null) {
            this.activeTab = 0;
            this.cdr.detectChanges();
        }
    }

    onTabSelected(index: number) {
        this.activeTab = index;
    }
}
