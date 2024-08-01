import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-error-logging-report-grid-table',
  templateUrl: './error-logging-report-grid-table.component.html',
  styleUrl: './error-logging-report-grid-table.component.scss'
})
export class ErrorLoggingReportGridTableComponent {

  @Input() errorLoggings: any[] = [];
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['errorLoggings']) {
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
