import { Component } from '@angular/core';
import { GlAccrualPostingService } from '../../../core/service/gl-accrual-posting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gl-accrual-posting',
  templateUrl: './gl-accrual-posting.component.html',
  styleUrl: './gl-accrual-posting.component.scss'
})
export class GlAccrualPostingComponent {

  loadSpinner: boolean = false;
  count: number = 10;
  searchedData: any;
  glAccrualList = [];
  totalglAccrualLists: number = 0;
  filters: any = [];
  currentPage: number = 1;
  isFilters: boolean = true;
  selectedBiltiData: any[] = [];  

  constructor(private glAccrualPostingService: GlAccrualPostingService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.getGlAccrualPosting()
  }

  getGlAccrualPosting(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const obj = {
      batchId: "",
      costCenter: "",
      businessArea: "",
      glAccount: "",
      subCategory: "",
    };
    this.glAccrualPostingService.getGlAccrualPosting(obj, offset, count).subscribe((response: any) => {
      console.log(response);
      
      this.loadSpinner = false;
      this.glAccrualList = response.biltiBillProcess;
      this.totalglAccrualLists = response.paging.total;
      this.filters = response.filters;
      this.loadSpinner = false;
    },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    )
  }

  filteredData(data: any) {
    this.searchedData = data;
    this.currentPage = 1;
    this.getGlAccrualPosting(0, this.count, this.searchedData);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getGlAccrualPosting(offset, this.count, this.searchedData);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getGlAccrualPosting(0, this.count, this.searchedData);
    }
}
