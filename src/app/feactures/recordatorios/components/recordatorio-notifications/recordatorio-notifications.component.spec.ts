import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatorioNotificationsComponent } from './recordatorio-notifications.component';

describe('RecordatorioNotificationsComponent', () => {
  let component: RecordatorioNotificationsComponent;
  let fixture: ComponentFixture<RecordatorioNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordatorioNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordatorioNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
