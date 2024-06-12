<<<<<<< HEAD
import { Component, OnChanges, OnInit, Input, SimpleChanges, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
=======
import { Component, OnInit, Input, SimpleChanges, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-freight-grid-table',
  templateUrl: './freight-grid-table.component.html',
  styleUrl: './freight-grid-table.component.scss'
})

<<<<<<< HEAD
export class FreightGridTableComponent implements OnInit, OnChanges {
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  @Input() freightList : any[] = []; 
  loadSpinner : boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router,
    private toastr: ToastrService,
    private freightService: FreightService) { }
    
  
=======
export class FreightGridTableComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  @Input() freightList : any[] = [];
  constructor(private router: Router) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
    
 
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['freightList']) {
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

  onGoToEditFreight(freightData : any) {
    this.router.navigate(['master/addEditFreight',  freightData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.freightList);
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table.nativeElement.querySelectorAll('thead th');
    headerCells.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Action') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }
}