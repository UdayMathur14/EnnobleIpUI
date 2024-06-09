import { Component, OnInit, Input, SimpleChanges, EventEmitter, ElementRef, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-transporter-grid-table',
  templateUrl: './transporter-grid-table.component.html',
  styleUrl: './transporter-grid-table.component.scss'
})
export class TransporterGridTableComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  @Input() transportersList: any = [];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transportersList']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table.nativeElement.querySelectorAll('thead th');
    headerCells.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Actions') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }

  onGoToEditTransporter(transporterId: any) {
    this.router.navigate(['master/addEditTransporter', transporterId]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.transportersList);
  }

}