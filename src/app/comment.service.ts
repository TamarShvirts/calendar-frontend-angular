import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'https://localhost:7166/api';

  constructor(private http: HttpClient) {}

  //הוספת הערה לטבלת comments
  Updatecomment(comment: any): Observable<any> {
    console.log(comment, 'update');

    return this.http.post(`${this.apiUrl}/comment/UpdateComment`, comment);
  }


  //שליפת הערות לפי תאריך
  getCommentsByDate(CommentsDate: Date){
    const formattedDate = new Date(CommentsDate.getTime() - CommentsDate.getTimezoneOffset() * 60000);
    console.log(formattedDate.toISOString());
    
    return this.http.get(`${this.apiUrl}/comment/getCommentsByDate`,{ params: { CommentsDate:formattedDate.toISOString() }});

  }

  //מחיקת הערה
  deleteComment(commentId:number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/comment/deleteComment/${commentId}`);
  }
  
}
