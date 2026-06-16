import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationModalComponent } from './modals/location-modal/location-modal';
import { OfficeModalComponent } from './modals/office-modal/office-modal';
import { GroupModal } from './modals/group-modal/group-modal';
import { UserMgtService } from '../user-mgt-service';

@Component({
  selector: 'app-user-mgt-details',
  standalone: true,
  templateUrl: './user-mgt-details.html',
  styleUrls: ['./user-mgt-details.scss'],
  imports: [CommonModule, FormsModule, LocationModalComponent, OfficeModalComponent, GroupModal],
})
export class UserMgtDetails implements OnInit {
  loading: boolean = false;
  isEditMode: boolean = false;

  formData: any = {
    userName: '',
    fullName: '',
    phone: '',
    email: '',
    defaultLocation: '',
    defaultOffice: '',
    password: 'password*1',
    confirmPassword: 'password*1',
    isValidToggle: true,
    createdBy: '',
    dateCreated: '',
    modifiedBy: '',
    dateModified: '',
  };

  locationRecords: any[] = [
    { locationName: 'CHATTOGRAM', officeName: 'SAMUDERA CHITTAGONG', isDefault: false },
    {
      locationName: 'PALEMBANG',
      officeName: 'PT. SAMUDERA INDONESIA TBK. - PALEMBANG',
      isDefault: false,
    },
    {
      locationName: 'SINGAPORE',
      officeName: 'PT. SAMUDERA SHIPPING SERVICES - SINGAPORE',
      isDefault: true,
    },
    { locationName: 'BANGKOK', officeName: 'SAMUDERA BANGKOK', isDefault: false },
    { locationName: 'DANANG', officeName: 'SAMUDERA DANANG', isDefault: false },
    { locationName: 'HOCHIMINH', officeName: 'SAMUDERA HOCHIMINH', isDefault: false },
    { locationName: 'HAIPHONG', officeName: 'SAMUDERA HAIPHONG', isDefault: false },
    { locationName: 'QUINHON', officeName: 'SAMUDERA QUINHON', isDefault: false },
  ];

  masterLocationRecords: any[] = [];

  groupRecords: any[] = [{ groupName: 'GRP11431- KIEN - SINGAPORE' }];
  activeLocationContext: string = 'SINGAPORE (Main Office)';
  activeOfficeContext: string = 'SINGAPORE (PT. SAMUDERA SHIPPING SERVICES - SINGAPORE)';
  hidePassword: boolean = false;
  hideConfirmPassword: boolean = false;

  constructor(
    private router: Router,
    public rowData: UserMgtService,
  ) {}

  availableGroups = [
    {
      groupName: 'GRP11431- KIEN - SINGAPORE',
      selected: false,
    },
    {
      groupName: 'GRP11432 - ADMIN',
      selected: false,
    },
    {
      groupName: 'GRP11433 - FINANCE',
      selected: false,
    },
    {
      groupName: 'GRP11434 - OPERATION',
      selected: false,
    },
    {
      groupName: 'GRP11435 - SALES',
      selected: false,
    },
    {
      groupName: 'GRP11436 - HR',
      selected: false,
    },
  ];

  ngOnInit(): void {
    this.masterLocationRecords = [...this.locationRecords];

    const stateData = history.state?.userRecord;
    if (stateData) {
      this.isEditMode = true;
      this.formData = { ...stateData, isValidToggle: stateData.valid === 'Y' };
    }

    console.log('rowData', this.rowData.userListRowData);
  }

  allowNumbersOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSaveUser(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;
    this.formData.valid = this.formData.isValidToggle ? 'Y' : 'N';

    setTimeout(() => {
      this.loading = false;
      console.log('Saved Object:', this.formData);
      this.router.navigate(['/home/user-mgt-list']);
    }, 1000);
  }

  setDefaultLocation(selectedLoc: any): void {
    this.locationRecords.forEach((l) => (l.isDefault = l === selectedLoc));
    this.activeLocationContext = `${selectedLoc.locationName} (Main Office)`;
    this.activeOfficeContext = `${selectedLoc.locationName} (${selectedLoc.officeName})`;
  }

  onSearchLocation(event: any): void {
    const query = event.target.value ? event.target.value.trim().toLowerCase() : '';

    if (!query) {
      this.locationRecords = [...this.masterLocationRecords];
      return;
    }

    this.locationRecords = this.masterLocationRecords.filter((loc) => {
      const matchLocation = loc.locationName
        ? loc.locationName.toLowerCase().includes(query)
        : false;
      const matchOffice = loc.officeName ? loc.officeName.toLowerCase().includes(query) : false;
      return matchLocation || matchOffice;
    });
  }

  onBackToLists(): void {
    this.router.navigate(['/home/user-mgt-list']);
  }

  removeLocation(loc: any): void {
    console.log('Remove location targeted event hit:', loc);
  }

  showLocationModal = false;
  showOfficeModal = false;
  showGroupModal = false;
  selectedLocations: any[] = [];

  addLocation() {
    this.showLocationModal = true;
  }

  closeLocationModal() {
    this.showLocationModal = false;
  }

  openOfficeModal(locations: any[]) {
    this.selectedLocations = locations;

    if (this.selectedLocations.length) {
      this.selectedLocations[0].isDefault = true;
    }

    this.showLocationModal = false;
    this.showOfficeModal = true;
  }

  closeOfficeModal() {
    this.showOfficeModal = false;
  }

  backToLocationModal() {
    this.showOfficeModal = false;
    this.showLocationModal = true;
  }

  saveSelectedLocations(data: any[]) {
    console.log('Selected Locations:', data);

    this.locationRecords = data.map((x) => ({
      locationName: x.code,
      officeName: x.office || '',
      isDefault: x.isDefault || false,
    }));

    this.showOfficeModal = false;
  }

  // Group Functions
  addGroup() {
    this.showGroupModal = true;
  }

  closeGroupModal() {
    this.showGroupModal = false;
  }

  onGroupsSelected(groups: any[]) {
    this.groupRecords.push(...groups);

    this.showGroupModal = false;
  }

  cloneGroups() {
    console.log('Clone Groups');
  }

  removeGroup(grp: any) {
    this.groupRecords = this.groupRecords.filter((g) => g !== grp);
  }
}
