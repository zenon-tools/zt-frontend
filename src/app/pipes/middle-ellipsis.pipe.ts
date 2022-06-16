import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'middleEllipsis',
})
export class MiddleEllipsisPipe implements PipeTransform {
    transform(text: string, maxLength: number = 20): string {
        if (maxLength < 10) {
            maxLength = 10;
        }
        if (text.length > maxLength) {
            const charsToShow = Math.round(maxLength / 2) - 2;
            return (
                text.slice(0, charsToShow) +
                '...' +
                text.slice(text.length - charsToShow, text.length)
            );
        } else {
            return text;
        }
    }
}
