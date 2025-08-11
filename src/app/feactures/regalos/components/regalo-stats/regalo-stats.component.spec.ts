import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegaloStatsComponent } from './regalo-stats.component';

describe('RegaloStatsComponent', () => {
  let component: RegaloStatsComponent;
  let fixture: ComponentFixture<RegaloStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegaloStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegaloStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
