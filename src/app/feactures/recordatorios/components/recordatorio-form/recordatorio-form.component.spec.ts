import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatorioFormComponent } from './recordatorio-form.component';

describe('RecordatorioFormComponent', () => {
  let component: RecordatorioFormComponent;
  let fixture: ComponentFixture<RecordatorioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordatorioFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordatorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
