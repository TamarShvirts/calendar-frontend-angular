import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DocumentService } from '../../../document.service';

@Component({
  selector: 'app-dialog-calendar',
  templateUrl: './dialog-calendar.component.html',
  styleUrl: './dialog-calendar.component.scss',
})
export class DialogCalendarComponent {
  selectedFile: File | null = null;
  previewUrl: any;
  Confirmed = false;
  edited = false;
  aaa = 'jjj';
  dateofDay!:Date;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { date: Date; iconType: string },
    public dialogRef: MatDialogRef<DialogCalendarComponent>,
    private http: HttpClient,
    private doumentService: DocumentService
  ) {}

  onFileChange(event: any) {
    console.log(event, 'event');

    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  openFile() {
    // פותחים את הקובץ באמצעות לינק התצוגה המקדימה
    if (this.previewUrl) {
      window.open(this.previewUrl);
    }
  }

  //שליחת הקובץ
  onUpload() {
    console.log(this.edited.toString(),"upload",this.Confirmed.toString());
    
    if (this.selectedFile) {
      console.log(this.data.date.toISOString(),"kkkk");
      this.dateofDay = new Date(this.data.date.getTime() - this.data.date.getTimezoneOffset() * 60000);
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('DocName', this.selectedFile.name);
      formData.append('DocDate', this.dateofDay.toISOString());
      formData.append('DocEdit', this.edited.toString());
      formData.append('DocConfirmed', this.Confirmed.toString());

      this.http.post<any>('https://localhost:7166/api/upload/upFile', formData)
      .subscribe(
        (response) => {
          console.log('Document uploaded successfully:', response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.log('Error uploading document:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    if (this.selectedFile) {
      this.onUpload();
    }

    
  }


}
