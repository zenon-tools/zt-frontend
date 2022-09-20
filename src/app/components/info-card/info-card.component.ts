import { Component, Input, OnInit } from '@angular/core';
import { InfoLineCell } from './info-line-cell/info-line-cell.component';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {
  @Input() infoItems: Array<InfoLineCell> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
