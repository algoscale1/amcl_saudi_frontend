import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filters'
})
export class FiltersPipe implements PipeTransform {

  transform(value: any, filterString: string, propName: string, selectedArray): any {
    // console.log(selectedArray);
    if (value.length === 0 || filterString == '') {
      return value;
    }

    let resultArray = [];

    if (selectedArray) {

      resultArray.concat(selectedArray);
      console.log(resultArray)
    }


    for (const item of value) {

      let searchItem: string = item[propName];

      // console.log(searchItem)
      if (searchItem.toLowerCase().includes(filterString.toLowerCase())) {
        resultArray.push(item);
      }
    };

    return resultArray;

  }

}
