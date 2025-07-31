import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  @ViewChild('inputField', { static: false })
  inputField!: ElementRef;

  ngOnInit() {
    // setTimeout(() => {
    //   this.inputField.nativeElement.focus();
    // },155);
  }

  name: string | undefined;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public  data: { subName: string }) {}


  // @Input() addSubjectWeek!: () => void;

  onNoClick = () => {
    // console.log(this.name,'tttttttttttttttttttttttttttttttttt');
    // this.addSubjectWeek();
    this.dialogRef.close(this.data.subName);


   
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // onNoClick(): void {
  //   addSubjectWeek
  //   this.dialogRef.close(this.name);
  // }
}
