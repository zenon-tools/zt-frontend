import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface TabSelectorItem {
  label: string,
  value: any
}

@Component({
    selector: 'app-tab-selector',
    templateUrl: './tab-selector.component.html',
    styleUrls: ['./tab-selector.component.scss'],
})
export class TabSelectorComponent implements OnInit {
    @Input() items!: Array<TabSelectorItem>;
    @Input() initialIndex: number = 0;
    @Output() selectedValue = new EventEmitter<any>();

    selectedIndex: number = 0;

    constructor() {}

    ngOnInit(): void {
      this.selectedIndex = this.initialIndex;
    }

    onTabSelected(e: MouseEvent, i: number) {
        this.selectedIndex = i;
        this.selectedValue.emit(this.items[i].value);
    }
}
