import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, EventEmitter, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PartService } from '../../../../../core/service/part.service';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-part-grid-table',
  templateUrl: './part-grid-table.component.html',
  styleUrl: './part-grid-table.component.scss'
})
export class PartGridTableComponent implements OnInit, OnChanges {
  @Input() searchedPart!: any;  
  @ViewChild('table') table!: ElementRef;
  @Output() dataChange = new EventEmitter<any[]>();
  @Output() headersChange = new EventEmitter<string[]>();
  partsList: any;
  partsListOrg : any;
  loadSpinner : boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  constructor(private router: Router,
    private toastr: ToastrService,
    private partService: PartService) { }
    
  ngOnInit(): void {
    this.getAllPartsListInit();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchedPart'].currentValue){
      this.getFilteredPartsList();
    } else if(changes['searchedPart'].firstChange === false && changes['searchedPart'].currentValue === ''){
      this.getAllPartsListInit();
    }

  }

  onGoToEditPart(partData : any) {
    this.router.navigate(['master/addEditPart',  partData.id]);
  }

  //GETTINGS PARTS LISTING ON PAGE LOAD
  getAllPartsListInit() {
    let data = {
      "partNumber": '',
      "partName" : ''
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.partsListOrg = response.parts;
      this.loadSpinner = false;
      this.dataChange.emit(this.partsList);
      this.emitHeaders(); // Emit headers after the data is fetched and set
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH PART FROM FILTERS 
  getFilteredPartsList() {
    let data = {
      "partNumber": this.searchedPart.partCode || "",
      "partName" : this.searchedPart.partName || ""
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.loadSpinner = false;
      this.dataChange.emit(this.partsList);
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

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.partsList);
  }

}