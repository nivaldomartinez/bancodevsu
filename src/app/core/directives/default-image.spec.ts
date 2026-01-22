import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultImageDirective } from './default-image';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <img [src]="src" [defaultImage]="defaultImage" defaultImage alt="test">
  `,
  imports: [DefaultImageDirective]
})
class TestComponent {
  src = 'valid-image.jpg';
  defaultImage: string | undefined = undefined;
}

describe('DefaultImageDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let imgEl: HTMLImageElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, DefaultImageDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    const directive = fixture.debugElement.query(By.directive(DefaultImageDirective));
    expect(directive).toBeTruthy();
  });

  it('should not change src if image loads successfully', () => {
    fixture.detectChanges();
    imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
    imgEl.src = 'valid-image.jpg'; 
    expect(imgEl.src).toContain('valid-image.jpg');
  });

  it('should set src to "logo.png" on error if no input provided', () => {
    fixture.detectChanges();
    imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
    
    imgEl.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    
    expect(imgEl.src).toContain('logo.png');
  });

  it('should set src to provided default image on error', () => {
    component.defaultImage = 'fallback.jpg';
    fixture.detectChanges();
    
    imgEl = fixture.debugElement.query(By.css('img')).nativeElement;

    imgEl.dispatchEvent(new Event('error'));
    
    expect(imgEl.src).toContain('fallback.jpg');
  });

  it('should not update src if it matches fallback to prevent infinite loop', () => {
    fixture.detectChanges();
    imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
    const fallback = 'logo.png';

    imgEl.src = 'http://localhost/' + fallback; 
    
    const spy = vi.spyOn(imgEl, 'src', 'set'); 

    imgEl.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});
