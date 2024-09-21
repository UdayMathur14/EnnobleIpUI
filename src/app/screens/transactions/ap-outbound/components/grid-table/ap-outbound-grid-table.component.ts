import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ap-outbound-grid-table',
  templateUrl: './ap-outbound-grid-table.component.html',
  styleUrl: './ap-outbound-grid-table.component.scss'
})
export class ApOutboundGridTableComponent {

  @Input() biltiBillProcess: any = [];
}
