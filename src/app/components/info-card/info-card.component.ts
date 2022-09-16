import { Component, Input, OnInit } from '@angular/core';
import { InfoItem } from './info-item-table/info-item-table.component';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {
  @Input() infoItems: Array<InfoItem> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
