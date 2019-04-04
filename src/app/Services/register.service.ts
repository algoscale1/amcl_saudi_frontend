import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(data) {

    return this.http.post(`${environment.API_url}/doctor/signup`, data).pipe(
      map(res => true),
      catchError((err) => {
        // console.log(err)
        return throwError(err.error);
      })
    );
  };

}
