import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCitaDeleteComponent } from './categoria-cita-delete.component';

describe('CategoriaCitaDeleteComponent', () => {
  let component: CategoriaCitaDeleteComponent;
  let fixture: ComponentFixture<CategoriaCitaDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaCitaDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaCitaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
