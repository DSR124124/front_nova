import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegaloListComponent } from './regalo-list.component';

describe('RegaloListComponent', () => {
  let component: RegaloListComponent;
  let fixture: ComponentFixture<RegaloListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegaloListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegaloListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
