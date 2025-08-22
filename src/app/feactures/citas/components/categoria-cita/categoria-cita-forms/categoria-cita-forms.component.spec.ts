import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCitaFormsComponent } from './categoria-cita-forms.component';

describe('CategoriaCitaFormsComponent', () => {
  let component: CategoriaCitaFormsComponent;
  let fixture: ComponentFixture<CategoriaCitaFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaCitaFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaCitaFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
