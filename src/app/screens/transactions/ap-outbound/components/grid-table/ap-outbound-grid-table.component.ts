import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ap-outbound-grid-table',
  templateUrl: './ap-outbound-grid-table.component.html',
  styleUrl: './ap-outbound-grid-table.component.scss'
})
export class ApOutboundGridTableComponent {

  @Input() biltiBillProcess: any[] = [];
  @Output() selectedRows = new EventEmitter<any[]>();

  allSelected: boolean = false;
  selectedData: any[] = [];

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;

    this.biltiBillProcess.forEach(biltiList => biltiList.selected = this.allSelected);

    if (this.allSelected) {
      this.selectedData = [...this.biltiBillProcess];
    } else {
      this.selectedData = [];
    }

    this.selectedRows.emit(this.selectedData);
  }

  toggleSelection(row: any, event: any) {
    row.selected = event.target.checked;

    if (row.selected) {
      this.selectedData.push(row); 
    } else {
      this.selectedData = this.selectedData.filter(item => item !== row);
    }

    this.allSelected = this.selectedData.length === this.biltiBillProcess.length;

    this.selectedRows.emit(this.selectedData);
  }
}
