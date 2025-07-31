import { Pipe, PipeTransform } from '@angular/core';
import { formatJewishDateInHebrew, toJewishDate } from 'jewish-date';

@Pipe({
  name: 'hebrewDate',
})
export class HebrewDatePipe implements PipeTransform {
  transform(date: Date): string {
    const jewishDate = toJewishDate(date);
    const jewishDateStr = formatJewishDateInHebrew(jewishDate);
    return jewishDateStr;
  }
}
