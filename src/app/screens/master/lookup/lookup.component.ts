import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { LookupService } from '../../../core/service/lookup.service';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private router: Router,
    private exportService: ExportService,
    private lookupService : LookupService,
    private toastr: ToastrService
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

  exportData(fileName: string = "Lookup") {
    this.exportService.csvExport(fileName);
  }

}
