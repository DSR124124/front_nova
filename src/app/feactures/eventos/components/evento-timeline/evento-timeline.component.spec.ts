import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoTimelineComponent } from './evento-timeline.component';

describe('EventoTimelineComponent', () => {
  let component: EventoTimelineComponent;
  let fixture: ComponentFixture<EventoTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventoTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
