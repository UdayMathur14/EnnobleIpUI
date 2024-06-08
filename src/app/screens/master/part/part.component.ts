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
  constructor(private router: Router,
    private partService : PartService,
    private toastr: ToastrService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    this.getFilteredPartsList();
  }

  getFilteredPartsList() {
    let data = {
      "partNumber": "",
      "partName" : ""
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "partNumber": e.partNumber || "",
      "partName" : e.partName || ""
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
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

}
