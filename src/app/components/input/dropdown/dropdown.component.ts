import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';

export interface DropdownItem {
    label: string;
    value: number;
}

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, OnChanges {
    @Input() items!: Array<DropdownItem>;
    @Input() initialIndex: number = 0;
    @Output() selectIndex = new EventEmitter<number>();

    @HostListener('document:click', ['$event.target'])
    onClick(target: Element) {
        if (!target.closest('.dropdown')) {
            this.isOpen = false;
        }
    }

    selectedItem!: DropdownItem;
    isOpen: boolean = false;

    constructor() {}

    ngOnInit(): void {
        this.selectedItem = this.items[this.initialIndex];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes['initialIndex'] &&
            changes['initialIndex'].currentValue != this.selectedItem.value
        ) {
            this.selectedItem = this.items[this.initialIndex];
        }
    }

    onDropdownSelected() {
        this.isOpen = !this.isOpen;
    }

    onItemSelected(item: DropdownItem) {
        this.isOpen = false;
        this.selectedItem = item;
        this.selectIndex.emit(item.value);
    }
}
