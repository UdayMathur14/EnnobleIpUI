import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-point-charge-grid-table',
  templateUrl: './point-charge-grid-table.component.html',
  styleUrl: './point-charge-grid-table.component.scss'
})
export class PointChargeGridTableComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  @Input() pointChargesList : any[] = [];
  constructor(
    private router: Router,
  ) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pointChargesList']) {
      this.emitHeaders();
    }
  }

  // NAVIGATING TO EDIT POINT MASTER PAGE
  onEditPointCharge(pointChargeData: any) {
    this.router.navigate(['master/editPointCharge', pointChargeData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.pointChargesList);
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

  openPDF(data: any, filename: any) {
    const base64Prefix = 'data:application/pdf;base64,';
    const base64Data = data.startsWith(base64Prefix) ? data.substring(base64Prefix.length) : data;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

