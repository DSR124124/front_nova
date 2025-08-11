import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarMapComponent } from './lugar-map.component';

describe('LugarMapComponent', () => {
  let component: LugarMapComponent;
  let fixture: ComponentFixture<LugarMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LugarMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugarMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
