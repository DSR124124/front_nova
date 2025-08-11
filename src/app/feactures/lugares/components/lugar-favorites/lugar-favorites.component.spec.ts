import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarFavoritesComponent } from './lugar-favorites.component';

describe('LugarFavoritesComponent', () => {
  let component: LugarFavoritesComponent;
  let fixture: ComponentFixture<LugarFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LugarFavoritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugarFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
