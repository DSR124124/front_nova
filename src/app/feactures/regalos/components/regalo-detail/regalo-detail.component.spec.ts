import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegaloDetailComponent } from './regalo-detail.component';

describe('RegaloDetailComponent', () => {
  let component: RegaloDetailComponent;
  let fixture: ComponentFixture<RegaloDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegaloDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegaloDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
