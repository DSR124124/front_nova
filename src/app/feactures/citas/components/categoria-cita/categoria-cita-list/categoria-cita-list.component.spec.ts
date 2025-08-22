import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCitaListComponent } from './categoria-cita-list.component';

describe('CategoriaCitaListComponent', () => {
  let component: CategoriaCitaListComponent;
  let fixture: ComponentFixture<CategoriaCitaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaCitaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaCitaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
