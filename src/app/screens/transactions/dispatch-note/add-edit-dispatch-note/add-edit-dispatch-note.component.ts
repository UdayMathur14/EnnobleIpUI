import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { VendorService } from '../../../../core/service/vendor.service';
import { DispatchNoteModel } from '../../../../core/model/masterModels.model';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { BaseService } from '../../../../core/service/base.service';
import { LookupTypeService } from '../../../../core/service/lookup-type.service';
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
  partsList: any;
  allPartsNames: string[] = [];
  vehicleList: any[] = [];
  allVehiclNumbers: string[] = [];
  dispatchNote!: DispatchNoteModel;
  supplierList: any[] = [];
  partDetailsList: any[] = [];
  supplierId!: number;
  vehicleId!: number;
  partQtyId: number = 0;
  lookupList: any[] = [];

  constructor(
    private router: Router,
    private partService: PartService,
    private toastr: ToastrService,
    private vehicleService: VehicleService,
    private vendorService: VendorService,
    private dispatchNoteService: DispatchNoteService,
    private baseService: BaseService,
    private lookuptypeService: LookupTypeService,
    private lookupService: LookupService
  ) {}

  ngOnInit() {
    this.getAllPartsListInit();
    this.getAllVehicles();
    this.getAllVendors();
    this.dispatchNoteInit();
    this.getAllLookups();
  }

  private async getAllPartsListInit() {
    const data = {
      partNumber: '',
      partName: '',
    };
    await this.partService.getParts(data).subscribe(
      (response: any) => {
        this.partsList = response.parts;
        console.log(this.partsList);
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
        console.log(response.lookUps);
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
      actionBy: 0,
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
          console.log(vehicle);
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
          console.log(supplier);
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
    console.log('delete index ', i);
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
          console.log(part.id);
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
