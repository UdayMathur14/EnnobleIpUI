import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BiltiService } from '../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BiltiListingModel } from '../../../../core/model/masterModels.model';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';

@Component({
  selector: 'app-add-edit-bilti',
  templateUrl: './add-edit-bilti.component.html',
  styleUrl: './add-edit-bilti.component.scss',
})
export class AddEditBiltiComponent implements OnInit {
  transporterMapCode: { [key: string]: string } = {};
  transporterMapName: { [key: string]: string } = {};
  vendorMapCode: { [key: string]: string } = {};
  vendorMapName: { [key: string]: string } = {};
  pointMapName: { [key: string]: string } = {};
  pointMapCharge: { [key: string]: string } = {};
  paidByDetailsMap: { [key: string]: string } = {};
  frlrList: any = [];
  transactionTypesLists: any = [];
  selectedTransactionType: string = '';
  frmTransactionData: any = [];
  vehiclesList: any = [];
  transportersList: any = [];
  loadSpinner: boolean = false;
  freightList: any = [];
  vendorList: any = [];
  pointChargesList: any = [];
  transactionTypeId: number = 0;
  transporterId: number = 0;
  vendorId: any;
  pointChargeId: number = 0;
  frlrNumber: any;
  freightId: number = 0;
  vehicleId: number = 0;
  frmId: number = 0;
  biltiId: number = 0;
  loadingLocationid: number = 0;
  biltiCreationLineItemsData: any = [];
  vehicleNumber: any;
  selectedTransactionTypeCode: string = '';
  selectedTransactionTypePatchCode: string = ''
  loadingLocation: any = [];
  filteredTransactionTypesLists: any = [];
  filteredVehiclesLists: any = [];
  filteredFreightsLists: any = [];
  filteredTransportersLists: any = [];
  filteredLoadinglocation: any = [];
  filteredVendorcode: any = [];
  filteredPointname: any = [];
  frmDocument: any = [];
  allFrmTransactionData: any = [];
  displayRows: any = [];
  pointName: string = '';
  biltiData!: BiltiListingModel;
  biltiForm!: FormGroup;
  biltiTransactionType: string= '';
  editDisplayrow:any = []
  lineItem:any = [];
  vendorName: any;
  dispatchNotes: any = [];
  matchedDispatchNotes:any = [];
  constructor(
    private router: Router,
    private biltiService: BiltiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private dispatchNoteService: DispatchNoteService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.biltiId = Number(this.activatedRoute.snapshot.paramMap.get('biltiId'));
    this.getAllTransportersList();
    this.getAllTransactionTypes();
    this.getAllFreightList();
    this.getAllVendorList();
    this.getAllPointChargesList();
    this.getLoadingLocationData();
    this.getVehicleNumber();
    this.getDispatchData();
    setTimeout(() => {
      if (this.biltiId > 0) {
        this.getBiltiData(this.biltiId);
      }
    },1000)
    this.initForm();
  }

  initForm() {
    this.biltiForm = this.fb.group({
        transactionType: new FormControl('', [Validators.required]),
        frlrNo: new FormControl('', [Validators.required]),
        vehicleNumber: new FormControl('', [Validators.required]),
        vehicleSize: new FormControl(null, [Validators.required]),
        source: new FormControl(''),
        destination: new FormControl(''),
        freightCode: new FormControl(''),
        freightAmount: new FormControl(null),
        transporterCode: new FormControl(''),
        transporterName: new FormControl(''),
        loadingLocation: new FormControl(),
        status: new FormControl('Active'),
        vendors: this.fb.array([])
    });
  }

  createVendorGroup(vendor: any): FormGroup {
    return this.fb.group({
      vendorCode: [''],
      vendorName: [''],
      pointName: [''],
      pointCharge: [''],
      remarks: [''],
      paidByDetails: [''],
      biltiStatus: ['Active'],
      biltiDetailsTransactionType: [''],
      documentrefNo: [''],
      dispatchNoteId: [0]
    });
  }

  onVendorCodeChange(event: any, index: number) {
    const vendorData = this.vendorList.find(
      (vendor: any) => 
      vendor?.id == event
    );
    const selectedVendorCode = vendorData;
    const cityId = vendorData.cityId;
    const pointCharges = this.pointChargesList.find(
      (pointCharge: any) => 
      pointCharge?.cityId === cityId
    );
    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    const vendorGroup = vendorsArray.at(index) as FormGroup;
    if (index > 0) {
      vendorGroup.patchValue({
        pointCharge: pointCharges?.sameLocationCharge,
      });
  } else {
      vendorGroup.patchValue({
          pointCharge: pointCharges?.pointCharge,
      });
  }
    vendorGroup.patchValue({
      vendorName: selectedVendorCode?.vendorName,
      pointName: pointCharges?.pointName,
      paidByDetails: selectedVendorCode?.paidByDetail?.value,
    });
  }
  
  getVendorControls() {
    return (this.biltiForm.get('vendors') as FormArray).controls;
  }

  onVendorCodeClear(index: number) {
    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    const vendorGroup = vendorsArray.at(index) as FormGroup;
  
    vendorGroup.patchValue({
      vendorCode: null,
      vendorName: null,
      pointCharge: null,
      pointName: null,
      paidByDetails: null
    });
  }


  onCancelPress() {
    this.router.navigate(['transaction/bilti']);
  }

  getAllTransactionTypes() {
    const data = {
      code: '',
    };
    this.biltiService.getTransactionTypes(data).subscribe(
      (response: any) => {
        this.transactionTypesLists = response.transactionTypes;
        this.filteredTransactionTypesLists = this.transactionTypesLists.filter(
          (transactionType: any) => transactionType.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }


  getFrlr(selectedTransactionType: string) {
    const data = {
      transactionType: selectedTransactionType,
    };
    this.biltiService.getFrmTransactions(data).subscribe(
      (response: any) => {
        this.allFrmTransactionData = response.frmTransactions
        this.frmTransactionData = [...new Set(response.frmTransactions.map((item: any) => 
          item.frlrNumber))].map(frlrNumber => response.frmTransactions.find((t: any) => 
            t.frlrNumber === frlrNumber));
        this.frlrList = response.transactionTypes;
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getDispatchData(dispatchNumber: string = "") {
    this.dispatchNoteService.getDispatchNote(dispatchNumber).subscribe((res: any) => {
      this.frmTransactionData = [...new Set(res.dispatchNotes.map((item: any) => 
        item.frlrNumber))].map(frlrNumber => res.dispatchNotes.find((t: any) => 
          t.frlrNumber === frlrNumber));
      this.dispatchNotes = res.dispatchNotes
      this.loadSpinner = false;
    })
  }
  
  onOptionSelected(selectedTransactionType: any) {
    this.transactionTypeId = selectedTransactionType.id;
    if(selectedTransactionType?.code == "RB"){
      this.getDispatchData();
    }else{
      this.getFrlr(selectedTransactionType.code);
    }
    this.patchTransactionType(selectedTransactionType.code);
  }
  
  patchTransactionType(value: any) {
    this.biltiTransactionType = value
    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    vendorsArray.controls.forEach((vendorGroup) => {
      vendorGroup.patchValue({
        biltiDetailsTransactionType: value,
      });
    });
  }

  onFrlrNoSelectionChange(selectedFrlr: any) {
    this.displayRows = [];
      this.dispatchNotes.forEach((element: any) => {
        const commonData = element?.frlrNumber == selectedFrlr?.frlrNumber
        if (commonData) {
            this.displayRows.push({
                documentrefNo: element?.dispatchNumber,
            });
        }
    });

    if(this.biltiTransactionType != 'RB'){
      this.allFrmTransactionData.forEach((element: any) => {
        const commonData = element?.frlrNumber == selectedFrlr?.frlrNumber
        if (commonData) {
            this.displayRows.push({
                documentrefNo: element.documentNumber,
            });
        }
    });
    
    }

    const vendorControls = this.displayRows.map((vendor: any) => this.createVendorGroup(vendor));
    this.biltiForm.setControl('vendors', this.fb.array(vendorControls));

    const selected = this.frmTransactionData.find(
      (data: any) => data.frlrNumber === selectedFrlr?.frlrNumber
  );

    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
      this.displayRows.forEach((row: any, index: number) => {
        const vendorGroup = vendorsArray.at(index) as FormGroup;
        vendorGroup.patchValue({
            documentrefNo: row.documentrefNo
        });
    });

    const selectedVehiclenumber = selectedFrlr?.vehicleNumber;
    const vehicleNumber = this.vehiclesList.find(
        (vehicle: any) => vehicle?.vehicleNumber === selectedVehiclenumber
    );
    this.vehicleId = vehicleNumber?.id;
    if (selected) {
        this.vehicleNumber = selected?.vehicleNumber;
        this.frlrNumber = selected?.frlrNumber;
        this.transporterId = selected?.transporterId;
        this.frmId = selected?.id;
        this.loadingLocationid = selected?.loadingLocationId;
        this.vehicleId = this.vehicleId;
        this.biltiForm.patchValue({
            vehicleNumber: vehicleNumber?.vehicleNumber,
            vehicleSize: vehicleNumber?.vehicleSize.value,
            transporterCode: this.transporterMapCode[selected.transporterId],
            transporterName: this.transporterMapName[selected.transporterId],
        });
    }
    if(this.biltiId == 0){
      this.patchTransactionType(this.biltiTransactionType)
    } else{
      this.patchTransactionType(this.selectedTransactionTypeCode)
    }
  
}

onFrlrNoClear() {
  this.biltiForm.patchValue({
    vehicleNumber: null,
    vehicleSize: null,
    transporterCode: null,
    transporterName: null,
  });
}

   getVehicleNumber() {
    const data = {
      vehicleNumber: '',
      transporterId: 0,
    };
     this.biltiService.getVehicleNo(data).subscribe(
      (response: any) => {
        this.vehiclesList = response.vehicles;
        this.filteredVehiclesLists = this.vehiclesList.filter(
          (vehicles: any) => vehicles.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getAllTransportersList() {
    const data = {
      transporterCode: '',
      transporterName: '',
    };
     this.biltiService.getTransporters(data).subscribe(
      (response: any) => {
        this.transportersList = response.transporters;
        this.filteredTransportersLists = this.transportersList.filter(
          (transporters: any) => transporters.status === 'Active'
        );
        response.transporters.forEach((transporter: any) => {
          this.transporterMapCode[transporter.id] = transporter.transporterCode;
          this.transporterMapName[transporter.id] = transporter.transporterName;
        });
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  onTransporterChange(data: any) {
    this.transportersList.forEach((transporter: any) => {
      if (transporter.transporterCode === data) {
        this.transporterId = transporter.id;
        this.biltiForm.patchValue({
          transporterName: transporter.transporterName,
        });
      }
    });
  }

  onTransporterClear() {
    this.biltiForm.patchValue({
      transporterName: null
    });
  }

  onVehicleChange(data: any) {
    this.vehicleId = data.id;
    this.biltiForm.patchValue({
      vehicleSize: data.vehicleSize.value,
    });
  }

  onVehicleClear() {
    this.biltiForm.patchValue({
      vehicleSize: null
    });
  }

  getAllFreightList() {
    const data = {
      freightCode: '',
      sourceId: 0,
      vehicleSizeId: 0,
    };
    this.biltiService.getFreightsList(data).subscribe(
      (response: any) => {
        this.freightList = response.freights;
        this.filteredFreightsLists = this.freightList.filter(
          (freight: any) => freight.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  onFreightChange(data: any) {
    this.freightId = data.id;
    this.biltiForm.patchValue({
      freightAmount: data?.freightAmount,
      source: data?.source?.value,
      destination: data?.destination?.value
    });
  }

  onFreightClear() {
    this.biltiForm.patchValue({
      source: null,
      destination: null,
      freightAmount: null,
    });
  }

  getAllVendorList() {
    const data = {
      vendorCode: '',
      vendorName: '',
    };
    this.biltiService.getVendors(data).subscribe(
      (response: any) => {
        this.vendorList = response.vendors;
        this.filteredVendorcode = this.vendorList.filter(
          (vendors: any) => vendors.status === 'Active'
        );
        this.pointChargesList.forEach((pointCharge: any) => {
          this.pointMapCharge[pointCharge.cityId] = pointCharge.pointCharge;
      });

        response.vendors.forEach((vendor: any) => {
          const cityId = vendor.cityId;
          this.vendorMapCode[vendor.vendorCode] = vendor.vendorCode;
          this.vendorMapName[vendor.vendorCode] = vendor.vendorName;
          this.pointMapName[vendor.vendorCode] = vendor.city.value;
          this.pointMapCharge[vendor.vendorCode] = this.pointMapCharge[cityId]
          this.paidByDetailsMap[vendor.vendorCode] = vendor.paidByDetail.value;
        });
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getAllPointChargesList() {
    let data = {
      pointName: '',
      locationIds:[]
    };
    this.biltiService.getPointCharges(data).subscribe(
      (response: any) => {
        this.pointChargesList = response.pointCharges;
        this.filteredPointname = this.pointChargesList.filter(
          (pointname: any) => pointname.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  onPressSave() {
    this.loadSpinner = true;
    const formData = this.biltiForm.value;
    const frlrNumber = formData?.frlrNo?.frlrNumber;
    if(this.biltiId > 0){
       this.matchedDispatchNotes = this.dispatchNotes.filter(
        (item: any) => item?.frlrNumber === this?.frlrNumber
      );
    } else{
      this.matchedDispatchNotes = this.dispatchNotes.filter(
        (item: any) => item?.frlrNumber === frlrNumber
      );
    }
    if (this.biltiId == 0) {
      const data = {
        actionBy: 1,
        transactionTypeId: this.transactionTypeId,
        frlrNumber: this.frlrNumber ?? '',
        transporterId: this.transporterId,
        freightId: this.freightId,
        loadingLocationId: this.biltiForm.controls['loadingLocation'].value,
        vehicleId: this.vehicleId,
        "attribute9": "2024-05-04T13:03:47.509Z",
        "attribute10": "2024-05-04T13:03:47.509Z",
        lineItemsEntity: [
          {
            actionBy: 0,
            vendorId: '',
            remarks: '',
            attribute9: '',
            attribute10: '',
            frmId: 0,
            dispatchNoteId: 0,
            documentReferenceNo: '',
          }
        ],
      };

      formData.vendors.forEach((vendorControl: any, index: number) => {
        const lineItem = {
          actionBy: 1,
          vendorId: vendorControl?.vendorCode,
          remarks: vendorControl?.remarks,
          attribute9: "2024-05-04T13:03:47.509Z",
          attribute10: "2024-05-04T13:03:47.509Z",
          frmId: formData.transactionType.code === 'RB' ? 0 : this.frmId,
          dispatchNoteId: formData.transactionType.code === 'RB' ? this.matchedDispatchNotes[index]?.id : 0,
          documentReferenceNo: vendorControl.documentrefNo,
        };
        if(data.lineItemsEntity[0].actionBy == 0){
          data.lineItemsEntity[0] = lineItem
        }else{
          data.lineItemsEntity.push(lineItem);
        }
      })
  
      
      this.biltiService.createBilti(data).subscribe(
        (response: any) => {
          this.biltiData = response;
          this.toastr.success('Bilti Created Successfully');
          this.loadSpinner = false;
          this.router.navigate(['transaction/bilti'])
        },
        (error) => {
          this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
    }  

    else {
      const data = {
        id: this.biltiId,
        actionBy: 1,
        frlrNumber: this.frlrNumber,
        transporterId: this.transporterId,
        freightId: this.freightId,
        loadingLocationId: this.biltiForm.controls['loadingLocation'].value,
        vehicleId: this.vehicleId,
        "attribute9": "2024-05-04T13:03:47.509Z",
        "attribute10": "2024-05-04T13:03:47.509Z",
        lineItemsEntity:  [
          {
          actionBy: 0,
          vendorId: '',
          remarks: '',
          attribute9: '',
          attribute10: '',
          status: '',
          id: 0,
          frmId: 0,
          dispatchNoteId: 0,
          documentReferenceNo: '',
        }
      ],
        status: this.biltiForm.controls['status'].value,
      };
      formData.vendors.forEach((vendorControl: any, index: number) => {
        const lineItem = {
          actionBy: 1,
          vendorId: vendorControl?.vendorCode,
          remarks: vendorControl?.remarks,
          attribute9: "2024-05-04T13:03:47.509Z",
          attribute10: "2024-05-04T13:03:47.509Z",
          status: vendorControl?.biltiStatus,
          id: 0,
          frmId: this.selectedTransactionTypePatchCode === 'RB' ? 0 : this.frmId,
          dispatchNoteId: this.selectedTransactionTypePatchCode === 'RB' ? this.matchedDispatchNotes[index]?.id : 0,
          documentReferenceNo: vendorControl.documentrefNo,
        };
        if(data.lineItemsEntity[0].actionBy == 0){
          data.lineItemsEntity[0] = lineItem
        }else{
          data.lineItemsEntity.push(lineItem);
        }
        if (this.lineItem.length > 1) {
          data.lineItemsEntity.forEach((item, index) => {
            item.id = this.lineItem[index].id;
          });
        } else if (this.lineItem.length === 1) {

          data.lineItemsEntity[0].id = this.lineItem[0].id;
        }
      })
      this.biltiService.updateBilti(this.biltiId, data).subscribe(
        (response: any) => {
          this.biltiData = response;
          this.toastr.success('Bilti Updated Successfully');
          this.loadSpinner = false;
          this.router.navigate(['transaction/bilti'])
        },
        (error) => {
          this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
    }
  }

  getLoadingLocationData() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'LoadingLocation';
    this.biltiService.getLoadingLocation(data, type).subscribe((res: any) => {
      this.loadingLocation = res.lookUps;
      this.filteredLoadinglocation = this.loadingLocation.filter(
        (locations: any) => locations.status === 'Active'
      );
    });
  }

  getBiltiData(biltiId: number) {
    this.loadSpinner = true;
    this.biltiService.getBiltiData(biltiId).subscribe(
      (response: any) => {
        this.lineItem = response.biltiCreationLineItems
        this.loadSpinner=false
        const transactionTypeId = response.transactionTypeId;
        const transactionType = this.transactionTypesLists.find(
          (type: any) => type.id === transactionTypeId
        );
        this.selectedTransactionTypeCode = transactionType.code
        const vehicleId = response.vehicleId;
        const vehicleNumber = this.vehiclesList.find(
          (vehicle: any) => vehicle.id === vehicleId
        );
        this.vehicleId = vehicleNumber?.id;
        const transporterId = response?.transporterId;
        const transporter = this.transportersList.find(
          (transporter: any) => transporter.id === transporterId
        );
        this.transporterId = transporter?.id;
        const freightId = response?.freightId;
        const freight = this.freightList.find(
          (freight: any) => freight?.id === freightId
        );
        this.freightId = freight?.id;
        const loadinglocationId = response?.loadingLocationId;
        const location = this.loadingLocation.find(
          (location: any) => location?.id === loadinglocationId
        );
        const pointChargeId = response?.biltiCreationLineItems[0]?.pointId;
        const pointCharge = this.pointChargesList.find(
          (pointCharge: any) => pointCharge?.id === pointChargeId
        );

        this.pointChargeId = pointCharge?.id;
        this.frlrNumber = response?.frlrNumber;
        this.frmId = response?.biltiCreationLineItems[0]?.frmId
        this.selectedTransactionTypePatchCode = transactionType?.code;
        this.displayRows = response.biltiCreationLineItems;
        const vendorControls = this.displayRows.map((vendor: any) => this.createVendorGroup(vendor));
        this.biltiForm.setControl('vendors', this.fb.array(vendorControls));
        const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    vendorsArray.controls.forEach((vendorGroup) => {
      vendorGroup.patchValue({
        biltiDetailsTransactionType:transactionType?.code,
      });
    });
    this.biltiCreationLineItemsData = response?.biltiCreationLineItems
    vendorsArray.controls.forEach((vendorGroup, index) => {
      const vendorId = this.biltiCreationLineItemsData[index]?.vendorId;
      this.vendorId = this.biltiCreationLineItemsData[index]?.vendorId;
      const remarks = this.biltiCreationLineItemsData[index]?.remarks;
      const biltiStatus = this.biltiCreationLineItemsData[index]?.status;
      const cityId = this.biltiCreationLineItemsData[index]?.vendor.cityDetail.id;
      const vendor = this.vendorList.find((vendor: any) => vendor.id === vendorId);
      const pointCharge = this.pointChargesList.find((pointCharge: any) => pointCharge.cityId === cityId);
      if (index > 0) {
        vendorGroup.patchValue({
          pointCharge: pointCharge?.sameLocationCharge,
        });
    } else {
        vendorGroup.patchValue({
            pointCharge: pointCharge?.pointCharge,
        });
    }
      vendorGroup.patchValue({
        vendorCode: vendor?.id,
        vendorName: vendor?.vendorName,
        pointName: vendor?.city.value,
        paidByDetails: vendor?.paidByDetail?.value,
        remarks: remarks,
        biltiStatus: biltiStatus,
      });
        vendorGroup.patchValue({
          documentrefNo: this.lineItem[index]?.documentReferenceNo,
        });
    });
        this.biltiForm.patchValue({
          transactionType: transactionType?.code,
          frlrNo: response?.frlrNumber,
          vehicleNumber: vehicleNumber?.vehicleNumber,
          vehicleSize: vehicleNumber?.vehicleSize.value,
          transporterCode: transporter?.transporterCode,
          transporterName: transporter?.transporterName,
          freightCode: freight?.freightCode,
          freightAmount: freight?.freightAmount,
          source: freight?.source?.value,
          destination: freight?.destination?.value,
          loadingLocation: location?.id,
        });
        if(this.selectedTransactionTypeCode == "RB"){
          this.getDispatchData();
        } else {
          this.getFrlr(this.selectedTransactionTypeCode);
        }
        

      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }
}
