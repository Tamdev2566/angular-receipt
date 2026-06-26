import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationModalComponent } from './modals/location-modal/location-modal';
import { GroupModal } from './modals/group-modal/group-modal';
import { UserMgtService } from '../user-mgt-service';
import { Combobox } from '../../../shared/combobox/combobox';
import { AlertService } from '../../../services/alertService/alert';
import { environment } from '../../../../environment/environment';
import { UserService } from '../../../services/userService/user.service';

@Component({
  selector: 'app-user-mgt-details',
  standalone: true,
  templateUrl: './user-mgt-details.html',
  styleUrls: ['./user-mgt-details.scss'],
  imports: [CommonModule, FormsModule, LocationModalComponent, GroupModal, Combobox],
})
export class UserMgtDetails implements OnInit {
  loading: boolean = false;
  isEditMode: boolean = false;

  formData: any = {
    userName: '',
    fullName: '',
    phone: '',
    email: '',
    defaultLocation: null,
    defaultOffice: null,
    password: 'P@$$w0rd!123',
    confirmPassword: 'P@$$w0rd!123',
    isValidToggle: true,
    createdBy: '',
    createDate: '',
    modifiedBy: '',
    modifiedDate: '',
  };

  hidePassword: boolean = false;
  hideConfirmPassword: boolean = false;
  locations: any[] = [];
  allLocations: any[] = [];
  selectedLocation: any = null;
  selectedLocationIndex = -1;
  groupsTemplates: any[] = [];
  isDirty = false;
  checkedLocations: any[] = [];
  selectedOffice: any = null;
  privilegeTemplates: any[] = [];

  // Clone modal
  showCloneGroupModal = false;
  cloneTargetLocation: any = null;

  submitted = false;
  userDetails: any;
  user: any;
  originalData: any = {};

  constructor(
    private router: Router,
    public userService: UserMgtService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService,
    private loginUser: UserService,
  ) {}

  ngOnInit(): void {
    this.user = this.loginUser.getUser();
    const stateData = history.state?.userRecord;

    if (stateData) {
      this.isEditMode = true;

      this.userService.getUserInfo(stateData.userId).subscribe({
        next: (res: any) => {
          this.userDetails = res || [];
          this.originalData = {
            fullName: res.fullName,
            phone: res.phone,
            isValid: res.isValid,
            locationId: res.locationId,
            officeId: res.officeId,
          };
          this.formData = {
            ...res,
            password: '',
            isValidToggle: res?.isValid === 'Y',
            defaultLocation: { location_id: res?.locationId, location_name: res?.locationName },
            defaultOffice: { officeId: res?.officeId, officeName: res?.officeName },
          };

          // Location grid
          this.locations = (res.assignedLocations || []).map((loc: any) => ({
            locationId: loc.locationId,
            locationName: loc.locationName,
            officeId: loc.officeId,
            officeName: loc.officeName,
            isDefault: loc.isDefault === 'Y',
            assignedGroups: loc.assignedGroups || [],
          }));

          // Default location find
          const defaultLocation = this.locations.find((x) => x.isDefault);

          // Auto select default location
          if (defaultLocation) {
            this.selectedLocation = defaultLocation;
            this.selectedLocationIndex = this.locations.findIndex(
              (x) =>
                x.locationId === defaultLocation.locationId &&
                x.officeId === defaultLocation.officeId,
            );
            this.groupsTemplates = [...(defaultLocation.assignedGroups || [])];
            this.privilegeTemplates = [
              ...(defaultLocation.assignedGroups[0].privilegePreview || []),
            ];
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  ngDoCheck() {
    console.log(this.locations);
    console.log(this.userDetails);
  }

  onOfficeChange(value: any, item: any): void {
    this.selectedOffice = item;
  }

  selectLocation(loc: any, index: number): void {
    this.selectedLocation = loc;
    this.selectedLocationIndex = index;
    this.groupsTemplates = [...(loc.assignedGroups || [])];
  }

  onLocationSelected(loc: any, index: number): void {
    this.selectedLocation = loc;
    this.selectedLocationIndex = index;
    this.groupsTemplates = [...(loc.assignedGroups || [])];
    this.loadPrivilegesFromGroups(this.groupsTemplates);
  }

  allowNumbersOnly(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSaveUser(form: NgForm): void {
    this.submitted = true;

    if (form.invalid || !this.formData.defaultLocation || !this.formData.defaultOffice) {
      form.form.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && this.formData.password !== this.formData.confirmPassword) {
      this.alert.showAlert('Error', 'Password and Confirm Password mismatch', 'error');
      return;
    }

    const payload = {
      userId: this.formData.userId || null,
      userName: this.formData.userName,
      fullName: this.formData.fullName,
      phone: this.formData.phone,
      email: this.formData.email,
      password: this.isEditMode ? null : this.formData.password,
      isValid: this.formData.isValidToggle ? 'Y' : 'N',
      createdBy: this.user.name,
      locationId: this.formData.defaultLocation,
      officeId: this.formData.defaultOffice,

      assignedLocations: this.locations.map((loc) => ({
        locationId: loc.locationId,
        locationName: loc.locationName,
        officeId: loc.officeId,
        officeName: loc.officeName,
        isDefault: loc.isDefault ? 'Y' : 'N',
        assignedGroups: loc.assignedGroups || [],
        privilegePreview: loc.assignedGroups.privilegePreview || [],
      })),
    };

    if (this.isEditMode) {
      const profileChanges: any = {};

      if (this.formData.fullName !== this.originalData.fullName) {
        profileChanges.fullName = this.formData.fullName;
      }

      if (this.formData.phone !== this.originalData.phone) {
        profileChanges.phone = this.formData.phone;
      }

      const currentIsValid = this.formData.isValidToggle ? 'Y' : 'N';
      if (currentIsValid !== this.originalData.isValid) {
        profileChanges.isValid = currentIsValid;
      }

      const currentLocationId =
        this.formData.defaultLocation?.location_id ??
        this.formData.defaultLocation?.locationId ??
        this.formData.defaultLocation;

      if (currentLocationId !== this.originalData.locationId) {
        profileChanges.locationId = currentLocationId;
      }

      const currentOfficeId = this.formData.defaultOffice?.officeId ?? this.formData.defaultOffice;

      if (currentOfficeId !== this.originalData.officeId) {
        profileChanges.officeId = currentOfficeId;
      }

      const editPayload = {
        userId: this.userDetails.userId,
        username: this.userDetails.userName,
        profileChanges,
      };
      console.log('UPDATE USER', editPayload);

      this.userService.updateUser(editPayload).subscribe({
        next: (res: any) => {
          this.alert.showAlert('Success', res.message, 'success');
          this.router.navigate(['/home/user-mgt-list']);
        },
        error: (err) => {
          console.log(err);
          this.alert.showAlert('Error', err.message, 'error');
        },
      });
    } else {
      this.userService.saveUser(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.alert.showAlert('Success', res.message, 'success');
          this.router.navigate(['/home/user-mgt-list']);
        },
        error: (err) => {
          console.log(err);
          this.alert.showAlert('Error', err.message, 'error');
        },
      });
    }
  }

  setDefaultLocation(loc: any, event: Event): void {
    event.stopPropagation();

    this.locations.forEach((x) => (x.isDefault = false));
    loc.isDefault = true;

    this.selectedLocation = loc;
  }

  onSearchLocation(event: any): void {
    const query = event.target.value ? event.target.value.trim().toLowerCase() : '';

    if (!query) {
      this.locations = [...this.allLocations];
      return;
    }

    this.locations = this.allLocations.filter((loc) => {
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
    this.locations = this.locations.filter((item) => item.locationId !== loc.locationId);

    this.selectedLocations = this.selectedLocations.filter(
      (item: any) => item.location_id !== loc.locationId,
    );

    if (this.selectedLocation?.locationId === loc.locationId) {
      this.selectedLocation = null;
      this.selectedLocationIndex = -1;

      this.groupsTemplates = [];
      this.privilegeTemplates = [];
    }
  }

  showLocationModal = false;
  showOfficeModal = false;
  showGroupModal = false;
  selectedLocations: any[] = [];

  addLocation() {
    if (!this.formData.defaultLocation) {
      // alert('Please select Default Location');
      this.alert.showAlert('Error!', 'Please select Default Location', 'error');
      return;
    }

    if (!this.formData.defaultOffice) {
      // alert('Please select Default Office');
      this.alert.showAlert('Error!', 'Please select Default Office', 'error');
      return;
    }

    this.showLocationModal = true;
  }

  closeLocationModal() {
    this.showLocationModal = false;
  }

  openOfficeModal(locations: any[]) {
    locations.forEach((loc) => {
      const exists = this.locations.some((x) => x.locationId === loc.location_id);

      if (!exists) {
        const newLocation = {
          locationId: loc.location_id,
          locationName: loc.location_name,
          officeId: this.selectedOffice?.officeId,
          officeName: this.selectedOffice?.officeName,
          isDefault: this.locations.length === 0,
          assignedGroups: [],
        };

        this.locations.push(newLocation);

        if (this.locations.length === 1) {
          this.selectedLocation = newLocation;
          this.selectedLocationIndex = 0;
          this.groupsTemplates = [];
          this.privilegeTemplates = [];
        }
      }
    });
    console.log('selectedOffice', this.selectedOffice);
    this.showLocationModal = false;

    console.log('Location Table', this.locations);
  }

  closeOfficeModal() {
    this.showOfficeModal = false;
  }

  backToLocationModal() {
    this.showOfficeModal = false;
    this.showLocationModal = true;
  }

  saveSelectedLocations(data: any[]) {
    this.locations = data.map((x) => ({
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

  onGroupsSelected(groups: any[]): void {
    this.groupsTemplates = groups.map((x) => ({ ...x }));

    if (this.selectedLocation) {
      this.selectedLocation.assignedGroups = [...this.groupsTemplates];
    }

    this.loadPrivilegesFromGroups(this.groupsTemplates);

    this.showGroupModal = false;
  }

  removeGroup(grp: any): void {
    this.groupsTemplates = this.groupsTemplates.filter((g) => g.groupId !== grp.groupId);

    if (this.selectedLocation) {
      this.selectedLocation.assignedGroups = [...this.groupsTemplates];
    }

    this.loadPrivilegesFromGroups(this.groupsTemplates);

    if (this.groupsTemplates.length === 0) {
      this.privilegeTemplates = [];
    }
  }

  // Privilege Functions

  loadPrivilegesFromGroups(groups: any[]): void {
    const privileges = groups.flatMap((grp) => grp.privilegePreview || []);

    this.privilegeTemplates = privileges.filter(
      (item, index, self) => index === self.findIndex((x) => x.menuId === item.menuId),
    );
  }

  // Clone Group Functions
  cloneGroups(): void {
    if (!this.selectedLocation) {
      this.alert.showAlert('Error!', 'Please select a location first', 'error');
      return;
    }

    if (!this.groupsTemplates.length) {
      this.alert.showAlert('Error!', 'No groups available to clone', 'error');
      return;
    }

    this.cloneTargetLocation = null;
    this.showCloneGroupModal = true;
  }

  availableCloneLocations(): any[] {
    return this.locations.filter((x) => x.locationId !== this.selectedLocation.locationId);
  }

  confirmCloneGroups(): void {
    if (!this.cloneTargetLocation) {
      this.alert.showAlert('Error!', 'Please select a target location', 'error');
      return;
    }

    this.cloneTargetLocation.assignedGroups = this.groupsTemplates.map((grp) => ({ ...grp }));
    this.alert.showAlert('Groups cloned successfully', '', 'success');
    this.showCloneGroupModal = false;
  }

  onCloneLocationChange(loc: any, event: any): void {
    if (event.target.checked) {
      this.cloneTargetLocation = loc;
    } else {
      this.cloneTargetLocation = null;
    }
  }
}
