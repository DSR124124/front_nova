import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatorioCalendarComponent } from './recordatorio-calendar.component';

describe('RecordatorioCalendarComponent', () => {
  let component: RecordatorioCalendarComponent;
  let fixture: ComponentFixture<RecordatorioCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordatorioCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordatorioCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
