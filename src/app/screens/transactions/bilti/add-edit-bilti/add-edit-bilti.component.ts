import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BiltiService } from '../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BiltiListingModel } from '../../../../core/model/masterModels.model';
import { DispatchNoteService } from '../../../../core/service/dispatch-note.service';
import { APIConstant, pointCharge } from '../../../../core/constants';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { TransporterService } from '../../../../core/service/transporter.service';
import { FreightService } from '../../../../core/service/freight.service';
import { VendorService } from '../../../../core/service/vendor.service';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BiltiRbTxnDataComponent } from '../../../modals/bilti-rb-txn-data/bilti-rb-txn-data.component';
import { Logger } from 'html2canvas/dist/types/core/logger';
import { forkJoin, tap } from 'rxjs';
import { PlantService } from '../../../../core/service';

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
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  plantCodes: any[]= APIConstant.plantCodes
  biltisList: any = [];
  biltiLocationId: number = 0;
  dispatchData: any = [];
  patchedPointName: any = [];
  rbSelectedNotes: any = [];
  displayRowsRb: any = [];
  combinedRows: any = [];
  freightCode: string = '';
  dispatchNoteId: any = [];
  transporterMode: any = [];
  taxationType: string = '';
  taxCode: string = '';
  tdsCode: string = '';
  modeofTransport: string = '';
  transporters: any;
  filteredTransporter: any = [];
  selectedLocationId: number = 0;
  filteredVehicles: any = [];
  filteredFreights: any = [];
  autobiltiRequiredFlag: string = '';
  locationsDropdownData: any = [];
  vehicleSize: any = [];
  vehicleSizeData: any = [];
  activeTransporterMappings: any = [];
  freightListFiltered: any = [];
  matchedPlants: any = [];
  plantsList: any = [];
  createLineItem: any = [];
  selectedPlantCode: any = [];
  lineItemId: number = 0;
  vendorCode: any = [];
  selectedFrlr: string = '';
  rbDispatchNumbers: any = [];
  pointChargeData: any = [];
  isPointChargeCalculated: boolean = false;
  patchedRbDispatchNotes: any = [];
  constructor(
    private router: Router,
    private biltiService: BiltiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private dispatchNoteService: DispatchNoteService,
    private fb: FormBuilder,
    private plantService: PlantService,
    private vehicleService: VehicleService,
    private transporterService: TransporterService,
    private freightService: FreightService,
    private vendorService: VendorService,
    private pointChargeService: PointChargeService,
    private lookUpService: LookupService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getCommonLocations();
    this.getLocations();
    this.getVehicleSize();
    this.biltiId = Number(this.activatedRoute.snapshot.paramMap.get('biltiId'));
    const locationId = this.activatedRoute.snapshot.paramMap.get('locationId');
    if (locationId) {
      this.locationId = Number(locationId);
    }
  
    this.initForm();
    this.loadSpinner = true;
    let editBiltiDataCompleted = false;

    forkJoin({
      transporters: this.getAllTransportersList(),
      transactionTypes: this.getAllTransactionTypes(),
      freights: this.getAllFreightList(),
      vendors: this.getAllVendorList(),
      pointCharges: this.getAllPointChargesList(),
      loadingLocation: this.getLoadingLocationData(),
      vehicleNumbers: this.getVehicleNumber(),
      plantList: this.getPlantsList()
    }).subscribe({
      next: (responses) => {
        if (this.biltiId > 0) {
          this.getEditBiltiData().subscribe(() => {
            editBiltiDataCompleted = true;
            this.loadSpinner = false;
          });
        } else {
          this.loadSpinner = false;
        }
      },
      error: (error) => {
        this.loadSpinner = false;
      }
    });
  
    this.setLocation();
    this.selectedLocationId = this.biltiForm?.controls['locationId']?.value;
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
    this.lookUpService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locationsDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active' && 
        this.commonLocations.some((location: any) => location.id === item.id));

    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
  }

  getVehicleSize() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'vehicleSize';
    this.lookUpService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.vehicleSize = res.lookUps.filter(
        (item: any) => item.status === 'Active');

    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
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
        transporterMode: [''],
        biltiNumber: '',
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
      dispatchNoteId: [0],
      source: [''],
    });
  }

  getVendorControls() {
    return (this.biltiForm.get('vendors') as FormArray).controls;
  }

  onCancelPress() {
    this.router.navigate(['transaction/bilti']);
  }

  getAllTransactionTypes() {
    let data = {
      locationIds: [],
      plantCode:  '',
      auCode:  '',
      siteCode:  '',
      status: '',
    };
    return this.plantService.getPlants(data).pipe(
      tap((response: any) => {
        const plants = response.plants;
        
       const activePlants =  plants.filter((plant: any) => plant.status === 'Active');
       this.transactionTypesLists = plants
       .flatMap((plant: any) => plant.transactionTypeMapping || [])
       .reduce((acc: any[], current: any) => {
         const existingItem = acc.find((item) => item.code === current.code);
         if (!existingItem) {
           acc.push(current);
         }
         return acc;
       }, []);
       this.filteredTransactionTypesLists = activePlants
         .flatMap((plant: any) => plant.transactionTypeMapping || [])
         .reduce((acc: any[], current: any) => {
           const existingItem = acc.find((item) => item.code === current.code);
           if (!existingItem) {
             acc.push(current);
           }
           return acc;
         }, []);
       
      })
    );
  }


  getFrlr(selectedTransactionType: string) {
    if (selectedTransactionType === 'INVOICE-RB') {
      selectedTransactionType = 'INVOICE';
    } else if (selectedTransactionType === 'RTV-RB') {
      selectedTransactionType = 'RTV';
    }
    const plantCodes = this.matchedPlants?.map((plant: any) => plant.name);
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
      },
    );
  }

  getDispatchData(dispatchNumber: string = "") {
    const locationIds = [this.biltiForm.controls['locationId'].value];
    const matchedLocation = this.locations?.find((item: any) => item?.code == locationIds);
    const matchedLocationId = matchedLocation?.id
    // const locationIds = this.locationId?[this.locationId]:[];
    this.dispatchNoteService.getDispatchNote({ dispatchNumber, matchedLocationId }).subscribe((res: any) => {
      this.dispatchData = res.dispatchNotes
      const filteredDispatchNotes = res.dispatchNotes.filter((item: any) => item?.openFlag !== 'Close'
      && item?.frlrNumber !== null);
    this.frmTransactionData = [...new Set(filteredDispatchNotes.map((item: any) => 
      item?.frlrNumber))].map(frlrNumber => filteredDispatchNotes.find((t: any) => 
        t?.frlrNumber === frlrNumber));
    this.dispatchNotes = filteredDispatchNotes;
    })
  }
  
  onOptionSelected(selectedTransactionType: any) {
    this.transactionTypeId = selectedTransactionType.transactionTypeId;
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
        documentrefNo: null,
        source: null
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
        documentrefNo: null,
        source: null
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
      freightAmount: null,
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
    this.selectedFrlr = selectedFrlr?.frlrNumber
    // this.filteredFreights.filter
    this.biltiForm.patchValue({
      transporterMode: null,
    });
    this.transportersList.forEach((transporter: any) => {
      if (transporter.locationId === this.selectedLocationId) {
      this.transporterMapCode[transporter.id] = transporter.transporterCode;
      this.transporterMapName[transporter.id] = transporter.transporterName;
      }
    });
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
      if (commonData) {
        this.displayRows.push({
          documentrefNo: element?.dispatchNumber,
          vendorCode: element?.suppliers?.vendorCode,
          vendorName: element?.suppliers?.vendorName,
          pointName:element?.suppliers?.freightCity,
          pointCharge:element?.suppliers?.city?.pointChargeDetails?.pointCharge,
          vendorId: element?.suppliers?.id,
          paidByDetails: paidByDetails[0]?.value,
          biltiDetailsTransactionType: this.biltiTransactionType
        });
      }
    });
    
    this.pointChargesList.forEach((pointCharge: any) => {
      this.pointMapCharge[pointCharge.pointName] = pointCharge.pointCharge;
  })
    this.vendorList.forEach((vendor: any) => {
      const matchingModel = vendor.vendorMappingModels.find((item: any) => item.transactionType.code === this.biltiTransactionType || this.selectedTransactionTypeCode);
      const cityId = vendor.freightCity
      this.vendorMapCode[vendor.vendorCode] = vendor?.vendorCode;
      this.vendorMapName[vendor.vendorCode] = vendor.vendorName;
      this.pointMapName[vendor.vendorCode] = vendor?.freightCity;
      this.pointMapCharge[vendor.vendorCode] = this.pointMapCharge[cityId];
      this.paidByDetailsMap[vendor.vendorCode] =  matchingModel?.paidByDetails?.value;
      this.vendorIdMap[vendor.vendorCode] = vendor?.id;
    });
    if (this.biltiTransactionType != 'RB') {
      this.allFrmTransactionData.forEach((element: any) => {
        const commonData = element?.frlrNumber == selectedFrlr?.frlrNumber
        if (commonData) {
          this.displayRows.push({
            documentrefNo: element.documentNumber,
            toDestination: element?.toDestination,
            frmId: element?.id,
            pointName: this.pointMapName[element.toDestination],
            fromDestination: element?.fromDestination
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

      const matchedPlant = this.plantsList.find(
        (plant: any) => plant.plantCode === row.toDestination
      );
    if (matchedPlant) {
      this.displayRows[index].vendorName = matchedPlant?.plantDesc;
      this.displayRows[index].pointName = matchedPlant?.freightCity;
    } 
      const vendorGroup = vendorsArray.at(index) as FormGroup;
      const toDestination = row?.toDestination;
      if(this.biltiTransactionType == 'STO' || this.selectedTransactionTypeCode == 'STO' || 
        this.biltiTransactionType == 'CWC' || this.selectedTransactionTypeCode == 'CWC'){
          vendorGroup.patchValue({
            documentrefNo: row.documentrefNo,
            vendorCode: row?.toDestination,
            vendorName: row?.vendorName,
            pointName: row?.pointName,
            paidByDetails: 'Paid by LG',
            source: row?.fromDestination
          });
      } else{
        this.vendorCode.push(this.vendorMapCode[toDestination])
        vendorGroup.patchValue({
          documentrefNo: row.documentrefNo,
          vendorCode: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB' ? row?.vendorId: this.vendorIdMap[toDestination],
          vendorName: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'? row?.vendorName: this.vendorMapName[toDestination],
          pointName: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'? row?.pointName: this.pointMapName[toDestination],
          paidByDetails: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'? row?.paidByDetails: this.paidByDetailsMap[toDestination],
          source: this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'? '': row?.fromDestination,

        });
      }
    
    });

    this.patchedPointName = this.biltiTransactionType == 'RB' || this.biltiTransactionType == 'STO' || this.biltiTransactionType == 'CWC' ? this.displayRows[0].pointName : this.pointMapName[selected?.toDestination];
    const selectedVehiclenumber = selectedFrlr?.vehicleNumber;
    const vehicleNumber = this.vehiclesList.find(
      (vehicle: any) => vehicle?.vehicleNumber === selectedVehiclenumber
    );

    if (selected) {
      this.vehicleSizeData = this.vehicleSize.find((item: any)=> item.id == selected?.vehicleSizeId);
      this.vehicleNumber = selected?.vehicleNumber;
      this.frlrNumber = selected?.frlrNumber;
      this.transporterId = selected?.transporterId;
      // this.frmId = selected?.id;
      this.loadingLocationid = selected?.loadingLocationId;
      this.vehicleId = this.vehicleId;
      this.onTransporterChange(this.transporterMapCode[selected.transporterId]);
      const transporter = this.transportersList.find((item: any) => item.id == selected?.transporterId);
      
        this.biltiForm.patchValue({
          transporterCode: transporter?.transporterCode,
          transporterName: transporter?.transporterName,
          transporterMode: selected?.transporterMode
        });
    }
   
    
    if (this.biltiTransactionType == 'RB') {
      this.vehicleId = selectedFrlr?.vehicleId
      this.biltiForm.patchValue({
        vehicleNumber: selectedFrlr?.vehicles?.vehicleNumber,
        vehicleSize: selectedFrlr?.vehicles?.vehicleSize?.value,
      })
    } else {
      this.vehicleId = vehicleNumber?.id;
      this.biltiForm.patchValue({
      vehicleNumber: this.vehicleNumber,
      vehicleSize: this.vehicleSizeData?.code,
    })
    }
     const frlrTransporterCode = this.transporterMapCode[selected?.transporterId]
     
     this.transporters = this.transportersList.find((item: any) => {
      return item?.transporterCode == frlrTransporterCode || item?.id == selected?.transporterId;
     })
    //  this.transporterMode = this.transporters?.transporterMappings?.map((item: any) => item) || [];
     const uniquevalues = new Set();
     this.transporterMode =  this.transporters?.transporterMappings
       ?.filter((item: any) => {
         const value = item.transportationMode.value;
         if (!uniquevalues.has(value)) {
          uniquevalues.add(value);
           return true;
         }
         return false;
       }) || [];
       const modeofTransport = this.transporterMode.find((mode: any) => mode.transportationMode.value === 'Road');
       this.taxationType = modeofTransport?.taxationType?.code;
       this.tdsCode = modeofTransport?.tdsCodes?.code;
       this.taxCode = modeofTransport?.taxCodes?.code;
       if (modeofTransport) {
         this.biltiForm.patchValue({ transporterMode: modeofTransport });
       }
    if (this.biltiId == 0) {
      this.patchTransactionType(this.biltiTransactionType)
    } else {
      this.patchTransactionType(this.selectedTransactionTypeCode)
    }
    const patchedVehicleSize = this.biltiForm.controls['vehicleSize'].value;
    this.freightListFiltered = this.filteredFreights.filter((item: any) => item?.vehicleSize?.code?.toLowerCase() == patchedVehicleSize?.toLowerCase())
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
  return this.vehicleService.getVehicles(data).pipe(
    tap((response: any) => {
      this.vehiclesList = response.vehicles;
      this.filteredVehiclesLists = this.vehiclesList.filter(
        (vehicles: any) => vehicles.status === 'Active'
      );
    })
  );
}


  getAllTransportersList() {
    const data = {
      transporterCode: '',
      transporterName: '',
    };
    return this.transporterService.getTransporters(data).pipe(
      tap((response: any) => {
        this.transportersList = response.transporters;
        this.filteredTransportersLists = this.transportersList.filter(
          (transporters: any) => transporters.status === 'Active'
        );
        this.onChangeLocation(this.selectedLocationId)
      })
    );
  }
  

  onTransporterChange(data: any) {
    const matchedTransporterData = this.transportersList.find((item: any) => item?.transporterCode == data);
    this.autobiltiRequiredFlag = matchedTransporterData?.autoBiltiRequiredFlag;
    this.biltiForm.patchValue({
      transporterMode: null
    });
    this.transportersList.forEach((transporter: any) => {
      if (transporter.transporterCode === data) {
        this.transporterId = transporter.id;
        this.biltiForm.patchValue({
          transporterName: transporter.transporterName,
        });
      }
    });
    
    this.transporters = this.transportersList.find((item: any) => {
      return item.transporterCode == data;
     })
     this.activeTransporterMappings = this.transporters?.transporterMappings?.filter((item: any) => item.status == 'Active');
     const uniquevalues = new Set();
     this.transporterMode = this.activeTransporterMappings
       ?.filter((item: any) => {
         const value = item.transportationMode.value;
         if (!uniquevalues.has(value)) {
          uniquevalues.add(value);
           return true;
         }
         return false;
       }) || [];
       const modeofTransport = this.transporterMode.find((mode: any) => mode.transportationMode.value === 'Road');
       if (modeofTransport) {
         this.biltiForm.patchValue({ transporterMode: modeofTransport });
       }

     
    //  if(this.transporterMode.length == 1 ){
    //   this.biltiForm.patchValue({
    //     transporterMode: this.transporterMode[0]?.transportationMode.value || null
    // })
    
    // this.taxationType = this.transporterMode[0]?.taxationType.value;
    // this.tdsCode = this.transporterMode[0]?.tdsCodes.code;
    // this.taxCode = this.transporterMode[0]?.taxCodes.code;
    // this.modeofTransport =  this.transporterMode[0]?.transportationMode.value;
    
    //  }
  }

  onChangeMode(data: any){
      this.taxationType = data?.taxationType?.code;
      this.tdsCode = data?.tdsCodes?.code;
      this.taxCode = data?.taxCodes?.code;
      this.modeofTransport = data?.transportationMode.value;
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
    this.vehicleNumber = data.vehicleNumber
    const patchedVehicleSize = this.biltiForm.controls['vehicleSize'].value;
    this.freightListFiltered = this.filteredFreights.filter((item: any) => item?.vehicleSize?.code?.toLowerCase() == patchedVehicleSize?.toLowerCase())
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
    }
    return this.freightService.getFreightsList(data).pipe(
      tap((response: any) => {
        this.freightList = response.freights;
        this.filteredFreightsLists = this.freightList.filter(
          (freight: any) => freight.status === 'Active'
        );
      })
    );
  }

  onFreightChange(data: any) {
    // const source = data.source?.freightCity;
    // const destination = data.destination?.value;

    // const reorderedRows = this.displayRows.filter((row: any) => row?.pointName?.toLowerCase() !== source?.toLowerCase() && row?.pointName?.toLowerCase() !== destination?.toLowerCase());
    // const sourceRows = this.displayRows.filter((row: any) => row?.pointName?.toLowerCase() === source?.toLowerCase());
    // const destinationRows = this.displayRows.filter((row: any) => row?.pointName?.toLowerCase() === destination?.toLowerCase());

    // this.displayRows = [...sourceRows, ...reorderedRows, ...destinationRows];

    // const vendorsArrays = this.biltiForm.get('vendors') as FormArray;

    // this.displayRows.forEach((row: any, index: number) => {
    //   const vendorGroup = vendorsArrays.at(index) as FormGroup;
    //   if (this.biltiTransactionType === 'STO' || this.selectedTransactionTypeCode === 'STO' ||
    //     this.biltiTransactionType === 'CWC' || this.selectedTransactionTypeCode === 'CWC') {
          
    //       vendorGroup?.patchValue({
    //         documentrefNo: row.documentrefNo || row?.documentReferenceNo,
    //         vendorCode: row?.toDestination || row?.vendorCode,
    //         vendorName: row?.vendorName,
    //         pointName: row?.pointName,
    //         paidByDetails: 'Paid by LG'
    //       });
    //   } else {
    //     const toDestination = row?.toDestination;
    //     vendorGroup?.patchValue({
    //       documentrefNo: row?.documentrefNo || row?.documentReferenceNo,
    //       vendorCode: this.biltiTransactionType === 'RB' || this.selectedTransactionTypeCode === 'RB' ? row?.vendorId : this.vendorIdMap[toDestination],
    //       vendorName: this.biltiTransactionType === 'RB' || this.selectedTransactionTypeCode === 'RB' ? row?.vendorName : this.vendorMapName[toDestination],
    //       pointName: this.biltiTransactionType === 'RB' || this.selectedTransactionTypeCode === 'RB' ? row?.pointName : this.pointMapName[toDestination],
    //       paidByDetails: this.biltiTransactionType === 'RB' || this.selectedTransactionTypeCode === 'RB' ? row?.paidByDetails : this.paidByDetailsMap[toDestination]
    //     });
    //   }
    // });

    // const vendorsArray = this.biltiForm.get('vendors') as FormArray;

    // for (let i = 0; i < vendorsArray.length; i++) {
    //   const currentVendor = vendorsArray.at(i) as FormGroup;
    //   const prevVendor = vendorsArray.at(i - 1) as FormGroup;

    //   const currentPointName = currentVendor.value.pointName?.toLowerCase();
    //   const currentVendorCode = currentVendor.value.vendorCode;
    //   const prevPointName = prevVendor?.value.pointName?.toLowerCase();
    //   const prevVendorCode = prevVendor?.value.vendorCode;

    //   const sameVendorAndPoint = currentPointName === prevPointName && currentVendorCode === prevVendorCode;

    //   if (currentPointName === destination?.toLowerCase()) {
    //     currentVendor.patchValue({
    //       pointCharge: 0
    //     });
    //   } else {
    //     const samePointName = currentPointName === prevPointName;
    //     const lineItemsVendorData = this.vendorList.find((element: any) => {
    //       return element?.freightCity?.toLowerCase() === currentPointName;
    //     });
    
    //     const lineItemsSameLocationCharge = this.pointChargesList.find((item: any) => {
    //       return item.pointName?.toLowerCase() === lineItemsVendorData?.freightCity?.toLowerCase();
    //     });

    //     currentVendor.patchValue({
    //       pointCharge: sameVendorAndPoint
    //         ? 0
    //         : samePointName
    //         ? lineItemsSameLocationCharge?.sameLocationCharge
    //         : lineItemsSameLocationCharge?.pointCharge
    //     });
    //   }
    // }

    this.freightId = data.id;
    this.freightCode = data.freightCode;
    this.biltiForm.patchValue({
      freightAmount: data?.freightAmount,
      source: data?.source?.freightCity,
      destination: data?.destination?.value
    });

    // if (
    //   this.displayRows.length === 1 &&
    //   (this.displayRows[this.displayRows.length - 1].pointName?.toLowerCase() !== destination?.toLowerCase())
    // ) {
    //   this.toastr.error('Invalid Freight Code');
    //   return;
    // } else if (this.displayRows.length > 1 &&
    //   (this.displayRows[0].pointName?.toLowerCase() !== source?.toLowerCase() || this.displayRows[this.displayRows.length - 1].pointName?.toLowerCase() !== destination?.toLowerCase())) {
    //   this.toastr.error('Invalid Freight Code');
    //   return;
    // }
  }


  onFreightClear() {
    this.biltiForm.patchValue({
      source: null,
      destination: null,
      freightAmount: null,
    });
  }

  calculatePointCharge() {
    const allDispatchNumbers = [...(this.rbDispatchNumbers || []), ...(this.patchedRbDispatchNotes || [])];
    
    if(this.biltiId > 0){
      const data = {
        "frlrNumber": this.selectedFrlr,
        "dispatchNumbers": allDispatchNumbers || [],
        "freightCode": this.freightCode,
        "transactionTypeCode": this.selectedTransactionTypePatchCode
       }
   
       this.biltiService.calculatePointCharge(data).subscribe((res: any) => {
         this.pointChargeData = res;
         if(res[0].errorMessage != null){
           this.toastr.error(res[0].errorMessage);
           return;
         }
         this.isPointChargeCalculated = true;
       const vendorsArray = this.biltiForm.get('vendors') as FormArray;
   
       res?.forEach((item: any, index: number) => {
         vendorsArray.at(index).patchValue({
           vendorCode: item?.toDestination,
           vendorName: item?.vendorNameOrPlantDesc,
           pointName: item?.freightCity,
           pointCharge: item?.pointCharge ? item?.pointCharge : item?.sameLocationCharge  || 0,
           // remarks: item?.skipReason || '',
           documentrefNo: item?.documentNumber,
           biltiDetailsTransactionType: item?.documentType,
           source: item?.fromDestination,
           paidByDetails: item?.paidByDetails
         });
       });
       })
    } else {
      const data = {
        "frlrNumber": this.selectedFrlr,
        "dispatchNumbers": this.rbDispatchNumbers || [],
        "freightCode": this.freightCode,
        "transactionTypeCode": this.biltiTransactionType
       }
   
       this.biltiService.calculatePointCharge(data).subscribe((res: any) => {
         this.pointChargeData = res;
         if(res[0].errorMessage != null){
           this.toastr.error(res[0].errorMessage);
           return;
         }
         this.isPointChargeCalculated = true;
       const vendorsArray = this.biltiForm.get('vendors') as FormArray;
   
       res?.forEach((item: any, index: number) => {
         vendorsArray.at(index).patchValue({
           vendorCode: item?.toDestination,
           vendorName: item?.vendorNameOrPlantDesc,
           pointName: item?.freightCity,
           pointCharge: item?.pointCharge ? item?.pointCharge : item?.sameLocationCharge  || 0,
           // remarks: item?.skipReason || '',
           documentrefNo: item?.documentNumber,
           biltiDetailsTransactionType: item?.documentType,
           source: item?.fromDestination,
           paidByDetails: item?.paidByDetails
         });
       });
       })
    }
  }

  getAllVendorList() {
    const data = {
      vendorCode: '',
      vendorName: '',
    };
    return this.vendorService.getVendors(data).pipe(
      tap((response: any) => {
        this.vendorList = response.vendors;
        this.filteredVendorcode = this.vendorList.filter(
          (vendors: any) => vendors.status === 'Active' || vendors.status === 'ACTIVE'
        );
      })
    );
  }

  getAllPointChargesList() {
    const data = {
      pointName: '',
      locationIds: []
    };
    return this.pointChargeService.getPointCharges(data).pipe(
      tap((response: any) => {
        this.pointChargesList = response.pointCharges;
        this.filteredPointname = this.pointChargesList.filter(
          (pointname: any) => pointname.status === 'Active'
        );
      })
    );
  }

  onPressSave() {
    const locationCode = this.biltiForm.controls['locationId']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == locationCode);
    const matchedLocationId = matchedLocation?.id;
    this.loadSpinner = true;
    const formData = this.biltiForm.value;
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
    const loadingLocationData = this.loadingLocation.find((item: any) => item.id == formData?.loadingLocation);
    const loadingLocationValue = loadingLocationData?.value;
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
        transporterTypeFlag: transporterTypeFlag,
        transporterName: formData?.transporterName,
        freightId: this.freightId,
        freightCode: formData?.freightCode?.freightCode,
        freightAmount: formData?.freightAmount,
        loadingLocationId: this.biltiForm.controls['loadingLocation'].value,
        loadingLocationValue: loadingLocationValue,
        source: formData?.source,
        destination: formData?.destination,
        vehicleId: this.vehicleId,
        vehicleNumber:
          formData.transactionType.code === 'RB'
            ? formData?.vehicleNumber?.vehicleNumber || formData?.vehicleNumber
            : formData?.vehicleNumber?.vehicleNumber || formData?.vehicleNumber,
        vehicleSize: formData?.vehicleSize,
        attribute9: '2024-05-04T13:03:47.509Z',
        attribute10: '2024-05-04T13:03:47.509Z',
        transporterMode: formData?.transporterMode?.transportationMode?.value,
        taxationType: this.taxationType,
        taxCode: this.taxCode,
        tdsCode: this.tdsCode,
        biltiNumber: this.biltiForm.controls['biltiNumber'].value,
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
        const matchingVendor = this.vendorList.find((vendor: any) => vendor.id === vendorControl.vendorCode);
        const matchingPlant = this.plantsList.find((item: any) => item?.plantCode == vendorControl?.vendorCode)
        
        const matchedLineitems = this.allFrmTransactionData.filter((item: any) => {
          return item.documentNumber == vendorControl?.documentrefNo
        }
        ) 
        
        if(formData.transactionType.code === 'CWC' || formData.transactionType.code === 'STO'){
          this.createLineItem = {
            // vendorId: matchingPlant.id,
            vendorCode: formData?.vendors[index].vendorCode,
            vendorName: formData?.vendors[index].vendorName,
            actionBy: localStorage.getItem("userId") || '',
            remarks: vendorControl?.remarks,
            frmId: this.pointChargeData[index]?.documentType == 'RB' ? 0 : this.pointChargeData[index]?.id,
            dispatchNoteId: this.pointChargeData[index]?.documentType == 'RB' ? this.pointChargeData[index]?.id : 0,
            documentReferenceNo: vendorControl.documentrefNo,
            pointCharge: parseInt(vendorControl?.pointCharge) || 0,
            pointName: vendorControl.pointName,
            plantCode: formData?.vendors[index].source,
            paidByDetails: formData?.vendors[index].paidByDetails,
            sequenceNumber: index + 1
          };
        } else {
          this.createLineItem = {
            // vendorId: formData.transactionType.code === 'RB'? vendorControl.vendorCode: formData?.vendors[index].vendorCode,
            vendorCode: formData?.vendors[index].vendorCode,
            vendorName: formData.transactionType.code === 'RB'? vendorControl.vendorName: formData?.vendors[index].vendorName,
            actionBy: localStorage.getItem("userId") || '',
            remarks: vendorControl?.remarks,
            frmId: this.pointChargeData[index]?.documentType == 'RB' ? 0 : this.pointChargeData[index]?.id,
            dispatchNoteId: this.pointChargeData[index]?.documentType == 'RB' ? this.pointChargeData[index]?.id : 0,
            documentReferenceNo: vendorControl.documentrefNo,
            pointCharge: parseInt(vendorControl?.pointCharge) || 0,
            pointName: vendorControl.pointName,
            plantCode: formData?.vendors[index].source,
            paidByDetails: formData?.vendors[index].paidByDetails,
            sequenceNumber: index + 1
          };
        }
       
       
        if(data.lineItemsEntity[0].vendorId == 0){
          data.lineItemsEntity[0] = this.createLineItem
        }else{
          data.lineItemsEntity.push(this.createLineItem);
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
        vehicleNumber: this.vehicleNumber,
        vehicleSize: formData?.vehicleSize,
        transporterCode: formData?.transporterCode,
        transporterTypeFlag :transporterTypeFlag,
        transporterName: formData?.transporterName,
        source: formData?.source,
        destination: formData?.destination,
        freightCode: this.freightCode,
        freightAmount: formData?.freightAmount,
        loadingLocationValue :loadingLocationValue,
        transporterMode: this.modeofTransport,
        taxationType: this.taxationType,
        taxCode: this.taxCode,
        tdsCode: this.tdsCode,
        biltiNumber: this.biltiForm.controls['biltiNumber'].value,
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
        
        const matchingVendor = this.vendorList?.find((vendor: any) => vendor?.vendorCode === vendorControl?.vendorCode || vendor?.id === vendorControl.vendorCode );
        const matchedLineitems = this.allFrmTransactionData.filter((item: any) => {
          return item.documentNumber == vendorControl.documentrefNo
        }
        )

        if(formData.transactionType.code === 'STO' || formData.transactionType.code === 'CWC' || vendorControl.biltiDetailsTransactionType === 'STO' || vendorControl.biltiDetailsTransactionType === 'CWC'){
          this.createLineItem = {
            // vendorId: this.selectedTransactionTypePatchCode === 'RB'? this.matchedDispatchNotes[index]?.suppliers?.id || matchingVendor?.id : formData?.vendors[index].vendorCode,
            actionBy: localStorage.getItem("userId") || '',
            remarks: vendorControl?.remarks,
            attribute9: new Date().toISOString(),
            attribute10: new Date().toISOString(),
            status: vendorControl?.biltiStatus,
            id: this.lineItemId,
            frmId: this.pointChargeData.length ? this.pointChargeData[index]?.id : this.displayRows[index]?.frmId,
            dispatchNoteId:  0,
            documentReferenceNo: vendorControl.documentrefNo,
            pointCharge: parseInt(vendorControl?.pointCharge) || 0,
            vendorCode:formData?.vendors[index]?.vendorCode,
            vendorName: formData?.vendors[index]?.vendorName,
            pointName: vendorControl.pointName,
            plantCode: formData?.vendors[index].source,
            paidByDetails: vendorControl.paidByDetails,
            sequenceNumber: index + 1
          };
        }else {
          this.createLineItem = {
            // vendorId: this.selectedTransactionTypePatchCode === 'RB'? this.matchedDispatchNotes[index]?.suppliers?.id || matchingVendor?.id : formData?.vendors[index].vendorCode,
            actionBy: localStorage.getItem("userId") || '',
            remarks: vendorControl?.remarks,
            attribute9: new Date().toISOString(),
            attribute10: new Date().toISOString(),
            status: vendorControl?.biltiStatus,
            id: this.lineItemId,
            frmId: this.pointChargeData.length? this.pointChargeData[index]?.documentType == 'RB' ? 0 : this.pointChargeData[index]?.id : this.displayRows[index]?.frmId,
            dispatchNoteId: vendorControl.biltiDetailsTransactionType === 'RB' ?  this.combinedRows[index]?.dispatchNoteId || this.dispatchNoteId : 0,
            documentReferenceNo: vendorControl.documentrefNo,
            pointCharge: parseInt(vendorControl?.pointCharge) || 0,
            vendorCode: formData.transactionType.code === 'RB' || vendorControl.biltiDetailsTransactionType === 'RB' ? matchingVendor?.vendorCode: matchingVendor?.vendorCode,
            vendorName: formData.transactionType.code === 'RB' || vendorControl.biltiDetailsTransactionType === 'RB'? vendorControl?.vendorName: formData?.vendors[index]?.vendorName,
            pointName: vendorControl.pointName,
            plantCode: formData?.vendors[index].source,
            paidByDetails: vendorControl.paidByDetails || "",
            sequenceNumber: index + 1
          };
        }
        
        if(data.lineItemsEntity[0].vendorId == 0){
          data.lineItemsEntity[0] = this.createLineItem
        }else{
          data.lineItemsEntity.push(this.createLineItem);
        }
        if (this.lineItem.length > 1) {
          data.lineItemsEntity.forEach((item, index) => {
            item.id = this.lineItem[index]?.id || 0;
          });
        } else if (this.lineItem.length === 1) {

          data.lineItemsEntity[0].id = this.lineItem[0].id || 0;
        }
      })
      this.biltiService.updateBilti(matchedLocationId,this.biltiId, data).subscribe(
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
    const data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'LoadingLocation';
    return this.biltiService.getLoadingLocation(data, type).pipe(
      tap((res: any) => {
        this.loadingLocation = res.lookUps.filter(
          (item: any) => item.status === 'Active'
        );
        this.filteredLoadinglocation = this.loadingLocation.filter(
          (locations: any) => locations.status === 'Active'
        );
      })
    );
  }

  getBiltiData(biltiId: number) {
    this.biltiService.getBiltiData(this.biltiLocationId,biltiId).subscribe(
      (response: any) => {
        this.selectedFrlr = response?.frlrNumber
        this.onChangeLocation(response?.locationId);
        this.onTransporterChange(response?.transporterCode)
        this.lineItem = response.biltiCreationLineItems;
        this.filteredFreights = this.filteredFreightsLists.filter((item: any) => item?.locations?.id == response?.locationId);
        this.freightListFiltered = this.filteredFreights.filter((item: any) => item?.vehicleSize?.code?.toLowerCase() == response.vehicleSize?.toLowerCase())
        
        const transactionTypeId = response.transactionTypeId;
        const transactionType = this.transactionTypesLists.find(
          (type: any) => type.transactionTypeId === transactionTypeId
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
        this.freightId = response?.freightId;
        
        const freight = this.freightList.find(
          (freight: any) => freight?.id === this.freightId
        );
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
        this.selectedTransactionTypePatchCode = transactionType?.code;
        this.displayRows = response.biltiCreationLineItems;
        const vendorControls = this.displayRows.map((vendor: any) => this.createVendorGroup(vendor));
        this.biltiForm.setControl('vendors', this.fb.array(vendorControls));
        const vendorsArray = this.biltiForm.get('vendors') as FormArray;
    vendorsArray.controls.forEach((vendorGroup: any) => {
      
      vendorGroup.patchValue({
        
      });
    });
    this.biltiCreationLineItemsData = response?.biltiCreationLineItems.sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber)
    console.log(this.biltiCreationLineItemsData);
    
    this.patchedRbDispatchNotes = this.biltiCreationLineItemsData.filter((item: any) => item.dispatchNoteId !== 0)
    .map((item: any) => item.documentReferenceNo);
    vendorsArray.controls.forEach((vendorGroup, index) => {
      const vendorId = this.biltiCreationLineItemsData[index]?.vendorCode;
      const remarks = this.biltiCreationLineItemsData[index]?.remarks;
      this.frmId = response?.biltiCreationLineItems[index]?.frmId;
      this.lineItemId = response?.biltiCreationLineItems[index]?.id;
      const biltiStatus = this.biltiCreationLineItemsData[index]?.status;
      const vendor = this.vendorList.find((vendor: any) => vendor?.vendorCode === vendorId)
      
      this.dispatchNoteId = this.biltiCreationLineItemsData[index]?.dispatchNoteId;
      this.selectedPlantCode = this.biltiCreationLineItemsData[index]?.plantCode
      
        vendorGroup.patchValue({
          pointCharge: this.biltiCreationLineItemsData[index]?.pointCharge,
          pointName: this.biltiCreationLineItemsData[index]?.pointName,
          paidByDetails: this.biltiCreationLineItemsData[index]?.paidByDetails,
          biltiDetailsTransactionType:this.biltiCreationLineItemsData[index]?.dispatchNoteId == 0 ?transactionType?.code : 'RB',
          source: this.biltiCreationLineItemsData[index]?.plantCode
        });
        this.patchedPointName = this.biltiCreationLineItemsData[0]?.vendor?.cityDetail?.value
    if(this.selectedTransactionTypePatchCode =='RB'){
      vendorGroup.patchValue({
        vendorCode: this.lineItem[index]?.vendorCode,
        vendorName: this.lineItem[index]?.vendorName,
        remarks: remarks,
        biltiStatus: biltiStatus,
      });
        vendorGroup.patchValue({
          documentrefNo: this.lineItem[index]?.documentReferenceNo,

        });
    }else{
      vendorGroup.patchValue({
        vendorCode: this.lineItem[index]?.vendorCode,
        vendorName: this.lineItem[index]?.vendorName,
        remarks: remarks,
        biltiStatus: biltiStatus,
      });
        vendorGroup.patchValue({
          documentrefNo: this.lineItem[index]?.documentReferenceNo,
        });
    }
    });
    this.vehicleNumber = response?.vehicleNumber;
    this.freightCode = response?.freightCode;
        this.biltiForm.patchValue({
          transactionType: transactionType?.code + ' (' + transactionType.name + ')',
          frlrNo: response?.frlrNumber,
          vehicleNumber: response?.vehicleNumber,
          vehicleSize: response?.vehicleSize,
          transporterCode: transporter?.transporterCode,
          transporterName: transporter?.transporterName,
          freightCode: response?.freightCode,
          freightAmount: response?.freightAmount,
          source: response?.source,
          destination: response?.destination,
          loadingLocation: location?.id,
          locationId: response.locationDetail.code,
          transporterMode: response.transporterMode,
          biltiNumber: response?.biltiNumber
        });
        this.transporters = this.transportersList.find((item: any) => {
          return item.transporterCode == transporter?.transporterCode;
         })
         const uniquevalues = new Set();
         this.transporterMode =  this.transporters?.transporterMappings
           ?.filter((item: any) => {
             const value = item.transportationMode.value;
             if (!uniquevalues.has(value)) {
              uniquevalues.add(value);
               return true;
             }
             return false;
           }) || [];
         this.taxationType = response?.taxationType;
        this.tdsCode = response?.tdsCode;
        this.taxCode = response?.taxCode;
        
        this.modeofTransport =  response?.transporterMode;
         
        if(this.selectedTransactionTypeCode == "RB"){
          this.getDispatchData();
        } else {
          this.getFrlr(this.selectedTransactionTypeCode);
        }
      }
    );
  }

  setLocation(){
    if(!this.biltiId){
      this.lookUpService.setLocationId(this.biltiForm, this.commonLocations, 'locationId');
    }
  }

  getEditBiltiData() {
    return this.biltiService.getBiltis({ biltiNumber: '', locationIds: APIConstant.commonLocationsList.map((e: any) => e.id) })
      .pipe(
        tap((response: any) => {
          this.biltisList = response.biltiCreations;
          this.getLocationId().then(() => {
            this.getBiltiData(this.biltiId);
          });
        })
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
    size: 'xl',
    backdrop: 'static',
    windowClass: 'modal-width',
  });
  documentModal.componentInstance.title = 'rbTXNData';
  documentModal.componentInstance.biltiTransactionType = this.biltiTransactionType,
  documentModal.componentInstance.selectedTransactionTypeCode = this.selectedTransactionTypeCode,
  documentModal.componentInstance.dispatchNoteId = this.biltiCreationLineItemsData,
  documentModal.componentInstance.transporterCode = this.biltiForm.controls['transporterCode']?.value,
  documentModal.componentInstance.vendorCode = this.vendorCode,

  documentModal.result.then((selectedNotes) => {
    if (selectedNotes) {
      this.rbSelectedNotes = selectedNotes.length;
     this.rbDispatchNumbers = selectedNotes.map((note: any) => note.dispatchNumber);
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
        this.displayRowsRb.push({
          documentrefNo: element?.dispatchNumber,
          vendorName: element?.suppliers?.vendorName,
          pointName: element?.suppliers?.freightCity,
          pointCharge: 0,
          vendorCode: element?.suppliers?.id,
          biltiDetailsTransactionType: 'RB',
          dispatchNoteId: element.id,
          paidByDetails: matchingPaidByDetails?.value
        });
      });
  
      this.combinedRows = [...existingRows, ...this.displayRowsRb];
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
          paidByDetails: row?.paidByDetails,
          source: row?.source
        });
      });
    }
  });
  
}

disabledonAdd(){
  const selectedTransation = this.biltiForm.controls['transactionType'].value;
  return !this.biltiForm.controls['transactionType'].value || !(selectedTransation?.code == 'RTV-RB' || this.selectedTransactionTypeCode == 'RTV-RB' || this.selectedTransactionTypePatchCode == 'RTV-RB' || 
  selectedTransation?.code == 'INVOICE-RB' || this.selectedTransactionTypeCode == 'INVOICE-RB' || this.selectedTransactionTypePatchCode == 'INVOICE-RB')
}

disablePointCharge(){
  const selectedTransation = this.biltiForm.controls['transactionType'].value;
  return !this.biltiForm.controls['transactionType'].value || !this.biltiForm.controls['freightCode'].value || 
  !this.biltiForm.controls['frlrNo'].value || (this.rbSelectedNotes == 0 && selectedTransation?.code == 'RTV-RB') 
  || (this.rbSelectedNotes == 0 && selectedTransation?.code == 'INVOICE-RB')
}

onChangeLocation(data: any){
  this.selectedLocationId = data;
  const selectedLocationName  = this.locationsDropdownData.find((item: any) => item?.id == data)?.code

this.plantCodes.forEach(item => {
  item.location.forEach((loc: any) => {
    if (loc.name === selectedLocationName) {
      this.matchedPlants = loc.whCode;
    }
  });
});

  this.filteredTransporter = this.filteredTransportersLists.filter((item: any) => {
    return item.transporterMappings.some((mapping: any) => mapping.locationId === data);
  });
  this.filteredVehicles = this.filteredVehiclesLists.filter((item: any) => item?.locations?.id == data);
  this.filteredFreights = this.filteredFreightsLists.filter((item: any) => item?.locations?.id == data);
  this.biltiForm.patchValue({
    vehicleNumber: null,
    transporterName: null
  })
  this.biltiForm.patchValue({
    transporterCode: null,
    vehicleSize: null
  })
  this.biltiForm.patchValue({
    freightCode: null,
    source: null,
    destination: null,
    freightAmount: null
  })
  
  const vendorsArray = this.biltiForm.get('vendors') as FormArray;
  vendorsArray.controls.forEach((vendorGroup) => {
    vendorGroup.patchValue({
      vendorCode: null,
      vendorName: null,
      pointName: null,
      pointCharge: null,
      remarks: null,
      paidByDetails: null,
      documentrefNo: null,
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
    freightAmount: null,
    transactionType: null,
    frlrNo: null
  })
}

getPlantsList() {
  const data = {
    locationIds: [],
    plantCode: '',
    auCode: '',
    siteCode: '',
    status: '',
  };

  return this.plantService.getPlants(data).pipe(
    tap((response: any) => {
      this.plantsList = response.plants;
    }),
  );
}

disableSave(){
  return (!this.isPointChargeCalculated && this.biltiId == 0) || (this.rbSelectedNotes != 0 && this.biltiId > 0 && !this.isPointChargeCalculated)
}
  
}
