import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { DialogCalendarComponent } from './dialog-calendar/dialog-calendar.component';
import { CustomDateFormatter } from './calendarFormat.provider';
import { ApiService } from '../../api.service';
import { catchError, of, tap } from 'rxjs';
import { DialogListSubjectComponent } from './dialog-list-subject/dialog-list-subject.component';
import { DocumentService } from '../../document.service';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import { CustomDateFormatter } from './calendarFormat.provider';
// import { DateAdapter } from 'angular-calendar';
import { startOfWeek, endOfWeek } from 'date-fns';
import { CommentsComponent } from './comments/comments.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

// הגדרת טיפוס להחזרת השעה
type HourHeights = {
  [key: number]: number;
}

@Component({
  selector: 'app-calendar',
  template: ` <mwl-calendar-week-view [view]="view"></mwl-calendar-week-view> `,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  header: any = [
    'נושא יומי',
    '1',
    '2',
    'מצבכתיבה',
    'מצבקריון',
    'מצבאולפן',
    'עורכת',
    'מכינהתוכנית',
    '8',
    '9',
    '10',
    '11',
    '12'
  ];

    // // מערך שמגדיר את הגובה לכל שעה
    // hourHeights: { [hour: number]: number } = {
    //   0: 100, // שעה 00:00 בגובה 100px
    //   1: 200,  // שעה 01:00 בגובה 50px
    //   2: 100, // שעה 02:00 בגובה 100px
    //   3: 75   // שעה 03:00 בגובה 75px
    // };

    hourHeights : HourHeights = {
      0: 50,  // שעה 00:00
      1: 50,   // שעה 01:00
      2: 50,   // שעה 02:00
      3: 50,
      4: 50,
      5: 50,
      6: 50,
      7: 50,
      8: 50,
      9: 50,
      10: 50,
      11: 50,
      12: 50   // שעה 03:00
    }

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private docmentService: DocumentService
  ) {}

  view: CalendarView = CalendarView.Week;

  viewDate: Date = new Date();

  dayStartHour: number = 8;
  dayEndHour: number = 19;
  events: CalendarEvent[] = [];

  firstDate: Date | undefined;
  SubName: string | undefined;
  @Output() SubNameParent = new EventEmitter<string>();
  @Output() myCondition = new EventEmitter<boolean>();
  @Output() weekDatesChange = new EventEmitter<{ first: Date; last: Date }>();

  docs: any = [];

  num: any;

  // initialState: StatusCount = {
  //   unedited: 0,
  //   unconfirmed: 0,
  //   bothFalse: 0,
  // };

  ngOnInit() {
    this.changeWeek(this.viewDate);
  }

  beforeViewRender(event: CalendarWeekViewBeforeRenderEvent): void {
  //   event.hourColumns.forEach(hourColumn => {
  //     hourColumn.hours.forEach(hour => {
  //       const hourNumber = new Date(hour.segments[0].date).getHours();
        
  //       // החלת הגובה המותאם לכל שעה
  //       if (this.hourHeights[hourNumber]) {
  //         hour.segments.forEach(segment => {
  //           segment.cssClass = `custom-height-${hourNumber}`;
  //         });
  //       }
  //     });
  //   });
  }


  getHeight(date: Date): number {
    const hour = date.getHours();
    return this.hourHeights[hour] || 100; // מחזיר 100 כברירת מחדל
  }

  openDialog(event: any, dialogType: string): void {
    console.log('AAA', event);

    let dialogComponent;
    let dialogConfig: any = {
      width: '50%',
      hight: '50%',
      data: { date: event.date },
    };

    switch (dialogType) {
      case 'note_add':
        dialogComponent = DialogCalendarComponent;
        break;
      case 'description':
        dialogComponent = DialogListSubjectComponent;
        break;
      case 'comments':
        dialogComponent = CommentsComponent;
        break;
      default:
        console.error('Unknown dialog type');
        return;
    }

    const dialogRef = this.dialog.open(dialogComponent as any, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`The ${dialogType} dialog was closed`);
      switch (dialogType) {
        case 'note_add':
          // טיפול בתוצאה של דיאלוג הלוח שנה
          break;
        case 'description':
          // טיפול בתוצאה של הדיאלוג האחר
          break;
        case 'comments':
          // טיפול בתוצאה של הדיאלוג האחר
          break;
      }
    });
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }

  addDocuments(segment: any) {
    console.log(segment);
  }

  // beforeViewRender(event: CalendarWeekViewBeforeRenderEvent) {
    // console.log(event.hourColumns, "event.minuteColumn")
    // event.hourColumns.forEach((d) =>
    //   d.hours.forEach((dr) => {
    //     this.docmentService
    //       .getCuontStatusDocByDate(dr.segments[0].date)
    //       .subscribe(
    //         (response) => {
    //           console.log(dr.segments[0].date,response, '+++++');
    //           const status = response;
    //           (dr.segments[0] as any).dataCount = status;
    //           console.log((dr.segments[0] as any).dataCount,"GGGG");
              
    //         },
    //         (error) => {
    //           console.log('Error:', error);
    //         }
    //       );
    //   })
    // );
    // console.log(event.hourColumns,"456");
    
    // event.hourColumns.forEach(d=>d.hours.forEach(b=>console.log(b.segments[0],"369852")))
    

    // this.startDate = event.period.start;
    // this.endDate = event.period.end;
  // }

  changeWeek(s: any) {
    const start = startOfWeek(s, { weekStartsOn: 0 });
    const end = endOfWeek(s, { weekStartsOn: 6 });
    this.weekDatesChange.emit({ first: start, last: end });
  }

  jumpToDate(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.viewDate = event.value;
      const start = startOfWeek(this.viewDate, { weekStartsOn: 0 });
      const end = endOfWeek(this.viewDate, { weekStartsOn: 6 });
      this.weekDatesChange.emit({ first: start, last: end });
    }
  }
  dateFilter = (date: Date | null): boolean => {
    const day = (date || new Date()).getDay();
    return day !== 6;
  };

  // loadCountDoc(event: any) {
  //   this.docmentService.getDocByDate(event.date).subscribe(
  //     (response) => {
  //       console.log('File uploaded successfully:', response);

  //       this.initialState.unedited = 0;
  //       this.initialState.unconfirmed = 0;
  //       this.initialState.bothFalse = 0;

  //       this.initialState = Object.values(response).reduce<StatusCount>(
  //         (acc: any, doc) => {
  //           // אם שניהם false
  //           if (!doc.docEdit && !doc.docConfirmed) {
  //             return {
  //               ...acc,
  //               bothFalse: acc.bothFalse + 1,
  //             };
  //           }
  //           // אם רק docEdit הוא false
  //           else if (!doc.docEdit) {
  //             return {
  //               ...acc,
  //               unedited: acc.unedited + 1,
  //             };
  //           }
  //           // אם רק docConfirmed הוא false
  //           else if (!doc.docConfirmed) {
  //             return {
  //               ...acc,
  //               unconfirmed: acc.unconfirmed + 1,
  //             };
  //           } else {
  //             console.log('שניהם true');
  //             return acc;
  //           }
  //         },
  //         this.initialState
  //       );

  //       //שליפת הקבצים מהשרת לפי ID
  //     },
  //     (error) => {
  //       console.log('Error:', error);
  //     }
  //   );
  // }
}
