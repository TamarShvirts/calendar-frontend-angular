import { Component, Inject, Input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DocumentService } from '../../../document.service';
import { DialogDeleteDocComponent } from './dialog-delete-doc/dialog-delete-doc.component';
import { DialogEditDocComponent } from './dialog-edit-doc/dialog-edit-doc.component';

@Component({
  selector: 'app-dialog-list-subject',
  templateUrl: './dialog-list-subject.component.html',
  styleUrl: './dialog-list-subject.component.scss',
})
export class DialogListSubjectComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { date: Date; iconType: string },
    public dialogRef: MatDialogRef<DialogListSubjectComponent>,
    private documentService: DocumentService,
    private dialog: MatDialog
  ) {}

  docs: any = [];
  myFiles:any=[];

  ngOnInit(): void {
    this.loadDocs();
  }

  openEditDialog(docEdit: any, docConfirmed: any, docId: any): void {
    console.log(docEdit, docConfirmed);
    const dialogRef = this.dialog.open(DialogEditDocComponent, {
      width: '500px',
      data: { docEdit: docEdit, docConfirmed: docConfirmed },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
      this.documentService.updateDocStatus(docId,result[0],result[1]).subscribe(
        (response) => {
        console.log('status update successfully:', response);
        //עדכון הטבלה בסטטוס
        const updatedDocs = this.docs.map((doc: any) =>
        doc.docId === docId
          ? { ...doc, docEdit: result[0], docConfirmed: result[1] }
          : doc
      );
      this.docs = updatedDocs;  
      },
      (error) => {
        console.log('Error update status', error);
      }
    );
  
    });
  }

  openDeleteDialog(doc: any): void {
    const dialogRef = this.dialog.open(DialogDeleteDocComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // המשתמש אישר את המחיקה
        this.deleteFile(doc);
      }
    });
  }

  loadDocs() {
    this.documentService.getDocByDate(this.data.date).subscribe(
      (response) => {
        console.log('File uploaded successfully:', response);
        //שליפת הקבצים מהשרת לפי ID
       this.myFiles=response;
        this.documentService.getMultipleFiles(this.myFiles).subscribe(
          (files:any) => {
            files.forEach((file:any) => {

              // שמירת ה-URL של כל קובץ באובייקט המתאים
              const mydoc = this.myFiles.find((d:any) => d.docId === file.docId);
              if (mydoc) {
                mydoc.fileUrl = URL.createObjectURL(file.blob);
              }
            });
          }
        );
        this.docs = response;
        console.log(this.docs, 'this.');
      },
      (error) => {
        console.log('Error uploading file:', error);
      }
    );
  }

  ngOnDestroy() {
    // לנקות את כל ה-URLs כשעוזבים את הקומפוננטה
    this.docs?.forEach((doc:any) => {
      if (doc.fileUrl) {
        URL.revokeObjectURL(doc.fileUrl);
      }
    });
  }


  
  downloadDocument(doc: any) {
    this.documentService.getFile(doc.docId).subscribe(
      blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.docName;
        link.click();
        URL.revokeObjectURL(url);
      }
    );
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  deleteFile(docId: number) {
    this.documentService.deleteFile(docId).subscribe(
      (response) => {
        console.log('File deleted successfully', response);
        this.docs = this.docs.filter((d: any) => d.docId !== docId);
      },
      (error) => {
        console.log('Error deleting file', error);
      }
    );
  }
}
