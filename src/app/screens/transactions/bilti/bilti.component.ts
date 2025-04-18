import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIConstant } from '../../../core/constants';
import { BiltiService } from '../../../core/service/bilti.service';

@Component({
  selector: 'app-bilti',
  templateUrl: './bilti.component.html',
  styleUrl: './bilti.component.scss'
})
export class BiltiComponent implements OnInit {
  isFilters: boolean = true;
  biltisList: any = []
  currentPage: number = 1;
  count: number = 10;
  totalBiltis: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  loadSpinner: boolean = true;
  locations: any = [];
  
  constructor(private router: Router,
              private biltiService: BiltiService) { }

  ngOnInit(): void {
    this.getAllBiltisList();
  }

  onCreateBilti() {
    this.router.navigate([`transaction/addEditBilti/0`])
  }

  getAllBiltisList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    let data = {
      biltiNumber: filters?.biltiNumber || "",
      locationIds: filters?.locationIds ||  APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      status: filters?.status,
      biltiStatus: filters?.biltiStatus,
      transactionTypeCode: filters?.transactionTypeCode
    };
    this.biltiService.getBiltis(data, offset, count).subscribe(
      (response: any) => {
        this.biltisList = response.biltiCreations;
        this.totalBiltis = response.paging.total;
        this.filters = response.filters;
        this.loadSpinner = false;
      },error => {
        this.loadSpinner = false;
      }
    );
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getAllBiltisList(0, this.count, this.appliedFilters);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAllBiltisList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getAllBiltisList(0, this.count, this.appliedFilters);
    }
}
