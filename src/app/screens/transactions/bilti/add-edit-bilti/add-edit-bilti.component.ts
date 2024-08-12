import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BiltiService } from '../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BiltiListingModel } from '../../../../core/model/masterModels.model';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { APIConstant } from '../../../../core/constants';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { TransporterService } from '../../../../core/service/transporter.service';
import { FreightService } from '../../../../core/service/freight.service';
import { VendorService } from '../../../../core/service/vendor.service';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiRbTxnDataComponent } from '../../../modals/bilti-rb-txn-data/bilti-rb-txn-data.component';

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
  vendorIdMap: { [key: string]: string } = {};
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
  vendorId: any =[];
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
  rbVehicleNumber: string = ''
  locationId!: Number;
  locations: any[] = APIConstant.locationsListDropdown;
  plantCodes: any[]= APIConstant.plantCodes
  biltisList: any = [];
  biltiLocationId: number = 0;
  dispatchData: any = [];
  patchedPointName: any = [];
  rbSelectedNotes: any = [];
  displayRowsRb: any = [];
  combinedRows: any = []
  constructor(
    private router: Router,
    private biltiService: BiltiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private dispatchNoteService: DispatchNoteService,
    private fb: FormBuilder,
    private transactionTypesService: TransactionTypesService,
    private vehicleService: VehicleService,
    private transporterService: TransporterService,
    private freightService: FreightService,
    private vendorService: VendorService,
    private pointChargeService: PointChargeService,
    private lookUpService: LookupService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.biltiId = Number(this.activatedRoute.snapshot.paramMap.get('biltiId'));
    
    const locationId = this.activatedRoute.snapshot.paramMap.get('locationId');
    if(locationId){
      this.locationId = Number(locationId);
    }

    this.initForm();
    this.getAllTransportersList();
    this.getAllTransactionTypes();
    this.getAllFreightList();
    this.getAllVendorList();
    this.getAllPointChargesList();
    this.getLoadingLocationData();
    this.getVehicleNumber();
    setTimeout(() => {
      if (this.biltiId > 0) {
        this.getEditBiltiData();
      }
    },1000)
    this.setLocation();
  }

  initForm() {
    this.biltiForm = this.fb.group({
        locationId :new FormControl('', [Validators.required]),
        transactionType: new FormControl('', [Validators.required]),
        frlrNo: new FormControl('', [Validators.required]),
        vehicleNumber: new FormControl('', [Validators.required]),
        vehicleSize: new FormControl(null),
        source: new FormControl(''),
        destination: new FormControl(''),
        freightCode: new FormControl('', [Validators.required]),
        freightAmount: new FormControl(null),
        transporterCode: new FormControl('', [Validators.required]),
        transporterName: new FormControl(''),
        loadingLocation: new FormControl(null, [Validators.required]),
        status: new FormControl('Active'),
        vendors: this.fb.array([])
    });
  }

  createVendorGroup(vendor: any): FormGroup {
    return this.fb.group({
      vendorCode: ['', [Validators.required]],
      vendorName: [''],
      pointName: [''],
      pointCharge: [0],
      remarks: [''],
      paidByDetails: [''],
      biltiStatus: ['Active'],
      biltiDetailsTransactionType: [''],
      documentrefNo: [''],
      dispatchNoteId: [0]
    });
  }

  getVendorControls() {
    return (this.biltiForm.get('vendors') as FormArray).controls;
  }

  onCancelPress() {
    this.router.navigate(['transaction/bilti']);
  }

  getAllTransactionTypes() {
    const data = {
      code: '',
    };
    this.transactionTypesService.getTransactionTypes(data).subscribe(
      (response: any) => {
        this.transactionTypesLists = response.transactionTypes;
        this.filteredTransactionTypesLists = this.transactionTypesLists.filter(
          (transactionType: any) => transactionType.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }


  getFrlr(selectedTransactionType: string) {
    const plantCodes = this.plantCodes.map((plant: any) => plant.name);
    const data = {
      transactionType: selectedTransactionType,
      plantCode: plantCodes
    };
    this.biltiService.getFrmTransactions(data).subscribe(
      (response: any) => {
        const filteredFrmTransactions = response.frmTransactions.filter((item: any) => item.openFlag !== 'Close');
      this.allFrmTransactionData = response.frmTransactions;
      this.frmTransactionData = [...new Set(filteredFrmTransactions.map((item: any) => 
        item.frlrNumber))].map(frlrNumber => filteredFrmTransactions.find((t: any) => 
          t.frlrNumber === frlrNumber));
      this.frlrList = response.transactionTypes;
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getDispatchData(dispatchNumber: string = "") {
    const locationIds = this.locationId?[this.locationId]:[];
    this.dispatchNoteService.getDispatchNote({ dispatchNumber, locationIds }).subscribe((res: any) => {
      this.dispatchData = res.dispatchNotes
      const filteredDispatchNotes = res.dispatchNotes.filter((item: any) => item?.openFlag !== 'Close');
    this.frmTransactionData = [...new Set(filteredDispatchNotes.map((item: any) => 
      item?.frlrNumber))].map(frlrNumber => filteredDispatchNotes.find((t: any) => 
        t?.frlrNumber === frlrNumber));
    this.dispatchNotes = filteredDispatchNotes;
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
   this.onTransactionClear();
  }

  onTransactionClear(){
    this.biltiForm.get('frlrNo')?.setValue(null);
    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    vendorsArray.controls.forEach((vendorGroup) => {
      vendorGroup.patchValue({
        vendorCode: null,
        vendorName: null,
        pointName: null,
        pointCharge: null,
        remarks: null,
        paidByDetails: null,
        documentrefNo: null
      });
    });
    this.biltiForm.patchValue({
      vehicleNumber: null,
      vehicleSize: null,
      transporterCode: null,
      transporterName: null,
      freightCode: null,
      source: null,
      destination: null,
      freightAmount: null
    })
  }

  onChangeFrlrNoClear(){
    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    vendorsArray.controls.forEach((vendorGroup) => {
      vendorGroup.patchValue({
        vendorCode: null,
        vendorName: null,
        pointName: null,
        pointCharge: null,
        remarks: null,
        paidByDetails: null,
        documentrefNo: null
      });
    });
    this.biltiForm.patchValue({
      vehicleNumber: null,
      vehicleSize: null,
      transporterCode: null,
      transporterName: null,
      freightCode: null,
      source: null,
      destination: null,
      freightAmount: null
    })
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
    this.onChangeFrlrNoClear()
    this.displayRows = [];
    this.dispatchNotes.forEach((element: any) => {
      const commonData = element?.frlrNumber == selectedFrlr?.frlrNumber;
      const paidByDetails = this.vendorList
      .filter((item: any) => 
        item?.vendorCode === element?.suppliers?.vendorCode
      )
      .flatMap((item: any) => 
        item?.vendorMappingModels.filter((model: any) => 
          model?.transactionType?.code === this.biltiTransactionType
        )
      )
      .map((model: any) => model?.paidByDetails);    
      
      console.log(paidByDetails);
      
      if (commonData) {
        this.displayRows.push({
          documentrefNo: element?.dispatchNumber,
          vendorCode: element?.suppliers?.vendorCode,
          vendorName: element?.suppliers?.vendorName,
          pointName:element?.suppliers?.city,
          pointCharge:element?.suppliers?.city?.pointChargeDetails?.pointCharge,
          vendorId: element?.suppliers?.id,
          paidByDetails: paidByDetails[0]?.value,
          biltiDetailsTransactionType: this.biltiTransactionType
        });
      }
    });
    
    if (this.biltiTransactionType != 'RB') {
      this.allFrmTransactionData.forEach((element: any) => {
        const commonData = element?.frlrNumber == selectedFrlr?.frlrNumber
        if (commonData) {
          this.displayRows.push({
            documentrefNo: element.documentNumber,
          });
        }
      });
    } 
    this.pointChargesList.forEach((pointCharge: any) => {
      this.pointMapCharge[pointCharge.pointName] = pointCharge.pointCharge;
  })
    this.vendorList.forEach((vendor: any) => {
      const matchingModel = vendor.vendorMappingModels.find((item: any) => item.transactionType.code === this.biltiTransactionType);
      console.log(matchingModel);
      
      const cityId = vendor.city
      this.vendorMapCode[vendor.vendorCode] = vendor?.vendorCode;
      this.vendorMapName[vendor.vendorCode] = vendor.vendorName;
      this.pointMapName[vendor.vendorCode] = vendor?.city;
      this.pointMapCharge[vendor.vendorCode] = this.pointMapCharge[cityId];
      this.paidByDetailsMap[vendor.vendorCode] =  matchingModel?.paidByDetails?.value;
      this.vendorIdMap[vendor.vendorCode] = vendor?.id;
    });
    const vendorControls = this.displayRows.map((vendor: any) => this.createVendorGroup(vendor));
    this.biltiForm.setControl('vendors', this.fb.array(vendorControls));

    const selected = this.frmTransactionData.find(
      (data: any) => data.frlrNumber === selectedFrlr?.frlrNumber
    );
    this.patchedPointName = this.biltiTransactionType == 'RB' ? this.displayRows[0].pointName : this.pointMapName[selected?.toDestination];
    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    this.displayRows.forEach((row: any, index: number) => {
      const vendorGroup = vendorsArray.at(index) as FormGroup;
      this.vendorId = this.vendorIdMap[selected?.toDestination];
      
      vendorGroup.patchValue({
        documentrefNo: row.documentrefNo,
        vendorCode: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB' ? row?.vendorId: this.vendorId,
        vendorName: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'? row?.vendorName: this.vendorMapName[selected?.toDestination],
        pointName: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'? row?.pointName: this.pointMapName[selected?.toDestination],
        paidByDetails: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'? row?.paidByDetails: this.paidByDetailsMap[selected?.toDestination] 
      });
    });
    const selectedVehiclenumber = selectedFrlr?.vehicleNumber;
    const vehicleNumber = this.vehiclesList.find(
      (vehicle: any) => vehicle?.vehicleNumber === selectedVehiclenumber
    );
    if (this.biltiTransactionType == 'RB') {
      this.vehicleId = selectedFrlr?.vehicleId
      this.biltiForm.patchValue({
        vehicleNumber: selectedFrlr?.vehicles?.vehicleNumber,
        vehicleSize: selectedFrlr?.vehicles?.vehicleSize?.value,
      })
    } else {
      this.vehicleId = vehicleNumber?.id;
    }

    if (selected) {
      this.vehicleNumber = selected?.vehicleNumber;
      this.frlrNumber = selected?.frlrNumber;
      this.transporterId = selected?.transporterId;
      this.frmId = selected?.id;
      this.loadingLocationid = selected?.loadingLocationId;
      this.vehicleId = this.vehicleId;
      this.biltiForm.patchValue({
        transporterCode: this.transporterMapCode[selected.transporterId],
        transporterName: this.transporterMapName[selected.transporterId],
      });
    }
    if (this.biltiId == 0) {
      this.patchTransactionType(this.biltiTransactionType)
    } else {
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
     this.vehicleService.getVehicles(data).subscribe(
      (response: any) => {
        this.vehiclesList = response.vehicles;
        this.filteredVehiclesLists = this.vehiclesList.filter(
          (vehicles: any) => vehicles.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getAllTransportersList() {
    const data = {
      transporterCode: '',
      transporterName: '',
    };
     this.transporterService.getTransporters(data).subscribe(
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
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
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
    this.freightService.getFreightsList(data).subscribe(
      (response: any) => {
        this.freightList = response.freights;
        this.filteredFreightsLists = this.freightList.filter(
          (freight: any) => freight.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  onFreightChange(data: any) {
    const vendorsArray = this.biltiForm.get('vendors') as FormArray;
      const vendorData = this.vendorList.find((element: any) => {
        return element?.city == this.patchedPointName
      })
      const commonData = this.pointChargesList.find((item: any) => {
        return item?.pointName == vendorData?.city
      })
      const vendorAtIndexZero = vendorsArray.at(0) as FormGroup;
      vendorAtIndexZero.patchValue({
        pointCharge: 0
      });
    for (let i = 1; i < vendorsArray.length; i++) {
      const currentVendor = vendorsArray.at(i) as FormGroup;
      const prevVendor = vendorsArray.at(i - 1) as FormGroup;

      const currentPointName = currentVendor.value.pointName;
      const prevPointName = prevVendor.value.pointName;
        const samePointName = currentPointName === prevPointName
        const lineItemsVendorData = this.vendorList.find((element: any) => {
          return element?.city == currentPointName
        })

        const lineItemsSameLocationCharge = this.pointChargesList.find((item: any) => {
          return item.pointName == lineItemsVendorData?.city
        })
        currentVendor.patchValue({
          pointCharge: samePointName ? lineItemsSameLocationCharge?.sameLocationCharge :
            lineItemsSameLocationCharge?.pointCharge
        });
    }

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
    this.vendorService.getVendors(data).subscribe(
      (response: any) => {
        this.vendorList = response.vendors;
        this.filteredVendorcode = this.vendorList.filter(
          (vendors: any) => vendors.status === 'Active' || vendors.status === 'ACTIVE'
        );
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  getAllPointChargesList() {
    let data = {
      pointName: '',
      locationIds:[]
    };
    this.pointChargeService.getPointCharges(data).subscribe(
      (response: any) => {
        this.pointChargesList = response.pointCharges;
        this.filteredPointname = this.pointChargesList.filter(
          (pointname: any) => pointname.status === 'Active'
        );
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  onPressSave() {
    const locationCode = this.biltiForm.controls['locationId']?.value
    this.loadSpinner = true;
    const formData = this.biltiForm.value;
    console.log(formData);
    
    const frlrNumber = formData?.frlrNo?.frlrNumber;
    if(this.biltiId > 0){
       this.matchedDispatchNotes = this.dispatchData.filter((item: any) => {
        return item?.frlrNumber === this?.frlrNumber
       }
      );
    } else{
      this.matchedDispatchNotes = this.dispatchData.filter((item: any) => {
       return item?.frlrNumber === frlrNumber
      }
      );
    }
    console.log(formData);
    
    const loadingLocationData = this.loadingLocation.find((item: any) => item.id == formData?.loadingLocation);
    const loadingLocationValue = loadingLocationData.value;
    const transporterData = this.transportersList.find((item: any)=> item.id == this.transporterId)
    const transporterTypeFlag = transporterData?.creationFlag
    if (this.biltiId == 0) {
      const data = {
        actionBy: localStorage.getItem('userId'),
        transactionTypeId: this.transactionTypeId,
        transactionTypeCode: formData?.transactionType.code,
        frlrNumber: this.frlrNumber ?? '',
        transporterId: this.transporterId,
        transporterCode: formData?.transporterCode,
        transporterTypeFlag :transporterTypeFlag,
        transporterName: formData?.transporterName,
        freightId: this.freightId,
        freightCode: formData?.freightCode?.freightCode,
        freightAmount: formData?.freightAmount,
        loadingLocationId: this.biltiForm.controls['loadingLocation'].value,
        loadingLocationValue :loadingLocationValue,
        source: formData?.source,
        destination: formData?.destination,
        vehicleId: this.vehicleId,
        vehicleNumber: formData.transactionType.code === 'RB'? formData?.vehicleNumber :formData?.vehicleNumber.vehicleNumber,
        vehicleSize: formData?.vehicleSize,
        attribute9: '2024-05-04T13:03:47.509Z',
        attribute10: '2024-05-04T13:03:47.509Z',
        lineItemsEntity: [
          {
            vendorId: 0,
            actionBy: '',
            remarks: '',
            attribute9: '',
            attribute10: '',
            frmId: 0,
            dispatchNoteId: 0,
            documentReferenceNo: '',
          },
        ],
      };

      formData.vendors.forEach((vendorControl: any, index: number) => {
        console.log(vendorControl);
        
        const matchingVendor = this.vendorList.find((vendor: any) => vendor.id === vendorControl.vendorCode);
        const matchedLineitems = this.allFrmTransactionData.filter((item: any) => {
          return item.documentNumber == vendorControl.documentrefNo
        }
        )
       
        const lineItem = {
          vendorId: formData.transactionType.code === 'RB'? vendorControl.vendorCode: formData?.vendors[index].vendorCode,
          vendorCode: formData.transactionType.code === 'RB'? matchingVendor.vendorCode: matchingVendor.vendorCode,
          vendorName: formData.transactionType.code === 'RB'? vendorControl.vendorName: formData?.vendors[index].vendorName,
          actionBy: localStorage.getItem("userId") || '',
          remarks: vendorControl?.remarks,
          attribute9: "2024-05-04T13:03:47.509Z",
          attribute10: "2024-05-04T13:03:47.509Z",
          frmId: formData.transactionType.code === 'RB' ? 0 : this.frmId,
          dispatchNoteId: formData.transactionType.code === 'RB' ? this.matchedDispatchNotes[index]?.id : this.combinedRows[index].dispatchNoteId,
          documentReferenceNo: vendorControl.documentrefNo,
          pointCharge: parseInt(vendorControl?.pointCharge) || 0,
          pointName: vendorControl.pointName,
          plantCode: formData.transactionType.code === 'RB' ? '' : matchedLineitems[0]?.fromDestination,
          paidByDetails: vendorControl.paidByDetails
        };
        if(data.lineItemsEntity[0].vendorId == 0){
          data.lineItemsEntity[0] = lineItem
        }else{
          data.lineItemsEntity.push(lineItem);
        }
      })
  
      
      this.biltiService.createBilti(locationCode,data).subscribe(
        (response: any) => {
          this.biltiData = response;
          this.toastr.success('Bilti Created Successfully');
          this.loadSpinner = false;
          this.router.navigate(['transaction/bilti'])
        },
        (error) => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
    }  

    else {
      const data = {
        id: this.biltiId,
        actionBy: localStorage.getItem("userId"),
        frlrNumber: this.frlrNumber,
        transporterId: this.transporterId,
        freightId: this.freightId,
        loadingLocationId: this.biltiForm.controls['loadingLocation'].value,
        vehicleId: this.vehicleId,
        "attribute9": new Date().toISOString(),
        "attribute10": new Date().toISOString(),
        lineItemsEntity:  [
          {
          vendorId: 0,
          actionBy: '',
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
          vendorId: this.selectedTransactionTypePatchCode === 'RB'? this.matchedDispatchNotes[index]?.suppliers?.id: formData?.vendors[index].vendorCode,
          actionBy: localStorage.getItem("userId") || '',
          remarks: vendorControl?.remarks,
          attribute9: new Date().toISOString(),
          attribute10: new Date().toISOString(),
          status: vendorControl?.biltiStatus,
          id: 0,
          frmId: this.selectedTransactionTypePatchCode === 'RB' ? 0 : this.frmId,
          dispatchNoteId: this.selectedTransactionTypePatchCode === 'RB' ? this.matchedDispatchNotes[index]?.id : 0,
          documentReferenceNo: vendorControl.documentrefNo,
          pointCharge: parseInt(vendorControl?.pointCharge) || 0
        };
        if(data.lineItemsEntity[0].vendorId == 0){
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
      this.biltiService.updateBilti(locationCode,this.biltiId, data).subscribe(
        (response: any) => {
          this.biltiData = response;
          this.toastr.success('Bilti Updated Successfully');
          this.loadSpinner = false;
          this.router.navigate(['transaction/bilti'])
        },
        (error) => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
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
    this.biltiService.getBiltiData(this.biltiLocationId,biltiId).subscribe(
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
      const remarks = this.biltiCreationLineItemsData[index]?.remarks;
      const biltiStatus = this.biltiCreationLineItemsData[index]?.status;
      const vendor = this.vendorList.find((vendor: any) => vendor.id === vendorId);
        vendorGroup.patchValue({
          pointCharge: this.biltiCreationLineItemsData[index]?.pointCharge,
        });
        this.patchedPointName = this.biltiCreationLineItemsData[0]?.vendor?.cityDetail?.value
    if(this.selectedTransactionTypePatchCode =='RB'){
      vendorGroup.patchValue({
        vendorCode: vendor?.vendorCode,
        vendorName: vendor?.vendorName,
        pointName: vendor?.city.value,
        paidByDetails: vendor?.paidByDetail?.value,
        remarks: remarks,
        biltiStatus: biltiStatus,
      });
        vendorGroup.patchValue({
          documentrefNo: this.lineItem[index]?.documentReferenceNo,

        });
    }else{
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
    }
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
          locationId: response.locationId
        });
        if(this.selectedTransactionTypeCode == "RB"){
          this.getDispatchData();
        } else {
          this.getFrlr(this.selectedTransactionTypeCode);
        }
        

      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  setLocation(){
    if(!this.biltiId){
      this.lookUpService.setLocationId(this.biltiForm, this.locations, 'locationId');
    }
  }

  getEditBiltiData() {
    this.loadSpinner = true;
    let data = {
      biltiNumber: '',
      locationIds: APIConstant.locationsListDropdown.map((e: any) => e.id),
    };
    this.biltiService.getBiltis(data).subscribe(
      (response: any) => {
        this.biltisList = response.biltiCreations;
        this.getLocationId().then(() => {
          this.getBiltiData(this.biltiId);
        });
      },
      (error) => {
      }
    );
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const bilti = this.biltisList.filter((item: any) => {
        return item.id == this.biltiId
      });
      if (bilti.length > 0) {
        this.biltiLocationId = bilti[0].locationId;
        resolve();
      } else {
        reject('No matching bilti found');
      }
    });
  }

onAdd() {
  let documentModal = this.modalService.open(BiltiRbTxnDataComponent, {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'modal-width',
  });
  documentModal.componentInstance.title = 'rbTXNData';
  documentModal.componentInstance.biltiTransactionType = this.biltiTransactionType

  documentModal.result.then((selectedNotes) => {
    if (selectedNotes) {
      this.rbSelectedNotes = selectedNotes.length;
      const existingRows = this.biltiForm.get('vendors')?.value;
  
      selectedNotes.forEach((element: any) => {
        const matchingPaidByDetails = this.vendorList
          .filter((item: any) => item?.vendorCode === element?.suppliers?.vendorCode)
          .flatMap((item: any) => 
            item?.vendorMappingModels.filter((model: any) => 
              model?.transactionType?.code === 'RB'
            )
          )
          .map((model: any) => model?.paidByDetails)[0];
          console.log(matchingPaidByDetails);
          
        this.displayRowsRb.push({
          documentrefNo: element?.dispatchNumber,
          vendorName: element?.suppliers?.vendorName,
          pointName: element?.suppliers?.city,
          pointCharge: 0,
          vendorCode: element?.suppliers?.id,
          biltiDetailsTransactionType: 'RB',
          dispatchNoteId: element.id,
          paidByDetails: matchingPaidByDetails.value
        });
      });
  
      this.combinedRows = [...existingRows, ...this.displayRowsRb];
      console.log(this.combinedRows);
  
      const vendorControls = this.combinedRows.map((vendor: any) => this.createVendorGroup(vendor));
      this.biltiForm.setControl('vendors', this.fb.array(vendorControls));
  
      this.combinedRows.forEach((row: any, index: number) => {
        const vendorGroup = (this.biltiForm.get('vendors') as FormArray).at(index) as FormGroup;
        vendorGroup.patchValue({
          documentrefNo: row.documentrefNo,
          vendorCode: row.vendorCode,
          vendorName: row.vendorName,
          pointName: row.pointName,
          pointCharge: row.pointCharge,
          biltiDetailsTransactionType: row.biltiDetailsTransactionType,
          paidByDetails: row?.paidByDetails
        });
      });
    }
  });
  
}

disabledonAdd(){
  return !this.biltiForm.controls['transactionType'].value || !this.biltiForm.controls['freightCode'].value
}

  
}
