import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarListComponent } from './lugar-list.component';

describe('LugarListComponent', () => {
  let component: LugarListComponent;
  let fixture: ComponentFixture<LugarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LugarListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
