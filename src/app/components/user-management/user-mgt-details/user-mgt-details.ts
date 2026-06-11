import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-mgt-details',
  standalone: true,
  templateUrl: './user-mgt-details.html',
  styleUrls: ['./user-mgt-details.scss'],
  imports: [CommonModule, FormsModule],
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
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.masterLocationRecords = [...this.locationRecords];

    const stateData = history.state?.userRecord;
    if (stateData) {
      this.isEditMode = true;
      this.formData = { ...stateData, isValidToggle: stateData.valid === 'Y' };
    }
  }

  onSaveUser(form: NgForm): void {
    if (form.invalid) return;
    this.loading = true;
    this.formData.valid = this.formData.isValidToggle ? 'Y' : 'N';

    setTimeout(() => {
      this.loading = false;
      console.log('Saved Object Matrix:', this.formData);
      this.router.navigate(['/user-management-list']);
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

  backToLists(): void {
    this.router.navigate(['/home/user-mgt-list']);
  }

  addLocation(): void {
    console.log('Add Location trigger fired.');
  }

  removeLocation(loc: any): void {
    console.log('Remove location targeted event hit:', loc);
  }

  cloneGroups(): void {
    console.log('Clone groups rule engine mappings triggered.');
  }

  addGroup(): void {
    console.log('Add group configuration setup initiated.');
  }

  removeGroup(grp: any): void {
    console.log('Remove group targeted event hit:', grp);
  }
}
