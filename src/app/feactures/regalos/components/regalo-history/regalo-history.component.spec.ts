import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegaloHistoryComponent } from './regalo-history.component';

describe('RegaloHistoryComponent', () => {
  let component: RegaloHistoryComponent;
  let fixture: ComponentFixture<RegaloHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegaloHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegaloHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
