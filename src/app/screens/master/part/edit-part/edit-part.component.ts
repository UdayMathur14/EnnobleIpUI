import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { PartDataModel } from '../../../../core/model/part.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-part.component.html',
  styleUrl: './edit-part.component.scss'
})
export class EditPartComponent implements OnInit {
  constructor(private router: Router,
    private partService : PartService,
    private toastr: ToastrService,
    private _Activatedroute: ActivatedRoute) {}

  queryData : any;
  partData! : PartDataModel;
  partsList : any;
  loadSpinner : boolean = true;
  createPartData : any = {
    partNumber : '',
    partName : '',
    description : '',
    partSize : '',
    remarks : '',
    partPrice : '',
    status : ''
  }

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("partId");  
    if(this.queryData){
      this.getPartData(this.queryData);
    }
    this.getAllPartsListInit();
  }

  getPartData(partId: string) {
    this.partService.getPartData(partId).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  getAllPartsListInit() {
    let data = {
      "partNumber": ''
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  onPressSave(){
    this.loadSpinner = true;
    let data = {
      partNumber: this.partData.partNumber,
      partName: this.partData.partName,
      description: this.partData.description,
      partSize: this.partData.partSize,
      remarks: this.partData.remarks,
      partPrice: this.partData.partPrice,
      status: this.partData.status,
      modifiedBy: ""
    }
    this.partService.updatePart(this.queryData, data).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
      this.toastr.success('Part Update Successfully');
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  onCancelPress(){
    this.router.navigate(['/master/part'])
  }
}