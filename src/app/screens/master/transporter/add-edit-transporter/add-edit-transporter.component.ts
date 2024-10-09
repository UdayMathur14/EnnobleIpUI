import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransporterService } from '../../../../core/service/transporter.service';
import { APIConstant } from '../../../../core/constants';
import { TransporterDataModel, TransporterListingModel } from '../../../../core/model/masterModels.model';
import { VendorService } from '../../../../core/service/vendor.service';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-transporter',
  templateUrl: './add-edit-transporter.component.html',
  styleUrl: './add-edit-transporter.component.scss'
})
export class AddEditTransporterComponent implements OnInit {
  
  transporterForm: FormGroup;
  queryData: any;
  loadSpinner: boolean = true;
  transportMode: any = [];
  taxationCode: any;
  transporterMode: any[] = []
  rcmNonRcmType: any[] = []
  tdsCodes: any[] = []
  disableSubmit: boolean = false;
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  transporterData!: TransporterDataModel;
  transporterMappings: any = [];
  transporters: any[] = [];
  vendorsList: any = [];
  count: number = Number.MAX_VALUE;
  selectedVendor: any = [];
  isShow: boolean = false;
  isLocationDisabled: boolean = false;
  taxCodesRcm: any[] = [];
  taxCodesNonRcm: any[] = [];
  selectedModes: Set<any> = new Set();
  transporterLocationId: number = 0;
  transporterList: any = [];
  alltransporterMode: any = [];
  autoBiltiRequiredFlag: string = '';
  locationsDropdownData: any = [];
  selectedLocations: number[] = [];

  constructor(private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _Activatedroute: ActivatedRoute,
    private transporterService: TransporterService,
    private vendorService: VendorService,
    private lookupService: LookupService) {
    this.transporterForm = this.formBuilder.group({
      transporterCode: [''],
      transporterName: [''],
      locationCode: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      ownerName: [''],
      contactPerson: [''],
      address1: [''],
      address2: [''],
      contactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      pan: [''],
      gst: [''],
      autoBiltiReq: [''],
      consignorContactInfo: [''],
      autoBiltiCharactor: ['', Validators.required],
      consignorName: [''],
      regdDetails: [''],
      modeOfTransport: ['', Validators.required],
      biltiHeaderComment: ['', [Validators.required]],
      note: ['', [Validators.required]],
      footer: ['', [Validators.required]],
      transporterMailId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      postalCode: [''],
      taxationCode: ['', Validators.required],
      rcmNonRcm: [''],
      sgst: [''],
      cgst: [''],
      igst: [''],
      transporterPaymentGroup: [''],
      transporterPaymentTermsName: [''],
      transporterPaytermDays: [''],
      transporterPaytermMethodCode: [''],
    });
  }

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
    this.queryData = this._Activatedroute.snapshot.paramMap.get("transporterCode");
    this.queryData = this.queryData == 0 ? '' : this.queryData;
    if (this.queryData != 0) {
      this.getTransportersList();
      this.getTransporterData();
    }
    // Enable or disable status control based on queryData for Create and Update
    this.getTransporterModeDropdownData();
    this.getTaxationcode();
    this.getVendorsList();
    this.getRCMNonRCMTypeDropdownData();
    this.getTdsCodesDropdownData();
    this.getTaxCodesNonRcmDropdownData();
    this.getTaxCodesRcmDropdownData();
    this.setLocation();
  }

  getTransporterData() {
    this.transporterService.getTransporterData(this.queryData).subscribe((response: any) => {
      this.loadSpinner = false;
      this.transporterList = response;
      this.transporterMappings = response?.transporterMappings;
      this.selectedModes.clear();
      this.transporterForm.patchValue({
        transporterCode: response.transporterCode,
        transporterName: response.transporterName,
        // locationCode: response.locations?.code,
        status: response.status,
        ownerName: response.ownerName,
        contactPerson: response.contactPerson,
        address1: response.transporterAddress1,
        address2: response.transporterAddress2,
        contactNumber: response.transporterContactNo,
        pan: response.panNo,
        gst: response.gstInNo,
        autoBiltiReq: response.autoBiltiRequiredFlag,
        consignorContactInfo: response.consignorContactInformation,
        rcmNonRcm: response.taxationType?.attribute8 === 1 ? 'RCM' : 'Non RCM',
        autoBiltiCharactor: response.autoBiltiStartingCharacter,
        consignorName: response.consignorName,
        regdDetails: response.regdDetails,
        modeOfTransport: response.transporterMode?.id,
        biltiHeaderComment: response.biltiHeaderComments,
        note: response.note,
        footer: response.footer,
        transporterMailId: response.transporterMailId,
        postalCode: response.postalCode,
        cgst: response.taxationType?.attribute5,
        sgst: response.taxationType?.attribute6,
        igst: response.taxationType?.attribute7,
        taxationCode: response.taxationType?.id,
        transporterPaymentGroup: response?.transporterPaymentGroup,
        transporterPaymentTermsName: response?.transporterPaymentTermsName,
        transporterPaytermDays: response?.transporterPaytermDays,
        transporterPaytermMethodCode: response?.transporterPaytermMethodCode
      });
      // this.getLocationData(response.locationId)
      this.transporterData = response
      this.transporterMappings = response.transporterMappings.map((mapping: any) => {
        const transportationModeId = mapping?.transportationMode?.code;
        // this.selectedLocations.push(mapping.locationId);
        this.autoBiltiRequiredFlag = mapping?.autoBiltiRequiredFlag;
        const tdsCodes = this.tdsCodes?.find((item: any) => item?.id == mapping?.tdsCodes?.id)
        const taxCodeRcm = this.taxCodesRcm?.find((item: any) => item?.id == mapping?.taxCodes?.id);
        const taxCodeNonRcm = this.taxCodesNonRcm?.find((item: any) => item?.id == mapping?.taxCodes?.id);
        const taxaCodeDescription = taxCodeRcm ? taxCodeRcm.description : (taxCodeNonRcm ? taxCodeNonRcm.description : '');
        // this.selectedModes.add({
        //   transporterModeId: mapping.transportationMode.id,
        //   location: mapping.locationId
        // });
        
        return {
          transportationMode: mapping?.transportationMode?.value || {},
          taxationType: mapping.taxationType.code || {},
          taxaCode: mapping.taxCodes.code || {},
          tdsCode: mapping.tdsCodes.code,
          transportationModeId: mapping?.transportationMode?.id,
          taxationTypeId: mapping?.taxationType?.id,
          taxaCodesId: mapping?.taxCodes?.id,
          tdsCodesId: mapping?.tdsCodes.id,
          status: 'Active',
          disabled: true,
          isShow: false,
          isLocationDisabled: true,
          location: mapping?.locationId,
          autoBilti: mapping?.autoBiltiStartingCharacter,
          consignerName: mapping?.consignorName,
          consignerContact: mapping?.consignorContactInformation,
          autoBiltiReq: mapping?.autoBiltiRequiredFlag,
        };
      });
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
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

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onSavePress() {
    // if (!this.transporterForm.valid) return
    this.loadSpinner = true;

    const data = {
      status: this.transporterForm.controls['status'].value,
      actionBy: localStorage.getItem('userId'),
      ownerName: this.transporterForm.controls['ownerName'].value,
      contactPerson: this.transporterForm.controls['contactPerson'].value,
      transporterContactNo:
        this.transporterForm.controls['contactNumber'].value,
      transporterMailId:
        this.transporterForm.controls['transporterMailId'].value,
      regdDetails: this.transporterForm.controls['regdDetails'].value,
      biltiHeaderComments:
        this.transporterForm.controls['biltiHeaderComment'].value,
      note: this.transporterForm.controls['note'].value,
      footer: this.transporterForm.controls['footer'].value,
      transporterMappings: this.transporterMappings.map((mapping: any) => {
        return {
          transportationModeId: mapping?.transportationMode?.id || mapping?.transportationModeId,
          taxationTypeId: mapping?.taxationType?.id || mapping?.taxationTypeId,
          taxaCodesId: mapping?.taxaCode?.id || mapping?.taxaCodesId,
          tdsCodesId: mapping?.tdsCode?.id || mapping?.tdsCodesId,
          status: mapping.status,
          locationId: mapping?.location,
          autoBiltiRequiredFlag: mapping?.autoBiltiReq,
          autoBiltiStartingCharacter: mapping?.autoBilti,
          consignorName: mapping?.consignerName,
          consignorContactInformation: mapping?.consignerContact
        };
      }),
    };

    if (this.queryData) {
      this.updateTransporter(data);
    } else {
      this.createNewTransporter()
    }
  }

  //UPDATING TRANSPORTER DATA
  updateTransporter(data: any) {
    const locationCode = this.transporterForm.controls['locationCode']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == locationCode);
    const matchedLocationId = matchedLocation?.id
    // if (!locationCode) {
    //   this.toastr.error("Location Code is Required");
    //   this.loadSpinner = false;
    //   return;
    // }
    this.transporterService.updateTransporter(this.queryData, data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Transporter Updated Successfully');
      this.router.navigate(['/master/transporter']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //CREATING NEW TRANSPORTER
  createNewTransporter() {
    const locationCode = this.transporterForm.controls['locationCode']?.value;
    // if (!locationCode) {
    //   this.toastr.error("Location Code is Required");
    //   this.loadSpinner = false;
    //   return;
    // }
    const data = {
      status: this.transporterForm.controls['status'].value,
      actionBy: localStorage.getItem('userId'),
      ownerName: this.transporterForm.controls['ownerName'].value,
      contactPerson: this.transporterForm.controls['contactPerson'].value,
      transporterAddress1: this.transporterForm.controls['address1'].value,
      transporterAddress2: this.transporterForm.controls['address2'].value,
      transporterContactNo:
        this.transporterForm.controls['contactNumber'].value,
      transporterMailId:
        this.transporterForm.controls['transporterMailId'].value,
      regdDetails: this.transporterForm.controls['regdDetails'].value,
      biltiHeaderComments:
        this.transporterForm.controls['biltiHeaderComment'].value,
      note: this.transporterForm.controls['note'].value,
      footer: this.transporterForm.controls['footer'].value,
      transporterName: this.transporterForm.controls['transporterName'].value,
      transporterPaymentGroup: this.selectedVendor?.vendorPaymentGroup || '',
      transporterPaymentTermsName:
        this.selectedVendor?.vendorPaymentTermsName || '',
      transporterPaytermDays: this.selectedVendor?.vendorPaytermDays || 0,
      transporterPaytermMethodCode:
        this.selectedVendor?.vendorPaytermMethodCode || '',
      transporterPaytermStatus: this.selectedVendor?.vendorPaytermStatus || '',
      country: this.selectedVendor?.country || '',
      city: this.selectedVendor?.city || '',
      state: this.selectedVendor?.state || '',
      gstInNo: this.transporterForm.controls['gst'].value,
      panNo: this.transporterForm.controls['pan'].value,
      postalCode: this.transporterForm.controls['postalCode'].value,
      transporterCode: this.selectedVendor?.vendorCode || '',
      transporterMappings: this.transporterMappings.map((mapping: any) => {
        
        return {
          transportationModeId: mapping?.transportationMode?.id,
          taxationTypeId: mapping?.taxationType?.id,
          taxaCodesId: mapping?.taxaCode?.id,
          tdsCodesId: mapping?.tdsCode?.id,
          status: 'Active',
          locationId: mapping?.location,
          autoBiltiRequiredFlag: mapping?.autoBiltiReq,
          autoBiltiStartingCharacter: mapping?.autoBilti,
          consignorName: mapping?.consignerName,
          consignorContactInformation: mapping?.consignerContact
        };
      }),
    };
    this.transporterService.createTransporter(data).subscribe((response: any) => {
      this.loadSpinner = false;
      this.toastr.success('Transporter Created Successfully');
      this.router.navigate(['/master/transporter']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/transporter']);
  }

  
  getTransporterModeDropdownData() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'TransporterMode'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.alltransporterMode = res.lookUps;
      this.transporterMode = res.lookUps.filter(
        (item: any) => item?.status === 'Active')
    })
  }

  getRCMNonRCMTypeDropdownData() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'RCM_Non_RCM_Type'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.rcmNonRcmType = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  getTaxCodesRcmDropdownData() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'TaxCodesRCM'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxCodesRcm = res.lookUps.filter(
        (item: any) => item.status === 'Active');
      
    })
  }

  getTaxCodesNonRcmDropdownData() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'TaxCodesNonRCM'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxCodesNonRcm = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    })
  }

  getTdsCodesDropdownData() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'TdsCodes'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.tdsCodes = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    })
  }

  getTaxationcode() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'taxationCode'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.taxationCode = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }
  getTransporterMode() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'TransporterMode'
    this.transporterService.getDropdownData(data, type).subscribe((res: any) => {
      this.transporterMode = res.lookUps.filter(
        (item: any) => item.status === 'Active')
    })
  }

  onOptionSelected(event: any) {
    const selectedLookup = this.taxationCode.find((lookup: any) => lookup.id === event);
    this.transporterForm.patchValue({
      cgst: selectedLookup.attribute5,
      sgst: selectedLookup.attribute6,
      igst: selectedLookup.attribute7,
      rcmNonRcm: selectedLookup.attribute8 === 1 ? 'RCM' : 'Non RCM'
    });

  }

  validateNo(e: any) {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true;
  }

  phoneNumberLength(e: any) {
    this.disableSubmit = this.transporterForm.get('contactNumber')?.value.length < 10 ? true : false;
  }


  onTransporterChange(event: any){
    this.selectedVendor = this.vendorsList.find((item: any) => item.id == event)
    this.transporterForm.patchValue({
      transporterName: this.selectedVendor?.vendorName,
      address1: this.selectedVendor?.vendorAddress1,
      address2: this.selectedVendor?.vendorAddress2,
      postalCode: this.selectedVendor?.postalCode,
      pan: this.selectedVendor?.panNo,
      gst: this.selectedVendor?.gstInNo,
      contactNumber: this.selectedVendor?.contactNumber,
      transporterMailId: this.selectedVendor?.email,
      transporterPaymentGroup: this.selectedVendor?.vendorPaymentGroup,
      transporterPaymentTermsName: this.selectedVendor?.vendorPaymentTermsName,
      transporterPaytermDays: this.selectedVendor?.vendorPaytermDays,
      transporterPaytermMethodCode: this.selectedVendor?.vendorPaytermMethodCode
    })
    
  }


  onAddTransactionRow() {
    // let obj = {
    //   transportationModeId: undefined,
    //   taxationTypeId: undefined,
    //   taxaCodesId: undefined,
    //   tdsCodesId: undefined
    // }
    // this.transporterData.transporterMappings.push(obj);

    const newObj = {
      transportationMode: undefined,
      taxationType: undefined,
      taxaCode: undefined,
      tdsCode: undefined,
      status: 'Active',
      disabled: false,
      location: undefined,
      autoBilti: undefined,
      consignerName: undefined,
      consignerContact: undefined,
      autoBiltiReq: 'Y',
      isShow: true,
      isLocationDisabled: false
    }

    this.transporterMappings.push(newObj)
    
  }

  onTransporterModeSelect(e: any, index: number) {
    const selectedMode = e?.value;
    if (selectedMode) {
      this.transporterMappings[index].transportationModeId = selectedMode;
      this.selectedModes.add(selectedMode);   
    }
  }

  onTransporterModeClear(index: number) {
    const clearedMode = this.transporterMappings[index].transportationModeId;
    if (clearedMode) {
      this.selectedModes.delete(clearedMode);
      this.transporterMappings[index].transportationModeId = undefined;
    }
  }
  

  getAvailableModes(index: number): any[] {
    const currentLocationId = this.transporterMappings[index].location;
    this.selectedModes = new Set<any>(); 
      for (let i = 0; i < index; i++) {
        const prevMapping = this.transporterMappings[i];
        if (prevMapping.location === currentLocationId) {
            this.selectedModes.add(prevMapping.transportationModeId);
            this.selectedModes.add(prevMapping.transportationMode);
        }
    }

    const currentMode = this.transporterMappings[index].transportationModeId;

    return this.transporterMode.filter(mode => 
        !this.selectedModes.has(mode.value) || currentMode === mode.value
    );
}


  getLocationData(data: any, index: number){
    const locationData = this.commonLocations.find((item: any) => {
    return item.id == data;
    })
    this.transporterMappings[index].autoBilti = locationData.attribute11;
    this.transporterMappings[index].storedAutoBilti = locationData.attribute11;
    // this.transporterMappings[index].autoBilti = this.transporterMappings[index].autoBiltiReq == 'Y' ?  locationData.attribute11 : '';
    this.transporterMappings[index].consignerName = locationData.attribute1;
    this.transporterMappings[index].consignerContact = locationData.attribute2;

    // this.updateSelectedLocations();
  }
  
  updateSelectedLocations() {
    this.selectedLocations = this.transporterMappings
      .filter((transaction: any) => transaction.location)
      .map((transaction: any) => transaction.location);
  }
  
  getFilteredLocations(index: number) {
    return this.locationsDropdownData.filter((location: any) => {
      return !this.selectedLocations.includes(location.id) || this.transporterMappings[index].location === location.id;
    });
  }
  
  onRcmNonRcmSelect(e: any, index: any) {
    this.transporterMappings[index].taxationTypeId = e?.typeId;
    
  }

  onRcmNonRcmClear(ind: number) {
    this.transporterMappings[ind].taxationTypeId = 0;
  }

  onTaxCodeSelect(e: any, index: any) { 
    this.transporterMappings[index].taxaCodesId = e?.typeId;
  }

  onTaxCodeClear(ind: number) {
    this.transporterMappings[ind].taxaCodesId = undefined;
  }

  onTdsCodeSelect(e: any, index: any) {
    this.transporterMappings[index].tdsCodesId = e?.typeId;
  }

  onTdsCodeClear(ind: number) {
    this.transporterMappings[ind].tdsCodesId = undefined;
  }

  onDeleteTransaction(transaction: any, index: number) {
    const deletedTransaction = {
      id: transaction.id,
      transactionTypeId: transaction.transactionTypeId,
      status: 'Inactive'
    };
  
  this.transporterMappings.splice(index, 1);
  }

  getVendorsList(offset: number = 0, count: number = this.count) {
    let data = {
      "vendorCode": "",
      "vendorName": "",
      "city": "",
      "state":  "",
      "taxationType":  "",
      "paidByDetail":  "",
      "status": ""
    }
    this.vendorService.getVendors(data, offset, count).subscribe((response: any) => {
      this.vendorsList = response.vendors;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    });
  }

  
  setLocation(){
    if(!this.queryData){
      this.lookupService.setLocationId(this.transporterForm, this.commonLocations, 'locationCode');
    }
    
}

getTransportersList() {
  let data = {
    locationIds:
      APIConstant.commonLocationsList.map((e: any) => e.id),
    transporterCode:"",
    transporterName: "",
    city: '',
    state: '',
    taxationType: '',
    status: "",
  };
  this.transporterService.getTransporters(data).subscribe(
    (response: any) => {
      this.transporterList = response.transporters;
      // this.getLocationId().then(() => {
      //   this.getTransporterData(this.queryData);
      // });
      this.loadSpinner = false;
    },
    (error) => {
      this.loadSpinner = false;
      this.toastr.error(
        error.error.details
          .map((detail: any) => detail.description)
          .join('<br>')
      );
    }
  );
}

  // getLocationId(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const transporter = this.transporterList.filter((transporter: any) => {
  //       return transporter.id == this.queryData
  //     });
  //     if (transporter.length > 0) {
  //       this.transporterLocationId = transporter[0].locations.id;
  //       resolve();
  //     } else {
  //       reject('No matching freight found');
  //     }
  //   });
  // }

  onAutoBiltiChange(event: any, index: number){
    const location = this.locationsDropdownData.find((item: any) => item.id == this.transporterMappings[index].location)
    console.log(location);
    
    this.autoBiltiRequiredFlag = event?.target?.value
    if(this.transporterMappings[index].autoBiltiReq == 'N'){
    this.transporterMappings[index].autoBilti = ''
    } else if (event.target.value === 'Y' && this.queryData == 0) {
      this.transporterMappings[index].autoBilti = this.transporterMappings[index].storedAutoBilti;
    } else if (event.target.value === 'Y' && this.queryData > 0){
      this.transporterMappings[index].autoBilti = location.attribute11;
    }
  }
}