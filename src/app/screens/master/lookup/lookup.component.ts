import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LookupService } from '../../../core/service/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss'
})
export class LookupComponent implements OnInit{

  isFilters: boolean = true;
  lookupsList: any[] = [];
  fullScreen : boolean = false;
  loadSpinner : boolean = true;
  headers : string[] = [];
  constructor(private router: Router,
    private lookupService : LookupService,
    private toastr: ToastrService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit(): void {
    this.getAllLookupsList()
  }

  getAllLookupsList() {
    let data = {
      "code": ''
    }
    this.lookupService.getLookups(data).subscribe((response: any) => {
      this.lookupsList = response.lookUps;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "code": e.code || ""
    }
    this.lookupService.getLookups(data).subscribe((response: any) => {
      this.lookupsList = response.lookUps;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onCreateLookup() {
    this.router.navigate(['master/addEditLookup', '0'])
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Lookup") {
    // Map the data to include only the necessary fields
    const mappedLookupsList = this.lookupsList.map(lookup => ({
      lookUpType: lookup.lookUpType?.value,
      code: lookup.code,
      value: lookup.value,
      description: lookup.description,
      attribute1: lookup.attribute1,
      attribute2: lookup.attribute2,
      attribute3: lookup.attribute3,
      attribute4: lookup.attribute4,
      status: lookup.status
    }));
    this.xlsxService.xlsxExport(mappedLookupsList, this.headers, fileName);
  }

}
