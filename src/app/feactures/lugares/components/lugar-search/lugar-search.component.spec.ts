import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarSearchComponent } from './lugar-search.component';

describe('LugarSearchComponent', () => {
  let component: LugarSearchComponent;
  let fixture: ComponentFixture<LugarSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LugarSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
