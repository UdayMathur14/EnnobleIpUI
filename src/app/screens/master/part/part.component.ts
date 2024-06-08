import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { PartService } from '../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss'
})
export class PartComponent implements OnInit{
  partsList : any[] = [];
  loadSpinner : boolean = true;
  constructor(private router: Router,
    private exportService: ExportService,
    private partService : PartService,
    private toastr: ToastrService
  ) { }

  isFilters: boolean = true;
  searchedPart: string = '';
  fullScreen : boolean = false;

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

  exportData(fileName: string = "Part") {
    this.exportService.csvExport(fileName);
  }

}
