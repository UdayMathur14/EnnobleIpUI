import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AdviceTypeService } from '../../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-advice-grid-table',
  templateUrl: './advice-grid-table.component.html',
  styleUrl: './advice-grid-table.component.scss'
})
export class AdviceGridTableComponent implements OnInit, OnChanges {
  adviceTypeList: any = [];
  adviceTypeListOrg: any = [];
  loadSpinner: boolean = true;
  @Input() filterKeyword!: string;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router,
    private adviceService: AdviceTypeService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllAdviceTypesListInit();
  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.adviceTypeListOrg && this.adviceTypeListOrg.length && changes['filterKeyword'].currentValue){
      this.adviceTypeList = this.adviceTypeListOrg.filter((e:any) =>e.adviceType.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if(this.adviceTypeListOrg && this.adviceTypeListOrg.length && !changes['filterKeyword'].currentValue){
      this.adviceTypeList = this.adviceTypeListOrg;
    }
  }

  getAllAdviceTypesListInit() {
    let data = {
      "adviceType": '',
    }
    this.adviceService.getAdviceTypes(data).subscribe((response: any) => {
      this.adviceTypeList = response.advices;
      this.adviceTypeListOrg =  response.advices;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('\n'));
      this.loadSpinner = false;
    })
  }

  onGoToEditAdvice(advice : any) {
    this.router.navigate(['master/addEditAdvice', advice.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.adviceTypeList);
  }
}
