import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, mergeMap, of, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'https://localhost:7166/api';

  constructor(private http: HttpClient) {}

  updateDocByDate(
    DocName: string,
    DocDate: any,
    edited: boolean,
    Confirmed: boolean
  ) {
    const formattedDate = DocDate.toISOString();
    console.log(edited, Confirmed, 'updateDocByDate');
    let data = {
      DocName:DocName,
      DocDate: formattedDate,
      docEdit: edited,
      docConfirmed: Confirmed,
    };
    return this.http.post(`${this.apiUrl}/Doc/CreateByDate`, data);
  }

  getDocByDate(DocDate: Date){
    const formattedDate = new Date(DocDate.getTime() - DocDate.getTimezoneOffset() * 60000);
    console.log(formattedDate.toISOString());
    
    return this.http.get(`${this.apiUrl}/Doc/byDate`,{ params: { DocDate:formattedDate.toISOString() }});

  }


  // DeleteDocById(docId:any) {
  //   return  this.http.delete(`${this.apiUrl}/Doc/DeleteDocById`,{ params: { docId:docId }});
  
  // }


//מחיקת הקובץ
  deleteFile(docId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/doc/deleteFile/${docId}`);
  }

//עדכון סטטוס
updateDocStatus(docId:number,docEdit: boolean, docConfirmed:boolean){
  return this.http.post(`${this.apiUrl}/Doc/updateDocStatus`, {docId,docEdit,docConfirmed});
}

//שליפת הקבצים מהשרת לפי ID
getFile(docId: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/Doc/getFile/${docId}`, {responseType: 'blob'});
}

// פונקציה חדשה שמטפלת במערך של מסמכים
getMultipleFiles(files: any[]): Observable<{ docId: number, blob: Blob}[]> {
  return from(files).pipe(
    mergeMap(doc => 
      this.getFile(doc.docId).pipe(
        map(blob => ({ docId: doc.docId, blob })),
      )
    ),
    toArray()
  );
}

//מחזיר מערך של כמות קבצים לא ערוכים או/ו לא מבוקרים לפי תאריך
getCuontStatusDocByDate(date: Date){
  // const formattedDate = date.toISOString();
  // console.log(formattedDate,"date  format: ");
  const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  console.log(formattedDate.toISOString(),"date format");
  
  return this.http.get(`${this.apiUrl}/Doc/CuontStatus`,{ params: { DocDate:formattedDate.toISOString() }});


}
}
