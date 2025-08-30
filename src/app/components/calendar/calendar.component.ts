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
  dailySubjects: { [dateKey: string]: string } = {}; // אחסון נושאים לפי תאריך
  inspirationalpieces: { [dateKey: string]: string } = {}; // אחסון קטעי השראה לפי תאריך
  panels: { [dateKey: string]: string } = {}; // אחסון פאנלים/הרצאות לפי תאריך
  notes: { [dateKey: string]: string } = {}; // אחסון פאנלים/הרצאות לפי תאריך

  header: string[] = [
    // שורה 0 - שעה 00:00 (כותרת ראשית)
    'נושא יומי',            // שורה 1 - שעה 01:00 (נושא יומי)  
    '', '',     // שורה 2 - שעה 02:00 (כותרת בקרות)
    'מצב כתיבה',           // שורה 3 - שעה 03:00 (סטטוס כתיבה)
    'מצב קריון',           // שורה 4 - שעה 04:00 (סטטוס קריון)  
    'מצב אולפן',           // שורה 5 - שעה 05:00 (סטטוס אולפן)
    'עורכת',              // שורה 6 - שעה 06:00 (איזו עורכת)
    'מכינה תוכנית',        // שורה 7 - שעה 07:00 (מי מכין)
    '',                    // שורה 8 - שעה 08:00 (ריק)
    '',                    // שורה 9 - שעה 09:00 (ריק)
    'מצב הקלטה',           // שורה 10 - שעה 10:00 (סטטוס הקלטה)
    'מצב אולפן',           // שורה 11 - שעה 11:00 (סטטוס אולפן שוב) 
    'עורכת'               // שורה 12 - שעה 12:00 (עורכת שוב)
  ];

  // מבני נתונים לאפשרויות הDropdowns

  writingStatusByHour: Record<string, number> = {};
  narratorStatusByHour: Record<string, number> = {};
  studioStatusByHour: Record<string, number> = {};
  editorsByHour: Record<string, number> = {};
  ProgramPreparerByHour: Record<string, number> = {};
  RecordingStatusByHour: Record<string, number> = {};


  // אפשרויות הסטטוסים לדרופדאון
  writingStatusOptions = [
    { value: -1, label: 'מצב כתיבה', color: '#f0f0f0' },
    { value: 0, label: 'כתוב', color: '#4caf50' },
    { value: 1, label: 'לא כתוב', color: '#f44336' },
    { value: 2, label: 'בכתיבה', color: '#ff9800' }
  ];

  narratorStatusOptions = [
    { value: -1, label: 'מצב קריון', color: '#f0f0f0' },
    { value: 0, label: 'מקוריין', color: '#4caf50' },
    { value: 1, label: 'לא מקוריין', color: '#f44336' },
    { value: 2, label: 'בהקלטות', color: '#9c27b0' }
  ];

  studioStatusOptions = [
    { value: -1, label: 'מצב אולפן', color: '#f0f0f0' },
    { value: 0, label: 'ערוך', color: '#4caf50' },
    { value: 1, label: 'לא ערוך', color: '#f44336' },
    { value: 2, label: 'בעבודה', color: '#ff9800' }
  ];

  editorsOptions = [
    { value: -1, label: 'עורכת', color: '#f0f0f0' },
    { value: 0, label: 'תמר', color: '#4caf50' },
    { value: 1, label: 'אילה', color: '#4caf50' },
    { value: 2, label: 'חני', color: '#4caf50' }
  ];

  programPreparersOptions = [
    { value: -1, label: 'מכינה תוכנית', color: '#f0f0f0' },
    { value: 0, label: 'כבי', color: '#4caf50' },
    { value: 1, label: 'רחלי', color: '#4caf50' },
    { value: 2, label: 'יהודית', color: '#4caf50' },
    { value: 3, label: 'שולמית שחור', color: '#4caf50' }
  ];

  recordingStatusOptions = [
    { value: -1, label: 'מצב הקלטה', color: '#f0f0f0' },
    { value: 0, label: 'הוקלט', color: '#4caf50' },
    { value: 1, label: 'מאושר ולא הוקלט', color: '#2196f3' },
    { value: 2, label: 'לא סופי', color: '#f44336' }
  ];


  // מערך שמגדיר את הגובה לכל שעה
  hourHeights: HourHeights = {
    0: 20,  // שעה 00:00 - נושא יומי (נמוך יותר)
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
  ) { }

  // פונקציה עזר לקבלת כותרת בטוחה
  getHeaderForHour(hour: number): string {
    return this.header[hour] || '';
  }

  // פונקציה עזר לקבלת מפתח תאריך
  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0]; // יחזיר תאריך בפורמט YYYY-MM-DD
  }

  // פונקציות לניהול נושאים יומיים
  getDailySubjectForDate(date: Date): string {
    const dateKey = this.getDateKey(date);
    return this.dailySubjects[dateKey] || '';
  }


  // פונקציות לניהול שינויים בדרופדאונים
  onDailySubjectChange(date: Date, value: string) {
    const dateKey = this.getDateKey(date);
    this.dailySubjects[dateKey] = value;
    console.log(`שינוי נושא יומי לתאריך ${dateKey}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת הנושא היומי

  }
  // פונקציות לניהול קטעי השראה
  getInspirationalpiecesForDate(date: Date): string {
    const dateKey = this.getDateKey(date);
    return this.inspirationalpieces[dateKey] || '';
  }

  // פונקציה לניהול שינויים בקטעי השראה
  onInspirationalpiecesChange(date: Date, value: string) {
    const dateKey = this.getDateKey(date);
    this.inspirationalpieces[dateKey] = value;
    console.log(`שינוי הערות קטעי השראה לתאריך ${dateKey}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת הנושא היומי
  }

  // פונקציות לניהול פאנלים/הרצאות
  getpanelstsForDate(date: Date): string {
    const dateKey = this.getDateKey(date);
    return this.panels[dateKey] || '';
  }

  // פונקציה לניהול שינויים בפאנלים/הרצאות
  onpanelsChange(date: Date, value: string) {
    const dateKey = this.getDateKey(date);
    this.panels[dateKey] = value;
  }

  // פונקציות לניהול הערות
  getNotesForDate(date: Date): string {
    const dateKey = this.getDateKey(date);
    return this.notes[dateKey] || '';
  }
  // פונקציה לניהול שינויים בהערות
  onNotesChange(date: Date, value: string) {
    const dateKey = this.getDateKey(date);
    this.notes[dateKey] = value;
  }

  // פונקציה לקבלת צבע נבחר לפי סטטוס כתיבה
  getSelectedColor(date: Date, hour: number): string {
    // יצירת מפה של כל הסטטוסים לפי שעה בזמן ריצה
    const statusMaps: { [key: number]: { data: Record<string, number>, options: any[] } } = {
      3: { data: this.writingStatusByHour, options: this.writingStatusOptions },
      4: { data: this.narratorStatusByHour, options: this.narratorStatusOptions },
      5: { data: this.studioStatusByHour, options: this.studioStatusOptions },
      6: { data: this.editorsByHour, options: this.editorsOptions },
      7: { data: this.ProgramPreparerByHour, options: this.programPreparersOptions },
      10: { data: this.RecordingStatusByHour, options: this.recordingStatusOptions },
      // 11: { data: this.studioStatusByHour, options: this.studioStatusOptions },
      // 12: { data: this.editorsByHour, options: this.editorsOptions },
    };

    const statusMap = statusMaps[hour];
    if (!statusMap) return 'transparent';

    const value = statusMap.data[date.toDateString()] ?? -1;
    const selected = statusMap.options.find((opt: any) => opt.value === value);
    return selected ? selected.color : 'transparent';
  }


  // onWritingStatusChange(date: Date, value: number) {
  //   this.writingStatusByHour[date.toDateString()] = value;
  //   console.log(`שינוי סטטוס כתיבה ליום ${date.toDateString()}:`, value);
  // }

  onWritingStatusChange(hour: number, value: string) {
    console.log(`שינוי סטטוס כתיבה לשעה ${hour}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת השינוי
  }

  onNarratorStatusChange(hour: number, value: string) {
    console.log(`שינוי סטטוס קריין לשעה ${hour}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת השינוי
  }

  onStudioStatusChange(hour: number, value: string) {
    console.log(`שינוי סטטוס אולפן לשעה ${hour}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת השינוי
  }

  onEditorChange(hour: number, value: string) {
    console.log(`שינוי עורך לשעה ${hour}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת השינוי
  }

  onProgramPreparerChange(hour: number, value: string) {
    console.log(`שינוי מכין תוכנית לשעה ${hour}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת השינוי
  }

  onRecordingStatusChange(hour: number, value: string) {
    console.log(`שינוי סטטוס הקלטה לשעה ${hour}:`, value);
    // כאן תוכלי להוסיף לוגיקה לשמירת השינוי
  }


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

  headers: { hour: number; title: string }[] = [
    { hour: 1, title: 'קטעי השראה' },
    { hour: 8, title: 'הרצאות / פאנלים / תוכניות' },
    { hour: 13, title: 'הערות' },

  ];

  beforeViewRender(event: CalendarWeekViewBeforeRenderEvent): void {
      // event.hourColumns.forEach(hourColumn => {
      //   hourColumn.hours.forEach(hour => {
      //     const hourNumber = new Date(hour.segments[0].date).getHours();

      //     // החלת הגובה המותאם לכל שעה
      //     if (this.hourHeights[hourNumber]) {
      //       hour.segments.forEach(segment => {
      //         segment.cssClass = `custom-height-${hourNumber}`;
      //       });
      //     }
      //   });
      // });


    event.hourColumns.forEach((col) => {
      col.hours.forEach((hour) => {
        const header = this.headers.find(
          h => h.hour === hour.segments[0].date.getHours()
        );
        if (header) {
          hour.segments.forEach(segment => {
            (segment as any).isHeaderRow = true;
            (segment as any).headerTitle = header.title;
          });
        }
      });
    });
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
