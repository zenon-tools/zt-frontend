import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { DropdownItem } from '../../input/dropdown/dropdown.component';
import { SearchBarComponent } from '../../input/search-bar/search-bar.component';
import { TabSelectorItem } from '../../input/tab-selector/tab-selector.component';
import { HoldersTableComponent } from './holders-table/holders-table.component';
import { TokenTransactionsTableComponent } from './token-transactions-table/token-transactions-table.component';

@Component({
    selector: 'app-token-details-table',
    templateUrl: './token-details-table.component.html',
    styleUrls: ['./token-details-table.component.scss'],
})
export class TokenDetailsTableComponent implements OnChanges {
    @Input() tokenStandard!: string;
    @Input() decimals!: number;
    @Input() totalSupply!: number;
    @Input() symbol!: string;
    @Input() owner!: string;

    @ViewChild('transactionsTable')
    transactionsTable?: TokenTransactionsTableComponent;
    @ViewChild('holdersTable')
    holdersTable?: HoldersTableComponent;
    @ViewChild('searchBar')
    searchBar?: SearchBarComponent;

    isLoading: boolean = true;
    activeTab: number = 0;

    tabs: Array<any> = Array.from([
        { label: 'Holders', value: 0 },
        { label: 'Transactions', value: 1 },
    ]);

    tabItems: Array<TabSelectorItem> = this.tabs;
    dropdownItems: Array<DropdownItem> = this.tabs;

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges) {
        if (
            (changes['tokenStandard'] &&
                changes['tokenStandard'].currentValue != null) ||
            (changes['decimals'] && changes['decimals'].currentValue != null) ||
            (changes['totalSupply'] &&
                changes['totalSupply'].currentValue != null) ||
            (changes['symbol'] && changes['symbol'].currentValue != null) ||
            (changes['owner'] && changes['owner'].currentValue != null)
        ) {
            this.activeTab = 0;
            this.cdr.detectChanges();
        }
    }

    onTabSelected(index: number) {
        this.searchBar!.onClear();
        this.activeTab = index;
    }

    onSearch(searchText: string) {
        if (this.activeTab == 0) {
            this.holdersTable!.onSearch(searchText);
        } else {
            this.transactionsTable!.onSearch(searchText);
        }
    }

    onClearSearch() {
        if (this.activeTab == 0) {
            this.holdersTable!.onClearSearch();
        } else {
            this.transactionsTable!.onClearSearch();
        }
    }
}
