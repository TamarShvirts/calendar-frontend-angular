import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://localhost:7166/api';

  constructor(private http: HttpClient) {}
  
  ///sub
  getData() {
    console.log('AAAAAAAAAA AAAA');

    return this.http.get(`${this.apiUrl}/sub`);
  }

  //שליפת נושא לפי תאריך
  getSubByDate(date: Date) {
    const formattedDate = date.toISOString();
    return this.http.get(`${this.apiUrl}/sub/byDate`, {
      params: { stratDateWeek: formattedDate },
    });
  }

  getDeleteSubByDate(date: Date) {
    const formattedDate = date.toISOString();
    return this.http.get(`${this.apiUrl}/sub/DeletebyDate`, {
      params: { stratDateWeek: formattedDate },
    });
  }
  // getStudentDetails$(id): Observable<any> {

  //   return this.get$<any>(new HttpRequestModel({  url: this._serverUrl, action: 'getStudentDetails',  params: {id}  })) }

  // private _get$(httpRequest: HttpRequestModel): Observable<any> {
  //   return this.http.get(httpRequest.fullUrl, { params: { ...httpRequest.fullParams }, responseType: 'text' });
  // }
  AAAA(subData: string) {
    return this.http.post(`${this.apiUrl}/sub`, subData);
  }

  //הכנסה/עדכון לטבלה
  UpdateSubByDate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sub/UpdatebyDate`, data);
  }
}
