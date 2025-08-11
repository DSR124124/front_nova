import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilParejaComponent } from './perfil-pareja.component';

describe('PerfilParejaComponent', () => {
  let component: PerfilParejaComponent;
  let fixture: ComponentFixture<PerfilParejaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilParejaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilParejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
