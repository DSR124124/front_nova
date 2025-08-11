import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoGalleryComponent } from './evento-gallery.component';

describe('EventoGalleryComponent', () => {
  let component: EventoGalleryComponent;
  let fixture: ComponentFixture<EventoGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventoGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
