import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-provisional-report-grid-table',
  templateUrl: './provisional-report-grid-table.component.html',
  styleUrl: './provisional-report-grid-table.component.scss'
})
export class ProvisionalReportGridTableComponent {

  @Input() glAccrualList: any[] = [];
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['glAccrualList']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
        headers.push(cell.innerText.trim());
    });
    this.exportHeader.emit(headers);
  }
}
