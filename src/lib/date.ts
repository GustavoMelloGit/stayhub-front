import { format } from 'date-fns';

export class DateUtils {
  static isoToInputDateTimeLocal = (isoDate: string | Date): string => {
    return format(isoDate, "yyyy-MM-dd'T'HH:mm");
  };
}
