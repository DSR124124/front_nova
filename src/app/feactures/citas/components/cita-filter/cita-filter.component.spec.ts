import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaFilterComponent } from './cita-filter.component';

describe('CitaFilterComponent', () => {
  let component: CitaFilterComponent;
  let fixture: ComponentFixture<CitaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitaFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
