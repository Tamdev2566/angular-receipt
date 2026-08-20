import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

/** Resolves the selected user location to the master-office location code. */
@Injectable({ providedIn: 'root' })
export class LocationContextService {
  private http = inject(HttpClient);
  private cachedLocationId = '';
  private cachedLocationCode$?: Observable<string>;

  getLocationCode(): Observable<string> {
    const selectedLocation = this.getDefaultLocation();
    const locationId = String(
      selectedLocation?.locationId ?? selectedLocation?.usersLocationId ?? '',
    ).trim();

    if (!locationId) {
      return of('');
    }

    if (this.cachedLocationId === locationId && this.cachedLocationCode$) {
      return this.cachedLocationCode$;
    }

    this.cachedLocationId = locationId;
    const masterLocationUrl = `http://10.10.100.111:22000/UserManagements/locations/*/${encodeURIComponent(locationId)}/1/10`;

    this.cachedLocationCode$ = this.http.get<any>(masterLocationUrl).pipe(
      map((response) => {
        const location = response?.content?.[0] ?? response?.data?.[0] ?? response?.[0];
        return String(
          location?.location_code ??
            location?.locationCode ??
            selectedLocation?.location_code ??
            selectedLocation?.locationCode ??
            selectedLocation?.officeCode ??
            '',
        ).trim();
      }),

      catchError(() =>
        of(
          String(
            selectedLocation?.location_code ??
              selectedLocation?.locationCode ??
              selectedLocation?.officeCode ??
              '',
          ).trim(),
        ),
      ),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.cachedLocationCode$;
  }

  private getDefaultLocation(): any {
    try {
      return JSON.parse(localStorage.getItem('defaultLocation') || 'null');
    } catch {
      return null;
    }
  }
}
