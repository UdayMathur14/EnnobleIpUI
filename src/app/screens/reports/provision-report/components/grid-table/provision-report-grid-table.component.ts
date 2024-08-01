import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provision-report-grid-table',
  templateUrl: './provision-report-grid-table.component.html',
  styleUrl: './provision-report-grid-table.component.scss'
})
export class ProvisionReportGridTableComponent {

  @Input() provisionalReport: any[] = [];
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['provisionalReport']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Action') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }

}
