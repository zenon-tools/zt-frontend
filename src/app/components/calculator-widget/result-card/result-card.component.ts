import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss']
})
export class ResultCardComponent {
  @Input() label: string = ''
  @Input() value: string = ''
  @Input() info: string = ''
  @Input() valueColor: string = '#FFFFFF'

  constructor() { }
}
