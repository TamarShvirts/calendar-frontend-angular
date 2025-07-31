import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { formatJewishDateInHebrew, toJewishDate } from 'jewish-date';
import localeHe from '@angular/common/locales/he';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  // public override monthViewColumnHeader({
  //   date,
  //   locale,
  // }: DateFormatterParams): string {
  //   if (locale) {
  //     return formatDate(date, 'EEEEE', locale);
  //   } else {
  //     return '';
  //   }
  // }

  // public override monthViewTitle({
  //   date,
  //   locale,
  // }: DateFormatterParams): string {
  //   if (locale) {
  //     console.log(localeHe);
      
  //     return formatDate(date, 'MMM y', locale);
  //   } else {
  //     return '';
  //   }
  // }

  // public override weekViewColumnHeader({
  //   date,
  //   locale,
  // }: DateFormatterParams): string {
  //   if (locale) {
  //     console.log(locale,date);
      
  //     return formatDate(date, 'EEEEE', locale);
  //   } else {
  //     return '';
  //   }
  // }

  public override dayViewHour({ date, locale }: DateFormatterParams): string {
    return 'rrrrr';
  }

  // override weekViewHour(e: DateFormatterParams): any {
  //   console.log(e);
    
  //     return ';;;';
  // }

//   overrideWeekViewHour(e: DateFormatterParams): string {
//     console.log(e,"AAAAAAAAAAA");
//     const hour = e.date.getHours();
//     // Customize the titles based on the hour
//     switch(hour) {
//         case 6:
//             return '12 AM';
//         case 7:
//             return '1 AM';
//         // Add more cases for other hours as needed
//         default:
//             return `${hour} AM`; // Default to the hour itself if not specified
//     }
// }

//   override weekViewHour(e: DateFormatterParams): string {
//   const hours = ['שמירה', 'תודה', 'שלום', 'קראת', 'סעודה', 'ערב', 'לילה', 'שחר'];
//   return hours[e.date.getHours() % hours.length];
// }

override weekViewHour(e: DateFormatterParams): string {
  const hours = ['קטעי השראה','תפריט','פתיח להרצאה','הרצאות','כותרת לבעבור אבותינו'];
  return hours[e.date.getHours() ];
}



  // override weekViewColumnSubHeader({
  //   date,
  //   locale,
  // }: DateFormatterParams): string {
  //   const jewishDate = toJewishDate(date);
  //   console.log(jewishDate);

  //   const jewishDateStr = formatJewishDateInHebrew(jewishDate);
  //   const dayName = new Intl.DateTimeFormat('he-IL', { weekday: 'long' }).format(date); // Get day name in Hebrew
  //   return `${dayName} ${jewishDateStr}  `; 
  
  
  // }




    override weekViewColumnHeader({
    date,
    locale,
  }: DateFormatterParams): string {
    const jewishDate = toJewishDate(date);
  
    const jewishDateStr = formatJewishDateInHebrew(jewishDate);

    const dayName = new Intl.DateTimeFormat('he-IL', { weekday: 'long' }).format(date); // Get day name in Hebrew
    return `${dayName} ${jewishDateStr}  `; 
  
  
  }


  
}




