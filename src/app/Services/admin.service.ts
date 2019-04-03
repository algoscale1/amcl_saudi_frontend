import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllDoctor() {

    return this.http.get(`${environment.API_url}/doctor/getList`).pipe(
      map(res => res['data'])
    )
  };

  onEditDoctor(data) {

    return this.http.patch(`${environment.API_url}/doctor/verify/`, data).pipe(
      map(res => res)
    )
  };

  onDeleteDoctor(id) {

    return this.http.delete(`${environment.API_url}/doctor/delete/${id}`).pipe(
      map(res => res)
    )
  };

}
