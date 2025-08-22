import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCitaFilterComponent } from './categoria-cita-filter.component';

describe('CategoriaCitaFilterComponent', () => {
  let component: CategoriaCitaFilterComponent;
  let fixture: ComponentFixture<CategoriaCitaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaCitaFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaCitaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
