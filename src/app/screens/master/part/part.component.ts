import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartService } from '../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss'
})
export class PartComponent implements OnInit{
  partsList : any[] = [];
  loadSpinner : boolean = true;
  isFilters: boolean = true;
  searchedPart: string = '';
  fullScreen : boolean = false;
  headers: any [] = [];
  currentPage: number = 1;
  count: number = 10;
  totalParts: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(private router: Router,
    private partService : PartService,
    private toastr: ToastrService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    this.getFilteredPartsList();
  }

  getFilteredPartsList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    let data = {
      "partNumber": filters?.partNumber || "",
      "partName" : filters?.partName || "",
      "status": filters?.status || ""
    }
    this.partService.getParts(data, offset, count).subscribe((response: any) => {
      this.partsList = response.parts;
      this.totalParts = response.paging.total;
      this.filters = response.filters
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getFilteredPartsList(0, this.count, this.appliedFilters);
  }

  onCreatePart() {
    this.router.navigate(['master/addEditPart', '0'])
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Part") {
    // Map the data to include only the necessary fields
    const mappedPartsList = this.partsList.map(part => ({
      partNumber: part.partNumber,
      partName: part.partName,
      description: part.description,
      partSize: part.partSize,
      partPrice: part.partPrice,
      remarks: part.remarks,
      status: part.status
    }));
    this.xlsxService.xlsxExport(mappedPartsList, this.headers, fileName);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getFilteredPartsList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getFilteredPartsList(0, this.count, this.appliedFilters);
    }

}
