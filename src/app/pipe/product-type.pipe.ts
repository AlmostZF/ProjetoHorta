import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productType'
})
export class ProductType implements PipeTransform {
    
    getProductType(type:number):string{
        switch (type) {
        case 0:
            return 'Verdura';
        case 1:
            return 'Legume';
        case 2:
            return 'Fruta';
        case 3:
            return 'Grao';
        case 4:
            return 'Outro';
        default:
            return '...';
        }
    }

  transform(value: number): string {
    if (value == null || value == undefined) return '';
    return this.getProductType(value);
  }
}


