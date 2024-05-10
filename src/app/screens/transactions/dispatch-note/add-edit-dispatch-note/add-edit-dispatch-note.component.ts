import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { VendorService } from '../../../../core/service/vendor.service';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { BaseService } from '../../../../core/service/base.service';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-dispatch-note',
  templateUrl: './add-edit-dispatch-note.component.html',
  styleUrl: './add-edit-dispatch-note.component.scss',
})
export class AddEditDispatchNoteComponent {
  addOrEditDispatchNoteFormGroup = new FormGroup({
    supplierCode: new FormControl(''),
    supplierName: new FormControl(''),
    supplierAddress: new FormControl(''),
    vehicleNumber: new FormControl(''),
    vehicleSize: new FormControl(''),
    frlrNumber: new FormControl(''),
  });

  partNum: string | undefined;
  partsList: any[] = [];
  allPartsNames: string[] = [];
  vehicleList: any[] = [];
  allVehiclNumbers: string[] = [];
  dispatchNote!: any;
  supplierList: any[] = [];
  partDetailsList: any[] = [];               //just to show part data on table
  supplierId!: number;
  vehicleId!: number;
  partQtyId: number = 0;
  lookupList: any[] = [];
  selectedPartNumber!: string;
  selectedQuantity!: number;
  dispatchId: number = 0;

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
  ) {}

  ngOnInit() {
    this.dispatchId = Number(this.activatedRoute.snapshot.paramMap.get('dispatchId'));
    this.getAllPartsListInit();
    this.getAllVehicles();
    this.getAllVendors();
    this.dispatchNoteInit();
    this.getAllLookups();

      if (this.dispatchId > 0) {
        this.getDispatchData(this.dispatchId);
      }
  }
  getDispatchData(dispatchId: number) {
    this.dispatchNoteService.getDispatchNoteById(dispatchId).subscribe((response: any) => {
      if (response.dispatchNotePartItems[0]) {
        this.selectedPartNumber = response.dispatchNotePartItems[0].parts.partNumber;
        this.selectedQuantity = response.dispatchNotePartItems[0].partsQty.value;
      }
      const vehicles = response.vehicles
      const suppliers = response.suppliers

      this.addOrEditDispatchNoteFormGroup.patchValue({
        vehicleNumber: vehicles.vehicleNumber,
        vehicleSize: vehicles.vehicleSize.value,
        supplierName: suppliers.vendorName,
        supplierCode: suppliers.vendorCode,
        frlrNumber: response.frlrNumber,
        supplierAddress: suppliers.vendorAddress1
      });
      this.supplierId = suppliers.id;
      this.vehicleId = vehicles.id
      
      this.dispatchNote.supplierId = response?.supplierId
      this.dispatchNote.vehicleId = response.vehicleId
      this.dispatchNote.frlrNumber = response.frlrNumber
      this.dispatchNote.status = response.status
      this.dispatchNote.partDetails = response.dispatchNotePartItems.map(mapPartDetails);
      this.partDetailsList = response.dispatchNotePartItems.map((item: any) => item.parts);
    })
    function mapPartDetails(partItem: any){
      let partData = {
        actionBy: 1,
        attribute1: partItem.parts.attribute1,
        attribute2: partItem.parts.attribute2,
        attribute3: partItem.parts.attribute3,
        attribute4: partItem.parts.attribute4,
        attribute5: partItem.parts.attribute5,
        attribute6: partItem.parts.attribute6,
        attribute7: partItem.parts.attribute7,
        attribute8: partItem.parts.attribute8,
        attribute9: partItem.parts.attribute9,
        attribute10: partItem.parts.attribute10,
        partId: partItem.parts.id,
        partQtyId: partItem.partsQty.id,
        dispatchNoteid: dispatchId,
        status: partItem.status
      }
  
      return partData;
    }

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
        this.toastr.error(error.statusText, error.status);
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
        this.toastr.error(error.statusText, error.status);
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
        this.toastr.error(error.statusText, error.status);
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
        this.toastr.error(error.statusText, error.status);
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
      partDetails: undefined,
    };
  }

  partDetails: any[] = [];

  onAddPress() {
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
      partId: 0,
      partQtyId: 0,
    };
    if (!this.dispatchNote.partDetails) {
      this.dispatchNote.partDetails = [note];
    } else {
      this.dispatchNote?.partDetails?.push(note);
    }
    this.partDetailsList.push({});
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

  onDeletePartDetail(part: any, i: number) {
    if (this.dispatchNote.partDetails != undefined) {
      this.dispatchNote.partDetails?.splice(i, 1);
      this.partDetailsList.splice(i, 1);
    }
  }

  onPartSelect(e: any, i: number) {
    this.partsList.forEach((part: any) => {
      if (part.partNumber === e) {
        this.partDetailsList[i] = part;
        if (this.dispatchNote?.partDetails != undefined) {
          this.dispatchNote.partDetails[i].partId = part.id;
        }
      }
    });
  }

  onQuantitySelection(e: any, i: number) {
    if (this.dispatchNote?.partDetails != undefined) {
      this.dispatchNote.partDetails[i].partQtyId = e;
    }
  }

  async onSavePress() {
    this.dispatchNote.supplierId = this.supplierId;
    this.dispatchNote.vehicleId = this.vehicleId;
    this.dispatchNote.frlrNumber = this.addOrEditDispatchNoteFormGroup.controls
      .frlrNumber.value as string;

      if (this.dispatchId > 0) {
        this.dispatchNoteService.updateDispatchNote(this.dispatchId, this.dispatchNote).subscribe(
          (response: any) => {
            this.dispatchNote = response;
            this.toastr.success('Dispatch Updated Successfully');
            this.baseService.plantSpinner.next(false);
            this.router.navigate(['transaction/dispatchNote']);
          },
          (error) => {
            this.toastr.error(error.statusText, error.status);
            this.baseService.plantSpinner.next(false);
          }
        );
      }else{
        await this.dispatchNoteService
          .createDispatchNote(this.dispatchNote)
          .subscribe(
            (response: any) => {
              this.dispatchNote = response;
              this.toastr.success('Dispatch Created Successfully');
              this.baseService.plantSpinner.next(false);
              
            },
            (error) => {
              this.toastr.error(error.statusText, error.status);
              this.baseService.plantSpinner.next(false);
            }
          );

      }

  }
}
