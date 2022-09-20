import { Component, Input, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { InfoLineCell } from '../../info-card/info-line-cell/info-line-cell.component';


@Component({
    selector: 'app-participation-list-item',
    templateUrl: './participation-list-item.component.html',
    styleUrls: ['./participation-list-item.component.scss'],
})
export class ParticipationListItemComponent implements OnInit {
    @Input() label: string = '';
    @Input() iconPath: string = '';
    @Input() detailLeft: any = '';
    @Input() detailRight: any = '';
    @Input() apr: string = '';
    @Input() infoItems: Array<InfoLineCell> = [];

    faChevronDown = faChevronDown;

    showDetails: boolean = false;

    constructor() {}

    ngOnInit(): void {}

    onShowDetailsPressed() {
        this.showDetails = !this.showDetails;
    }
}
