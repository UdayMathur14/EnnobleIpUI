import { Component, OnInit, Input, SimpleChanges, ElementRef, EventEmitter, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TransporterService } from '../../../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-transporter-grid-table',
  templateUrl: './transporter-grid-table.component.html',
  styleUrl: './transporter-grid-table.component.scss'
})
export class TransporterGridTableComponent implements OnInit {
  transportersList: any = [];
  loadSpinner: boolean = true
  @Input() searchedTransporter!: any;
  @ViewChild('table') table!: ElementRef;
  @Output() dataChange = new EventEmitter<any[]>();
  @Output() headersChange = new EventEmitter<string[]>();
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router,
    private toastr: ToastrService,
    private transporterService: TransporterService) { }

  ngOnInit(): void {
    this.getAllTransportersListInit();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedTransporter'].currentValue) {
      this.getFilteredTransportersList();
    } else if (changes['searchedTransporter'].firstChange === false && changes['searchedTransporter'].currentValue === '') {
      this.getAllTransportersListInit();
    }
  }

  getAllTransportersListInit() {
    let data = {
      "transporterCode": '',
      "transporterName": ''
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.loadSpinner = false;
      this.dataChange.emit(this.transportersList);
      this.emitHeaders();  // Emit headers after the data is fetched and set
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH TRANSPORTER FROM FILTERS 
  getFilteredTransportersList() {
    let data = {
      "transporterCode": this.searchedTransporter.transCode || "",
      "transporterName": this.searchedTransporter.transName || ""
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.loadSpinner = false;
      this.dataChange.emit(this.transportersList);
      this.emitHeaders();  // Emit headers after the data is fetched and set
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table.nativeElement.querySelectorAll('thead th');
    headerCells.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Action') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.headersChange.emit(headers);
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