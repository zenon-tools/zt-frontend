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

export enum ParticipationType {
    Stake = 1,
    Delegation,
    Liquidity,
    Sentinel,
    Pillar,
}

export interface DropdownItem {
    type: ParticipationType;
    label: string;
    iconPath: string;
}

@Component({
    selector: 'app-calculator-dropdown',
    templateUrl: './calculator-dropdown.component.html',
    styleUrls: ['./calculator-dropdown.component.scss'],
})
export class CalculatorDropdownComponent implements OnInit, OnChanges {
    @Input() initialType: ParticipationType = ParticipationType.Stake;
    @Output() selectItem = new EventEmitter<DropdownItem>();

    @HostListener('document:click', ['$event.target'])
    onClick(target: Element) {
        if (!target.closest('.dropdown')) {
            this.isOpen = false;
        }
    }

    constructor(private cdr: ChangeDetectorRef) {}

    dropdownItems: DropdownItem[] = [
        {
            type: ParticipationType.Stake,
            label: 'Stake',
            iconPath: '../../../assets/images/stake_icon.png',
        },
        {
            type: ParticipationType.Delegation,
            label: 'Delegation',
            iconPath: '../../../assets/images/delegation_icon.png',
        },
        {
            type: ParticipationType.Liquidity,
            label: 'Liquidity',
            iconPath: '../../../assets/images/liquidity_icon.png',
        },
        {
            type: ParticipationType.Sentinel,
            label: 'Sentinel',
            iconPath: '../../../assets/images/sentinel_icon.png',
        },
        {
            type: ParticipationType.Pillar,
            label: 'Pillar',
            iconPath: '../../../assets/images/pillar_icon.png',
        },
    ];

    selectedItem!: DropdownItem;
    isOpen: boolean = false;

    ngOnInit(): void {
        this.selectedItem = this.dropdownItems[this.initialType - 1];
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.selectedItem = this.dropdownItems[this.initialType - 1];
        if (
            changes['initialType'] &&
            changes['initialType'].currentValue != null
        ) {
            this.cdr.detectChanges();
        }
    }

    onDropdownSelected() {
        this.isOpen = !this.isOpen;
    }

    onItemSelected(item: DropdownItem) {
        this.isOpen = false;
        this.selectedItem = item;
        this.selectItem.emit(item);
    }
}
