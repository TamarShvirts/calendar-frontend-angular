import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from '../../api.service';
import { catchError, of, tap } from 'rxjs';

// export interface DialogData {
//   name: string;
// }

@Component({
  selector: 'app-subject-week',
  template: '<app-dialog [addSubjectWeek]="addSubjectWeek"></app-dialog>',
  templateUrl: './subject-week.component.html',
  styleUrl: './subject-week.component.scss',
})
export class SubjectWeekComponent {
  [x: string]: any;
  name: string | undefined;
  nameSubject: string | undefined;

  logoPath: string = 'assets/images/logo.png';

  constructor(public dialog: MatDialog, private apiService: ApiService) {}

  subject = ':הנושא השבועי';
  //get Date
  @Input() firstDayOfWeek!: Date;
  @Input() lastDayOfWeek!: Date;
  @Input() SubName: string = '';
  @Input() myCondition: boolean = false;

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.lastDayOfWeek, this.firstDayOfWeek, "'''''''");
    if (this.firstDayOfWeek) {
      this.firstDayOfWeek = new Date(
        this.firstDayOfWeek.getTime() -
          this.firstDayOfWeek.getTimezoneOffset() * 60000
      );
      this.getSub();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '30%',
      data: { subName: this.SubName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.name = result;
      //מקרה שבו לא הוכנס ערך
      if ((!this.SubName && !this.name) || this.SubName == this.name) {
        return;
      }
      this.UpdateSubByDate();
    });
  }

  //הוספת נושא חדש/קיים לטבלה
  UpdateSubByDate() {
    const data = {
      subName: this.name,
      stratDateWeek: this.firstDayOfWeek,
      lastDateWeek: this.lastDayOfWeek,
    };
    this.apiService.UpdateSubByDate(data).subscribe(
      (response) => {
        console.log('הנתונים עודכנו בהצלחה:', response);
        this.SubName = response.subName;
        this.myCondition = true;
        // this.getSub();
      },
      (error) => {
        console.log('שגיאה בעדכון הנתונים:', error);
      }
    );
  }
  getSub() {
    console.log(this.firstDayOfWeek, 'First');

    if (this.firstDayOfWeek !== null) {
      this.apiService
        .getSubByDate(this.firstDayOfWeek)
        .subscribe((ans: any) => {
          console.log(ans, 'vvvv');

          if (ans) {
            console.log(ans, 'qqqqqqqqqqqqqqqqq');
            this.SubName = ans.subName;
            this.myCondition = true;
          } else {
            this.myCondition = false;
            this.SubName = '';
            console.log(this.myCondition, '1111');
          }
        });
    } else {
      console.error('firstDayOfWeek is null');
    }
  }

  // getSub() {
  //   if (this.firstDayOfWeek) {
  //     this.apiService.getSubByDate(this.firstDayOfWeek).subscribe({
  //       next: (ans: any) => {
  //         this.myCondition = Boolean(ans);
  //         if (ans) {
  //           this.SubName = ans.subName;
  //         }
  //       },
  //       error: (err) => console.error('Error fetching sub:', err)
  //     });
  //   }
  // }
}
