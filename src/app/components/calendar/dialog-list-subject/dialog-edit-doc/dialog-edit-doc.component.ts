import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-doc',
  templateUrl: './dialog-edit-doc.component.html',
  styleUrl: './dialog-edit-doc.component.scss'
})
export class DialogEditDocComponent {

  Confirmed = false;
  edited = false;

  constructor(public dialogRef: MatDialogRef<DialogEditDocComponent>,  @Inject(MAT_DIALOG_DATA) public data: {docEdit:any, docConfirmed:any}) {}



  onNoClick(): void {
    this.dialogRef.close([this.data.docEdit,this.data.docConfirmed]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
