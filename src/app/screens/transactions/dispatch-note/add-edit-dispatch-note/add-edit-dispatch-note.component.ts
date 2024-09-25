import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { VendorService } from '../../../../core/service/vendor.service';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { BaseService } from '../../../../core/service/base.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant } from '../../../../core/constants';
import { TransporterService } from '../../../../core/service/transporter.service';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-dispatch-note',
  templateUrl: './add-edit-dispatch-note.component.html',
  styleUrl: './add-edit-dispatch-note.component.scss',
})
export class AddEditDispatchNoteComponent {
  addOrEditDispatchNoteFormGroup!: FormGroup;

  partNum: string | undefined;
  partsList: any[] = [];
  allPartsNames: string[] = [];
  vehicleList: any[] = [];
  allVehiclNumbers: string[] = [];
  dispatchNote!: any;
  supplierList: any[] = [];
  partDetailsList: any[] = []; //just to show part data on table
  supplierId!: number;
  vehicleId!: number;
  partQtyId: number = 0;
  lookupList: any[] = [];
  selectedPartNumber!: string;
  selectedQuantity!: number;
  dispatchId: number = 0;
  loadSpinner: boolean = false;
  locationId!: Number;
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  selectedParts: any = [];
  deletedParts: any[] = [];
  activeSuppliersLists: any[] = [];
  activeVehiclesLists: any[] = [];
  activePartsLists: any[] = [];
  dispatchNotes: any = [];
  dispatchLocationId: number = 0;
  transportersList: any = [];
  activeTransportersList: any = [];
  // frlrDate!: NgbDateStruct | null;
  today = inject(NgbCalendar).getToday();
  frlrDate: string = '';
  vehicleData: any = [];
  transporterMode: any = [];
  filteredTransporter: any = [];
  filteredVehicles: any = [];
  locationsDropdownData: any = [];

  constructor(
    private router: Router,
    private partService: PartService,
    private toastr: ToastrService,
    private vehicleService: VehicleService,
    private vendorService: VendorService,
    private dispatchNoteService: DispatchNoteService,
    private baseService: BaseService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private transporterService: TransporterService
  ) { }

  ngOnInit() {
    this.getCommonLocations();
    this.getLocations();
    this.initForm();
    this.dispatchId = Number(
      this.activatedRoute.snapshot.paramMap.get('dispatchId')
    );
    const locationId = this.activatedRoute.snapshot.paramMap.get('locationId');
    if(locationId){
      this.locationId = Number(locationId);
    }
    this.getAllPartsListInit();
    this.getAllVehicles();
    this.getAllVendors();
    this.dispatchNoteInit();
    this.getAllLookups();
    this.getTransportersList();
    this.setLocation();

    setTimeout(() => {
      if (this.dispatchId > 0) {
        this.getEditData();
      }
    }, 1000);
  }

  initForm() {
    this.addOrEditDispatchNoteFormGroup = this.fb.group({
      locationId: '',
      supplierCode: ['', [Validators.required]],
      supplierName: [''],
      supplierAddress: [''],
      vehicleNumber: ['', [Validators.required]],
      vehicleSize: [''],
      frlrNumber: [''],
      status: ['Active'],
      transporterCode: ['', [Validators.required]],
      transporterName: [''],
      transporterMode: [''],
      frlrDate: [''],
      partdetails: this.fb.array([], Validators.required),
    });
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

  createPartDetailsGroup() {
    const detail = this.fb.group({
      partId: [''],
      partNumber: ['', [Validators.required]],
      partName: [''],
      partSize: [''],
      partQuantity: ['', [Validators.required]],
      remarks: [''],
      status: ['Active'],
      id: [0]
    });

    this.partDetails.push(detail);
  }

  get partDetails(): FormArray {
    return this.addOrEditDispatchNoteFormGroup.get('partdetails') as FormArray;
  }

  async getDispatchData(dispatchId: number) {
    this.loadSpinner = true
    await this.dispatchNoteService
      .getDispatchNoteById(this.dispatchLocationId, dispatchId)
      .subscribe((response: any) => {
        this.onLocationSelect(response.locationId);
        this.loadSpinner = false;
        const vehicles = response.vehicles;
        const suppliers = response.suppliers;
        this.supplierId = suppliers.id;
        this.vehicleId = vehicles.id;
        const frlrDate = this?.convertToNgbDate(response?.frlrDate)
        this.frlrDate = response?.frlrDate
        this.dispatchNote.status = response.status;
        this.addOrEditDispatchNoteFormGroup.patchValue({
          vehicleNumber: vehicles.vehicleNumber,
          vehicleSize: vehicles.vehicleSize.value,
          supplierName: suppliers.vendorName,
          supplierCode: suppliers.vendorCode,
          frlrNumber: response.frlrNumber,
          supplierAddress: suppliers.vendorAddress1,
          status: response.status,
          locationId: response.locations.code,
          transporterCode: response.transporterId,
          transporterName: response.transporter.transporterName,
          transporterMode: response?.transporterMode,
          frlrDate: frlrDate,
        });

        response?.dispatchNotePartItems?.forEach(
          (partItem: any, index: number) => {
            this.createPartDetailsGroup();
            const partDetailsGroup = this.partDetails.at(index) as FormGroup;
            partDetailsGroup.patchValue({
              partNumber: partItem.parts.partNumber,
              partName: partItem.parts.partName,
              partId: partItem.parts.id,
              partSize: partItem.parts.partSize,
              remarks: partItem.parts.remarks,
              partQuantity: partItem.partsQty,
              status: partItem.status,
              id: partItem.id
            });
            const selectedPartNumbers = this.partDetails.controls.map(control => control.value.partNumber);
            this.initializeSelectedParts(selectedPartNumbers)
            const transporters = this.transportersList.find((item: any) => {
              return item.id == response?.transporterId;
             })
             this.vehicleData = this.vehicleList?.filter((item: any) => item?.transporterEntity?.id == response?.transporterId);
             this.transporterMode = transporters?.transporterMappings?.map((item: any) => item.transportationMode)
          }
        );
      }, error => {
        // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      });
  }

  mapQuantities(qtyId: any) {
    const lookupItem = this.lookupList.find((lookup) => qtyId === lookup.id);
    return lookupItem?.id;
  }

  private async getAllPartsListInit() {
    this.loadSpinner = true;
    const data = {
      partNumber: '',
      partName: '',
    };
    await this.partService.getParts(data).subscribe(
      (response: any) => {
        this.partsList = response.parts;
        this.activePartsLists = this.partsList.filter(
          (parts: any) => parts.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllVehicles() {
    this.loadSpinner = true;
    const data = {};
    await this.vehicleService.getVehicles(data).subscribe(
      (response: any) => {
        this.vehicleList = response.vehicles;
        this.activeVehiclesLists = this.vehicleList.filter(
          (vehicle: any) => vehicle.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllVendors() {
    this.loadSpinner = true;
    const data = {
      vendorCode: '',
      vendorName: '',
    };
    await this.vendorService.getVendors(data).subscribe(
      (response: any) => {
        this.supplierList = response.vendors;
        this.activeSuppliersLists = this.supplierList.filter(
          (supplier: any) => supplier.status === 'Active' || supplier.status === 'ACTIVE'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllLookups() {
    this.loadSpinner = true;
    let data = {
      type: 'PartQuantity',
    };
    await this.lookupService.getDropdownData(data.type).subscribe(
      (response: any) => {
        this.lookupList = response.lookUps.filter(
          (item: any) => item.status === 'Active');
        this.loadSpinner = false;
      },
      (error: any) => {
        this.loadSpinner = false;
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  onCancelPress() {
    this.router.navigate(['transaction/dispatchNote']);
  }

  private dispatchNoteInit() {
    this.dispatchNote = {
      actionBy: localStorage.getItem("userId"),
      attribute1: '',
      attribute2: '',
      attribute3: '',
      attribute4: '',
      attribute5: 0,
      attribute6: 0,
      attribute7: 0,
      attribute8: 0,
      attribute9: new Date(),
      attribute10: new Date(),
      frlrNumber: '',
      supplierId: 0,
      vehicleId: 0,
      partDetails: [],
      id: this.dispatchId,
      transporterId: 0,
      frlrDate: '',
      transporterMode: ''
    };
  }

  onVehicleNumberSelection(event: any) {
    const vehicleNumber = event;
    if (!!vehicleNumber) {
      this.vehicleList.forEach((vehicle) => {
        if (vehicle.vehicleNumber === vehicleNumber) {
          this.addOrEditDispatchNoteFormGroup.patchValue({
            vehicleSize: vehicle?.vehicleSize?.value,
          });
          this.vehicleId = vehicle.id;
        }
      });
    }
  }

  onVehicleNumberClear() {
    this.addOrEditDispatchNoteFormGroup.patchValue({
      vehicleSize: null,
    });
  }

  onSupplierCodeSelection(event: any) {
    const supplierCode = event;
    if (!!supplierCode) {
      this.supplierList.forEach((supplier) => {
        if (supplier.vendorCode === supplierCode) {
          this.addOrEditDispatchNoteFormGroup.patchValue({
            supplierName: supplier.vendorName,
            supplierAddress: supplier.vendorAddress1,
          });
          this.supplierId = supplier.id;
        }
      });
    }
  }

  onSupplierCodeClear() {
    this.addOrEditDispatchNoteFormGroup.patchValue({
      supplierName: null,
      supplierAddress: null,
    });
  }

  onDeletePartDetail(part: any, i: number) {
    const deletedPart = {
        actionBy: localStorage.getItem("userId"),
        attribute9: new Date(),
        attribute10: new Date(),
        partId: part.value.partId,
        partQty: part.value.partQuantity,
        status: 'Inactive',
        id: part.value.id,
    };
    if (this.dispatchId > 0 && deletedPart.id != 0) {
        this.deletedParts.push(deletedPart);
    }
    this.partDetails.removeAt(i);
    const partNumber = part.value.partNumber;
    const index = this.selectedParts.indexOf(partNumber);
    if (index > -1) {
        this.selectedParts.splice(index, 1);
    }
    this.updateSelectedParts(this.selectedParts);
}


  onPartSelect(data: any, i: number) {
    const detailsArray = this.addOrEditDispatchNoteFormGroup.get('partdetails') as FormArray;
    const detailsGroup = detailsArray.at(i) as FormGroup;

    detailsGroup.patchValue({
      partId: data?.id,
      partNumber: data?.partNumber,
      partName: data?.partName,
      partSize: data?.partSize,
      remarks: data?.remarks
    });
    const selectedPartNumbers = detailsArray.controls.map(control => control.value.partNumber);
    this.updateSelectedParts(selectedPartNumbers);
  }

  getFilteredPartNumbers(index: number) {
    return this.activePartsLists.filter(
      (parts: any) =>
        !this.selectedParts.includes(parts.partNumber)
    );
  }

  updateSelectedParts(selectedPartNumbers: string[]) {
    this.selectedParts = selectedPartNumbers;
  }


  initializeSelectedParts(selectedPartNumbers: string[]) {
    this.selectedParts = selectedPartNumbers;
  }

  onQuantitySelection(quantity: any, i: number) {
    const detailsArray = this.addOrEditDispatchNoteFormGroup.get(
      'partdetails'
    ) as FormArray;
    const detailsGroup = detailsArray.at(i) as FormGroup;
    detailsGroup.patchValue({
      partQuantity: quantity,
    });
  }

  async onSavePress() {
    const locationCode = this.addOrEditDispatchNoteFormGroup.controls['locationId']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == locationCode);
    const matchedLocationId = matchedLocation?.id
    this.loadSpinner = true;
    this.dispatchNote.supplierId = this.supplierId;
    this.dispatchNote.vehicleId = this.vehicleId;
    this.dispatchNote.frlrNumber = this.addOrEditDispatchNoteFormGroup.controls[
      'frlrNumber'
    ].value as string || '';
    this.dispatchNote.transporterId = this.addOrEditDispatchNoteFormGroup.controls['transporterCode']?.value,
    this.dispatchNote.frlrDate = this.frlrDate || null,
    this.dispatchNote.transporterMode = this.addOrEditDispatchNoteFormGroup.controls['transporterMode']?.value

    const detailsArray = this.addOrEditDispatchNoteFormGroup.get(
      'partdetails'
    ) as FormArray;

    if (this.dispatchId > 0) {
      this.dispatchNote.partDetails = [];
      for (let i = 0; i < detailsArray.length; i++) {
        const dg = detailsArray.at(i) as FormGroup;
        let note = {
          actionBy: localStorage.getItem("userId"),
          attribute1: '',
          attribute2: '',
          attribute3: '',
          attribute4: '',
          attribute5: 0,
          attribute6: 0,
          attribute7: 0,
          attribute8: 0,
          attribute9: new Date(),
          attribute10: new Date(),
          partId: dg.controls['partId'].value,
          partQty: parseInt(dg.controls['partQuantity'].value),
          status: dg.controls['status'].value,
          id: dg.controls['id'].value || 0,
          dispatchNoteid: this.dispatchId
        };
        this.dispatchNote.partDetails.push(note);
      }
      this.dispatchNote.partDetails = [...this.dispatchNote.partDetails, ...this.deletedParts];

      this.dispatchNoteService
        .updateDispatchNote(matchedLocationId, this.dispatchId, this.dispatchNote)
        .subscribe(
          (response: any) => {
            this.toastr.success('Dispatch Note Updated Successfully');
            this.loadSpinner = false;
            this.router.navigate(['transaction/dispatchNote'])
          },
          (error) => {
            this.loadSpinner = false;
            //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          }
        );
    } else {
      this.dispatchNote.partDetails = [];
      for (let i = 0; i < detailsArray.length; i++) {
        const dg = detailsArray.at(i) as FormGroup;
        let note = {
          actionBy: localStorage.getItem("userId"),
          attribute1: '',
          attribute2: '',
          attribute3: '',
          attribute4: '',
          attribute5: 0,
          attribute6: 0,
          attribute7: 0,
          attribute8: 0,
          attribute9: new Date(),
          attribute10: new Date(),
          partId: dg.controls['partId'].value,
          partQty: parseInt(dg.controls['partQuantity'].value),
          status: "Active",
        };
        this.dispatchNote.partDetails.push(note);
      }

      await this.dispatchNoteService
        .createDispatchNote(locationCode,this.dispatchNote)
        .subscribe(
          (response: any) => {
            this.dispatchNote = response;
            this.toastr.success('Dispatch Created Successfully');
            this.loadSpinner = false;
            this.router.navigate(['transaction/dispatchNote']);
          },
          (error) => {
            this.loadSpinner = false;
            //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          }
        );
    }
  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true;
  }

  isFormInvalid() {
    return !this.addOrEditDispatchNoteFormGroup.controls['locationId']?.value 
    || !this.addOrEditDispatchNoteFormGroup.controls['supplierCode']?.value ||
    !this.addOrEditDispatchNoteFormGroup.controls['transporterCode']?.value ||
    !this.addOrEditDispatchNoteFormGroup.controls['transporterMode']?.value ||
    !this.addOrEditDispatchNoteFormGroup.controls['vehicleNumber']?.value
  }

  setLocation(){
    if(!this.vehicleId){
      this.lookupService.setLocationId(this.addOrEditDispatchNoteFormGroup, this.commonLocations, 'locationId');
    }
  }

  getEditData(dispatchNumber: string = "", locationIds: any[] = []) {
    this.loadSpinner = true;
    this.dispatchNoteService.getDispatchNote({ dispatchNumber, locationIds }).subscribe((res: any) => {
      this.dispatchNotes = res.dispatchNotes;
      this.getLocationId().then(() => {
        this.getDispatchData(this.dispatchId);
      });
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dispatchNote = this.dispatchNotes.filter((item: any) => {
        return item?.id == this.dispatchId
      });
      if (dispatchNote.length > 0) {
        this.dispatchLocationId = dispatchNote[0].locations.id;
        resolve();
      } else {
        reject('No matching dispatch note found');
      }
    });
  }

  getTransportersList() {
    let data = {
      "locationIds": APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "transporterCode": "",
      "transporterName": "",
      "city": "",
      "state": "",
      "taxationType": ""
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.activeTransportersList = this.transportersList.filter(
        (items: any) => items.status === 'Active'
      );
      this.loadSpinner = false;
    }, error => {
      // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onTransporterSelection(data: any){
    this.addOrEditDispatchNoteFormGroup.patchValue({
      transporterMode: null,
      vehicleNumber: null
    })
    const transporters = this.transportersList.find((item: any) => {
     return item.id == data;
    })
    this.vehicleData = this.vehicleList?.filter((item: any) => item?.transporterEntity?.id == data);
    this.transporterMode = transporters?.transporterMappings?.map((item: any) => item.transportationMode);
    
    if(this.transporterMode.length <=1){
      this.addOrEditDispatchNoteFormGroup.patchValue({
        transporterMode: this.transporterMode[0]?.code
      })
    }
    this.addOrEditDispatchNoteFormGroup.patchValue({
      transporterName: transporters?.transporterName
    })
   
  }

  onDateSelect(type: string, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
      this.frlrDate = e.year + '-' + month.toString() + '-' + day.toString();
  }

  convertToNgbDate(dateString: string): any {
    if(dateString){
      const dateParts = dateString?.split('-');
      return new NgbDate(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10),
        parseInt(dateParts[2], 10)
      );
    }
    }

    onLocationSelect(event: any){
      this.filteredTransporter = this.activeTransportersList.filter((item: any) => item?.locations?.id == event);
      this.filteredVehicles = this.activeVehiclesLists.filter((item: any) => item?.locations?.id == event);
      this.addOrEditDispatchNoteFormGroup.patchValue({
        transporterCode: null,
        transporterName: null
      })

      this.addOrEditDispatchNoteFormGroup.patchValue({
        vehicleNumber: null,
        vehicleSize: null
      })
    }

}
