import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { VendorService } from '../../../../core/service/vendor.service';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { BaseService } from '../../../../core/service/base.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant } from '../../../../core/constants';

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
  locations: any[] = APIConstant.locationsListDropdown;
  selectedParts: any = [];
  deletedParts: any[] = [];

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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
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

    setTimeout(() => {
      if (this.dispatchId > 0) {
        this.getDispatchData(this.dispatchId);
      }
    }, 1000);
  }

  initForm() {
    this.addOrEditDispatchNoteFormGroup = this.fb.group({
      locationId: '',
      supplierCode: [''],
      supplierName: [''],
      supplierAddress: [''],
      vehicleNumber: [''],
      vehicleSize: [''],
      frlrNumber: [''],
      status: ['Active'],
      partdetails: this.fb.array([]),
    });
  }

  createPartDetailsGroup() {
    const detail = this.fb.group({
      partId: [''],
      partNumber: [''],
      partName: [''],
      partSize: [''],
      partQuantity: [''],
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
      .getDispatchNoteById(this.locationId, dispatchId)
      .subscribe((response: any) => {
        this.loadSpinner = false;
        const vehicles = response.vehicles;
        const suppliers = response.suppliers;
        this.supplierId = suppliers.id;
        this.vehicleId = vehicles.id;
        this.dispatchNote.status = response.status;
        this.addOrEditDispatchNoteFormGroup.patchValue({
          vehicleNumber: vehicles.vehicleNumber,
          vehicleSize: vehicles.vehicleSize.value,
          supplierName: suppliers.vendorName,
          supplierCode: suppliers.vendorCode,
          frlrNumber: response.frlrNumber,
          supplierAddress: suppliers.vendorAddress1,
          status: response.status,
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
          }
        );
      });
  }

  mapQuantities(qtyId: any) {
    const lookupItem = this.lookupList.find((lookup) => qtyId === lookup.id);
    return lookupItem?.id;
  }

  private async getAllPartsListInit() {
    const data = {
      partNumber: '',
      partName: '',
    };
    await this.partService.getParts(data).subscribe(
      (response: any) => {
        this.partsList = response.parts;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllVehicles() {
    const data = {};
    await this.vehicleService.getVehicles(data).subscribe(
      (response: any) => {
        this.vehicleList = response.vehicles;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllVendors() {
    const data = {
      vendorCode: '',
      vendorName: '',
    };
    await this.vendorService.getVendors(data).subscribe(
      (response: any) => {
        this.supplierList = response.vendors;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  private async getAllLookups() {
    let data = {
      type: 'PartQuantity',
    };
    await this.lookupService.getDropdownData(data.type).subscribe(
      (response: any) => {
        this.lookupList = response.lookUps;
      },
      (error: any) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      }
    );
  }

  onCancelPress() {
    this.router.navigate(['transaction/dispatchNote']);
  }

  private dispatchNoteInit() {
    this.dispatchNote = {
      actionBy: 1,
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
      id: this.dispatchId
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
        actionBy: 1,
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
    this.partDetails.controls.splice(i, 1);
}


  onPartSelect(data: any, i: number) {
    console.log(data);
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
    return this.partsList.filter(
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
    this.loadSpinner = true;
    this.dispatchNote.supplierId = this.supplierId;
    this.dispatchNote.vehicleId = this.vehicleId;
    this.dispatchNote.frlrNumber = this.addOrEditDispatchNoteFormGroup.controls[
      'frlrNumber'
    ].value as string;

    const detailsArray = this.addOrEditDispatchNoteFormGroup.get(
      'partdetails'
    ) as FormArray;

    if (this.dispatchId > 0) {
      this.dispatchNote.partDetails = [];
      for (let i = 0; i < detailsArray.length; i++) {
        const dg = detailsArray.at(i) as FormGroup;
        let note = {
          actionBy: 1,
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
        };
        this.dispatchNote.partDetails.push(note);
      }
      this.dispatchNote.partDetails = [...this.dispatchNote.partDetails, ...this.deletedParts];

      this.dispatchNoteService
        .updateDispatchNote(this.locationId, this.dispatchId, this.dispatchNote)
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
          actionBy: 1,
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
        .createDispatchNote(this.dispatchNote)
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
}
