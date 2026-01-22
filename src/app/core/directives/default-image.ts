import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
    selector: '[defaultImage]',
    host: {
        '(error)': 'onError()'
    },
})
export class DefaultImageDirective {
    private el = inject(ElementRef);
    
    defaultImage = input<string>();

    onError() {
        const img = this.el.nativeElement;

    const fallback = this.defaultImage() ?? 'logo.png';
    if (!img.src.endsWith(fallback)) {
      img.src = fallback;
    }
    }
}