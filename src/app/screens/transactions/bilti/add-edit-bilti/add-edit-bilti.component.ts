import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BiltiService } from '../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BiltiListingModel } from '../../../../core/model/masterModels.model';

@Component({
  selector: 'app-add-edit-bilti',
  templateUrl: './add-edit-bilti.component.html',
  styleUrl: './add-edit-bilti.component.scss',
})
export class AddEditBiltiComponent implements OnInit {
  transporterMapCode: { [key: string]: string } = {};
  transporterMapName: { [key: string]: string } = {};
  vehicleMapId: { [key: string]: string } = {};
  frlrList: any = [];
  transactionTypesLists: any = [];
  selectedTransactionType: string = '';
  frmTransactionData: any = [];
  vehiclesList: any = [];
  transportersList: any = [];
  loadSpinner: boolean = true;
  freightList: any = [];
  vendorList: any = [];
  pointChargesList: any = [];
  transactionTypeId: number = 0;
  transporterId: number = 0;
  vendorId: number = 0;
  pointChargeId: number = 0;
  frlrNumber: any;
  freightId: number = 0;
  vehicleId: number = 0;
  frmId: number = 0;
  biltiId: number = 0;
  loadingLocationid: number = 0;
  frmdocumentId: number = 0;
  vehicleNumber: any;
  selectedTransactionTypeCode: string = '';
  loadingLocation: any = [];
  filteredTransactionTypesLists: any = [];
  filteredVehiclesLists: any = [];
  filteredFreightsLists: any = [];
  filteredTransportersLists: any = [];
  filteredLoadinglocation: any = [];
  filteredVendorcode: any = [];
  filteredPointname: any = [];
  frmDocument: any = [];
  biltiData!: BiltiListingModel;
  biltiForm = new FormGroup({
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
    biltiDetailsTransactionType: new FormControl(''),
    documentrefNo: new FormControl(''),
    vendorCode: new FormControl(''),
    vendorName: new FormControl(''),
    pointName: new FormControl(''),
    pointCharge: new FormControl(''),
    remarks: new FormControl(''),
    paidByDetails: new FormControl(''),
    loadingLocation: new FormControl(),
    status: new FormControl('Active'),
    biltiStatus: new FormControl('Active'),
  });
  constructor(
    private router: Router,
    private biltiService: BiltiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
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
    setTimeout(() => {
      if (this.biltiId > 0) {
        this.getBiltiData(this.biltiId);
      }
    },500)
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
        this.toastr.error(error.statusText, error.status);
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
        console.log(response)
        this.frmTransactionData = response.frmTransactions;
        this.frlrList = response.transactionTypes;
        this.frmDocument = this.frmTransactionData.find(
          (frmDocument: any) => frmDocument?.id ===this.frmdocumentId
        );
        if(this.biltiId>0){
        this.biltiForm.patchValue({
          documentrefNo: this.frmDocument?.documentNumber
        })
        }

        console.log(this.frmDocument)
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }

  onOptionSelected(selectedTransactionType: any) {
    this.transactionTypeId = selectedTransactionType.id;
    this.getFrlr(selectedTransactionType.code);
    this.biltiForm.patchValue({
      biltiDetailsTransactionType: selectedTransactionType.code,
    });
  }

  onFrlrNoSelectionChange(selectedFrlr: any) {
    const selected = this.frmTransactionData.find(
      (data: any) => data.frlrNumber === selectedFrlr.frlrNumber
    );
    if (selected) {
      this.vehicleNumber = selected?.vehicleNumber;
      this.frlrNumber = selected?.frlrNumber;
      this.transporterId = selected?.transporterId;
      this.frmId = selected?.id;
      this.loadingLocationid = selected?.loadingLocationId;
      this.vehicleId = selected?.id;
      this.biltiForm.patchValue({
        vehicleNumber: selected.vehicleNumber,
        vehicleSize: selected.vehicleSizeId,
        source: selected.fromDestination,
        destination: selected.toDestination,
        documentrefNo: selected.documentNumber,
        transporterCode: this.transporterMapCode[selected.transporterId],
        transporterName: this.transporterMapName[selected.transporterId],
      });
    }
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
        this.toastr.error(error.statusText, error.status);
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
        this.toastr.error(error.statusText, error.status);
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

  onVehicleChange(data: any) {
    this.vehicleId = data.id;
    this.biltiForm.patchValue({
      vehicleSize: data.vehicleSize.value,
    });
    // this.vehiclesList.forEach((vehicle: any) => {
    //   if (vehicle.vehicleNumber === data) {
    //     this.vehicleId = vehicle.id;
    //   }
    // });
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
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }

  onFreightChange(data: any) {
    this.freightId = data.id;
    this.biltiForm.patchValue({
      freightAmount: data.freightAmount,
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
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }

  onVendorChange(data: any) {
    this.vendorId = data.id;
    this.biltiForm.patchValue({
      vendorName: data.vendorName,
      paidByDetails: data.paidByDetail.code,
    });
  }

  getAllPointChargesList() {
    let data = {
      pointName: '',
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
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }

  onPointchargeChange(data: any) {
    this.pointChargeId = data.id;
    this.biltiForm.patchValue({
      pointCharge: data.pointCharge,
    });
  }

  onPressSave() {
    this.loadSpinner = true;
    if (this.biltiId == 0) {
      const data = {
        actionBy: 1,
        transactionTypeId: this.transactionTypeId,
        frlrNumber: parseInt(this.frlrNumber ?? ''),
        transporterId: this.transporterId,
        freightId: this.freightId,
        loadingLocationId: this.biltiForm.controls['loadingLocation'].value,
        vehicleId: this.vehicleId,
        "attribute9": "2024-05-04T13:03:47.509Z",
        "attribute10": "2024-05-04T13:03:47.509Z",
        lineItemsEntity: [
          {
            actionBy: 0,
            frmId: this.frmId,
            vendorId: this.vendorId,
            pointId: this.pointChargeId,
            remarks: this.biltiForm.controls['remarks'].value,
            "attribute9": "2024-05-04T13:03:47.509Z",
            "attribute10": "2024-05-04T13:03:47.509Z",
          },
        ],
      };
      this.biltiService.createBilti(data).subscribe(
        (response: any) => {
          this.biltiData = response;
          this.toastr.success('Bilti Created Successfully');
          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(error.statusText, error.status);
          this.loadSpinner = false;
        }
      );
    } else {
      const data = {
        actionBy: 1,
        frlrNumber: parseInt(this.frlrNumber),
        transporterId: this.transporterId,
        freightId: this.freightId,
        loadingLocationId: this.biltiForm.controls['loadingLocation'].value,
        vehicleId: this.vehicleId,
        "attribute9": "2024-05-04T13:03:47.509Z",
        "attribute10": "2024-05-04T13:03:47.509Z",
        lineItemsEntity: [
          {
            actionBy: 1,
            frmId: this.frmId,
            vendorId: this.vendorId,
            pointId: this.pointChargeId,
            remarks: this.biltiForm.controls['remarks'].value,
            status: this.biltiForm.controls['biltiStatus'].value,
            "attribute9": "2024-05-04T13:03:47.509Z",
            "attribute10": "2024-05-04T13:03:47.509Z",
          },
        ],
        status: this.biltiForm.controls['status'].value,
      };
      this.biltiService.updateBilti(this.biltiId, data).subscribe(
        (response: any) => {
          this.toastr.success('Bilti Updated Successfully');
          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(error.statusText, error.status);
          this.loadSpinner = false;
        }
      );
    }

    this.loadSpinner = false;
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
        const transactionTypeId = response.transactionTypeId;
        const transactionType = this.transactionTypesLists.find(
          (type: any) => type.id === transactionTypeId
        );
        this.transactionTypeId = transactionType?.id;
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
        const vendorId = response?.biltiCreationLineItems[0]?.vendorId;
        const vendor = this.vendorList.find(
          (vendor: any) => vendor?.id === vendorId
        );
        this.vendorId = vendor?.id;
        const pointChargeId = response?.biltiCreationLineItems[0]?.pointId;
        const pointCharge = this.pointChargesList.find(
          (pointCharge: any) => pointCharge?.id === pointChargeId
        );
        this.pointChargeId = pointCharge?.id;
        this.frlrNumber = response?.frlrNumber;
        this.frmId = response?.biltiCreationLineItems[0]?.frmId
        this.selectedTransactionTypeCode = transactionType?.code;
        this.frmdocumentId = response?.biltiCreationLineItems[0]?.frmId;
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
          biltiDetailsTransactionType: transactionType?.code,
          vendorCode: vendor?.vendorCode,
          vendorName: vendor?.vendorName,
          paidByDetails: vendor?.paidByDetail?.value,
          pointName: pointCharge?.pointName,
          pointCharge: pointCharge?.pointCharge,
          remarks: response?.biltiCreationLineItems[0]?.remarks
        });
        this.getFrlr(this.selectedTransactionTypeCode);
      },
      (error) => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }
  // patchBiltiForm(data: any){
  //   this.biltiForm.patchValue({
  //     source: data.fromDestination,
  //     destination: data.toDestination
  //   })
  // }
}
