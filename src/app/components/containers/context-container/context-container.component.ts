import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-context-container',
  templateUrl: './context-container.component.html',
  styleUrls: ['./context-container.component.scss']
})
export class ContextContainerComponent implements OnInit {
  @Input() gap: string = '2rem';

  constructor() { }

  ngOnInit(): void {
  }

}
