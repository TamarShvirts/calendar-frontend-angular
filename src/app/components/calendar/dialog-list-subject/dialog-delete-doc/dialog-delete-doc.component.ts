import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-doc',
  templateUrl: './dialog-delete-doc.component.html',
  styleUrl: './dialog-delete-doc.component.scss'
})
export class DialogDeleteDocComponent {
  constructor(public dialogRef: MatDialogRef<DialogDeleteDocComponent>) {}


  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
