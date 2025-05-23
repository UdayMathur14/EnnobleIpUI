import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FreightService } from '../../../../core/service/freight.service';
import { BaseService } from '../../../../core/service/base.service';
import { FreightDataModel } from '../../../../core/model/masterModels.model';
import { APIConstant } from '../../../../core/constants';
import { LookupService } from '../../../../core/service/lookup.service';
import { StatusConfirmationComponent } from '../../../modals/status-confirmation/status-confirmation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlantService } from '../../../../core/service';

@Component({
  selector: 'app-add-edit-freight',
  templateUrl: './add-edit-freight.component.html',
  styleUrl: './add-edit-freight.component.scss'
})
export class AddEditFreightComponent implements OnInit {

  freightForm: FormGroup;
  freightData!: FreightDataModel;
  loadSpinner: boolean = true;
  freightId: number = 0;
  //locations: any = [];
  sources: any = [];
  locationCode: string = '';
  vehcileSizes: any = [];
  destinations: any = [];
  getData: any = [];
  locationId!:Number;
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  freightList: any = [];
  freightLocationId: number = 0;
  nocFileBase64 : any = '';
  nocFileName: string = '';
  isFileUploaded: boolean = false;
  statusValue: string = '';
  locationsDropdownData: any = [];
  plantsList: any = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private baseService: BaseService,
    private freightService: FreightService,
    private lookUpService: LookupService,
    private _Activatedroute: ActivatedRoute,
    private lookupService: LookupService,
    private plantService: PlantService,
    private modalService: NgbModal) {
    this.freightForm = this.formBuilder.group({
      freightCode: [''],
      locationCode: [undefined, [Validators.required]],
      source: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      vehicleSize: ['', [Validators.required]],
      freightAmount: ['', [Validators.required]],
      status: [{ value: 'Inactive'}, [Validators.required]],
      matApproval: [''],
      matApprovalOn: [''],
      accApproval: [''],
      accApprovalOn: [''],
      remarks: [''],
      newFreightAmount: ['']
    });
  }

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
    this.freightId = Number(this._Activatedroute.snapshot.paramMap.get("freightId"));
    this.freightId = this.freightId == 0 ? 0 : this.freightId;
    // this.baseService.lookupData.subscribe((res: any) => {
    //   this.locations = res.lookUps.filter((e: any) => e.code === 'LOC');
    // })
    if (this.freightId != 0) {
      this.getEditFreightData();
      this.loadSpinner = true;
    } else {
      this.loadSpinner = false;
    }

    // this.getSourceDropdownData();
    this.getDestinationDropdownData();
    this.getVehicleSizeDropdownData();
    this.setLocation();
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locationsDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active' && 
        this.commonLocations.some((location: any) => location.id === item.id));

    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
  }

  //FETCHING SELECTED FREIGHT'S DATA ON PAGE LOAD
  getFreightData(freightId: number) {
    this.loadSpinner = true;
    this.freightService.getFreightData(this.freightLocationId,freightId).subscribe((response: any) => {
      this.onChangeLocation(response?.locations?.id)
      this.statusValue = response.status
      this.loadSpinner = false;
      this.locationCode = response.locations.value;
      this.freightForm.patchValue({
        freightCode: response.freightCode,
        locationCode: response.locations.code,
        source: response.sourceId,
        destination: response.destinationId,
        vehicleSize: response.vehicleSizeId,
        freightAmount: response.freightAmount,
        status: response.status,
        matApproval: response.approvedByMaterial,
        matApprovalOn: response.approvedByMaterialOn,
        accApproval: response.approvedByAccounts,
        accApprovalOn: response.approvedByAccountsOn,
        remarks: response.remarks,
        
      });
      this.checkApprovalStatus(response.approvedByMaterialAction, response.approvedByAccountsAction, response.newFreightAmount, response.newFreightAmountStatus);

      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //FUNCTION TO HANDLE STATUS FIELD ON UPDATE
  checkApprovalStatus(approvedByMaterialAction: string, approvedByAccountsAction: string, newFreightAmount: any, newFreightAmountStatus: any ) {
    if ((approvedByAccountsAction == null || approvedByMaterialAction == null || approvedByMaterialAction.includes('Rejected') || approvedByAccountsAction.includes('Rejected'))) {
      this.freightForm.get('status')?.disable();
    } else {
      this.freightForm.get('status')?.enable();
    }
  }

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onPressSave() {
    this.loadSpinner = true;
    let data = {
      freightCode: this.freightForm.controls['freightCode'].value,
      locationCode: this.freightForm.controls['locationCode'].value,
      sourceId: (parseInt(this.freightForm.controls['source'].value)) || 0,
      destinationId: parseInt(this.freightForm.controls['destination'].value) || 0,
      vehicleSizeId: (parseInt(this.freightForm.controls['vehicleSize'].value)) || 0,
      freightAmount: parseInt(this.freightForm.controls['freightAmount'].value) || 0,
      status: this.freightForm.controls['status'].value,
      matApproval: null,
      matApprovalOn: null,
      accApproval: null,
      accApprovalOn: null,
      remarks: this.freightForm.controls['remarks'].value,
      actionBy: localStorage.getItem("userId"),
      fileName: this.nocFileName,
      fileData: this.nocFileBase64,
      newFreightAmount: parseInt(this.freightForm.controls['newFreightAmount'].value) || 0,
    }
    if (this.freightId > 0) {
      this.updateFreight(data);
    } else {
      this.createNewFreight(data);
    }
  }

  //UPDATING FREIGHT DATA
  updateFreight(data: any) {
    const locationCode = this.freightForm.controls['locationCode']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == this.locationCode);
    const matchedLocationId = matchedLocation?.id;
    this.freightService.updateFreight(matchedLocationId,this.freightId, data).subscribe((response: any) => {
      this.freightData = response;
      this.toastr.success('Freight Updated Successfully');
      this.router.navigate(['/master/freight']);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //CREATING NEW FREIGHT
  createNewFreight(data: any) {
    const locationCode = this.freightForm.controls['locationCode']?.value
    this.freightService.createFreight(locationCode,data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Freight Created Successfully');
      this.router.navigate(['/master/freight'])
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //REDIRECTING USER BACK TO FREIGHT LISTING SCREEN
  onCancelPress() {
    this.router.navigate(['master/freight']);
  }

  // getSourceDropdownData() {
  //   let data = {
  //     "CreationDate": "",
  //     "LastUpdatedBy": "",
  //     "LastUpdateDate": ""
  //   }
  //   const type = 'FreightCity'
  //   this.freightService.getDropdownData(data, type).subscribe((res: any) => {
  //     this.sources = res.lookUps.filter(
  //       (item: any) => item.status === 'Active')
  //   })
  // }

  getDestinationDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'FreightCity'
    this.freightService.getDropdownData(data, type).subscribe((res: any) => {
      this.destinations = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  getVehicleSizeDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'VehicleSize'
    this.freightService.getDropdownData(data, type).subscribe((res: any) => {
      this.vehcileSizes = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  setLocation(){
    if(!this.freightId){
      this.lookUpService.setLocationId(this.freightForm, this.commonLocations, 'locationCode');
    }
  }

  getEditFreightData() {
    let data = {
      "locationIds": APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "screenCode": 101,
      "freightCode": "",
      "source": "",
      "destination": "",
      "vehicleSize": ""
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
      this.getLocationId().then(() => {
        this.getFreightData(this.freightId);
      });
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const freight = this.freightList.filter((freight: any) => {
        return freight.id == this.freightId
      });
      if (freight.length > 0) {
        this.freightLocationId = freight[0].locations.id;
        resolve();
      } else {
        reject('No matching freight found');
      }
    });
  }

  
  onUploadPdf(evt: any) {
    const file = evt.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;
  
    if (file.size > maxSizeInBytes) {
      this.toastr.error('File size should be less than 5MB', 'Error');
      this.isFileUploaded = false;
      return;
    }
  
    this.nocFileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      this.nocFileBase64 = base64String;
      this.toastr.success('PDF attached successfully', 'Success');
      this.isFileUploaded = true;
    };
  }

  viewUploadedPdf() {
    if (this.nocFileBase64) {
        try {
            const base64Prefix = 'data:application/pdf;base64,';
            let base64Data = this.nocFileBase64;
            if (base64Data.startsWith(base64Prefix)) {
                base64Data = base64Data.substring(base64Prefix.length);
            }

            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, offset + 1024);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
            }

            const blob = new Blob(byteArrays, { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            const pdfWindow = window.open();
            if (pdfWindow) {
                pdfWindow.document.write(
                    `<iframe width="100%" height="100%" src="${blobUrl}" style="border:none;"></iframe>`
                );
            }
        } catch (error) {
            console.error('Error viewing PDF:', error);
        }
    }
}



  onChangeStatus(event: any){
    this.statusValue = event?.target?.value;
    if (this.statusValue === 'Active') {
      this.statusConfirmation();
    }
  }

  statusConfirmation(){
    let documentModal = this.modalService.open(StatusConfirmationComponent, {
      size: 'md',
      backdrop: 'static',
      windowClass: 'modal-width',
      centered: true
    });


    documentModal.result.then(
      (result) => {
        if (result) {
       
        }
      },
    );
  }

  onChangeLocation(event: any) {
    this.loadSpinner = true;
    let data = {
      locationIds: [event],
      plantCode: '',
      auCode: '',
      siteCode: '',
      status: '',
    };
    
    this.plantService.getPlants(data).subscribe(
      (response: any) => {
        this.plantsList = response.plants.filter(
          (plant: any, index: number, self: any[]) =>
            plant.freightCity !== null &&
            index === self.findIndex((p: any) => p.freightCity === plant.freightCity)
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }
  
}
