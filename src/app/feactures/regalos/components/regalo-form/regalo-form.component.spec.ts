import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegaloFormComponent } from './regalo-form.component';

describe('RegaloFormComponent', () => {
  let component: RegaloFormComponent;
  let fixture: ComponentFixture<RegaloFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegaloFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegaloFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
