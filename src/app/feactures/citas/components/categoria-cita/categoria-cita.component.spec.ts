import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCitaComponent } from './categoria-cita.component';

describe('CategoriaCitaComponent', () => {
  let component: CategoriaCitaComponent;
  let fixture: ComponentFixture<CategoriaCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaCitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
