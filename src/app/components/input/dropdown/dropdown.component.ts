import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
} from '@angular/core';

export interface PillarDropdownItem {
    label: string;
    info: string;
}

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
    @Input() items!: PillarDropdownItem[];
    @Output() selectItem = new EventEmitter<PillarDropdownItem>();

    @HostListener('document:click', ['$event.target'])
    onClick(target: Element) {
        if (!target.closest('.dropdown')) {
            this.isOpen = false;
        }
    }

    selectedItem!: PillarDropdownItem;
    isOpen: boolean = false;

    constructor() {}

    ngOnInit(): void {
        this.selectedItem = {label: 'Test', info: '24'}; //this.items[0];
    }

    onDropdownSelected() {
        this.isOpen = !this.isOpen;
    }

    onItemSelected(item: PillarDropdownItem) {
        this.isOpen = false;
        this.selectedItem = item;
        this.selectItem.emit(item);
    }
}
