import { Component, inject } from '@angular/core';
import { APIConstant } from '../../../core/constants/api.constant';
import { PlantService } from '../../../core/service';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { RecycleBinService } from '../../../core/service/recycle-bin.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';

@Component({
  selector: 'app-recycle-bin-plant-configuration',
  templateUrl: './recycle-bin-plant-configuration.component.html',
  styleUrl: './recycle-bin-plant-configuration.component.scss',
})
export class RecycleBinPlantConfigurationComponent {
  locations: any[] = APIConstant.commonLocationsList;
  location: any;
  createOrEdit: 'create' | 'edit' = 'create';
  locationsDropdownData: any = [];
  commonLocations: any[] = [];
  ACTION_BY_VALUE: any = localStorage.getItem('userId');
  selectedLocationCode: FormControl = new FormControl('');
  private formBuilder = inject(FormBuilder);
  recycleBinForm = this.formBuilder.group({
    actionBy: [this.ACTION_BY_VALUE],
    plantPercentages: this.formBuilder.array([]),
  });

  constructor(
    private plantService: PlantService,
    private recycleBinService: RecycleBinService,
    private toastr: ToastrService,
     private lookupService: LookupService,
  ) {}

  ngOnInit() {
    this.getCommonLocations();
    this.getLocations();
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
    
  }

  public get plantPercentages(): FormArray {
    return this.recycleBinForm.get('plantPercentages') as FormArray;
  }

  addPlantPercentages(plantCode?: string, percentage?: number) {
    this.plantPercentages.push(
      this.formBuilder.group({
        plantCode: [plantCode || ''],
        percentage: [percentage || 0],
      })
    );
  }

  getRecycleBinData() {
    this.recycleBinService
      .getrbData(this.location?.id)
      .subscribe((res: any) => {
        const plants = res?.plants;
        if (plants) {
          this.createOrEdit = 'edit';
          this.selectedLocationCode.setValue(this.location?.value);
          for (let plant of plants) {
            this.addPlantPercentages(plant?.plantCode, plant?.percentage);
          }
        } else {
          this.createOrEdit = 'create';
          const payload = {
            locationIds: [this.location?.id],
            status: '',
            plantCode: '',
            auCode: '',
            siteCode: '',
          };
          this.plantService.getPlants(payload).subscribe((resp: any) => {
            const newPlants = resp?.plants;
            this.selectedLocationCode.setValue(this.location?.value);
            for (let plant of newPlants) {
              this.addPlantPercentages(plant?.plantCode);
            }
          });
        }
        this.location = null;
      });
  }

  saveRecycleBinConfiguration() {
    const payload: any = this.recycleBinForm.value;
    let api;
    const selectedLocation = this.locations.find(
      (loc: any) => loc?.value === this.selectedLocationCode.value
    );
console.log(this.createOrEdit);

    if (this.createOrEdit === 'create') {
      //create API
      api = this.recycleBinService.createConfiguration(
        selectedLocation?.id,
        payload
      );
    } else {
      //update API
      api = this.recycleBinService.updateConfiguration(
        selectedLocation?.id,
        payload
      );
    }
    api.subscribe(
      (res: any) => {
        this.toastr.success('Recycle Bin Configuration Saved ');
        this.recycleBinForm.reset({
          actionBy: this.ACTION_BY_VALUE,
          plantPercentages: [],
        });

        this.plantPercentages.clear();
      },
      (error: any) => {
        this.toastr.error('Failed to change Recycle Bin Configuration');
      }
    );
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
}
