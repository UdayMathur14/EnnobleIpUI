import { Component, OnChanges, OnInit, Input, SimpleChanges, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';
import { ToastrService } from 'ngx-toastr';
import { FreightService } from '../../../../../core/service/freight.service';

@Component({
  selector: 'app-freight-grid-table',
  templateUrl: './freight-grid-table.component.html',
  styleUrl: './freight-grid-table.component.scss'
})

export class FreightGridTableComponent implements OnInit, OnChanges {
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  @Input() freightList: any[] = [];
  loadSpinner: boolean = false;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  constructor(private router: Router,
    private toastr: ToastrService,
    private freightService: FreightService) { }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['freightList']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Action' && cell.innerText.trim() !== 'Contract Attachment') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }

  onGoToEditFreight(freightData: any) {
    this.router.navigate(['master/addEditFreight', freightData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.freightList);
  }

  viewAttachment(data: any) {
    this.loadSpinner = true;
    this.freightService.getContractById(data?.locationId, data?.id).subscribe(
        (response: any) => {
            if (!response.fileData) {
                this.toastr.error('No PDF is available to download', 'Error');
                this.loadSpinner = false;
                return;
            }

            const base64Prefix = 'data:application/pdf;base64,';
            const base64Data = response.fileData.startsWith(base64Prefix) 
                ? response.fileData.substring(base64Prefix.length) 
                : response.fileData;
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
            a.download = response.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.loadSpinner = false;
        },
    );
}



}