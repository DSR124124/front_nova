import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaListComponent } from './cita-list.component';

describe('CitaListComponent', () => {
  let component: CitaListComponent;
  let fixture: ComponentFixture<CitaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
