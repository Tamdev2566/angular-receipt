import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { SKIP_LOADER } from '../../core/interceptors/loaderInterceptor/loader-interceptor-interceptor';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserMgtService {
  userListRowData: any[] = [];

  constructor(private http: HttpClient) {}

  setRowData(row: any[]) {
    this.userListRowData = row;
  }

  getUserInfo(userId: string) {
    return this.http.get(`${environment.apiUrl}/?q=/UserManagements/userInfo/${userId}`);
  }
  getDefaultLocations(searchTerm: string = '*', page: number = 1, size: number = 10) {
    return this.http.get(
      `${environment.apiUrl}/?q=/UserManagements/locations/*/${searchTerm}/${page}/${size}`,
      { context: new HttpContext().set(SKIP_LOADER, true) },
    );
  }

  getGroups(search: string = '*', page: number = 1, size: number = 10) {
    const body = {
      search: search === '*' ? '' : search,
    };

    return this.http.post(
      `${environment.apiUrl}/?q=/GroupManagements//groupAll/${page}/${size}/ASC/groupId`,
      body,
    );
  }
}
