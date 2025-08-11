import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatorioListComponent } from './recordatorio-list.component';

describe('RecordatorioListComponent', () => {
  let component: RecordatorioListComponent;
  let fixture: ComponentFixture<RecordatorioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordatorioListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordatorioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
