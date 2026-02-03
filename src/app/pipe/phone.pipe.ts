import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumber implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const cleaned = value.toString().replace(/\D/g, '');
    
    const DDD = value.slice(0,2);
    const prefix = value.slice(2,3);
    const fourFistnumber = value.slice(3,7);
    const fourLastnumber = value.slice(7,11);

    const formatedPhoneNumber = `(${DDD}) ${prefix} ${fourFistnumber}-${fourLastnumber}`;
    return formatedPhoneNumber
  }
}
