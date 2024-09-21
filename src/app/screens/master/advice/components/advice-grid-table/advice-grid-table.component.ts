import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AdviceTypeService } from '../../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-advice-grid-table',
  templateUrl: './advice-grid-table.component.html',
  styleUrl: './advice-grid-table.component.scss'
})
export class AdviceGridTableComponent implements OnInit {
  @Input() advicesList: any = [];
  @Input() filterKeyword!: string;
  @Input() batchDetails: any = [];
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['advicesList']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Action') {
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }

  onGoToEditAdvice(advice : any) {
    this.router.navigate(['master/addEditAdvice', advice.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.advicesList);
  }

  getBatchNumber(batchName: string): string {
    const batch = this.batchDetails.find((batch: any) => batch.batchName === batchName);
    return batch ? batch.batchNumber : '';
  }
}
