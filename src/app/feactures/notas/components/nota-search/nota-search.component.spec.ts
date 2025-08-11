import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaSearchComponent } from './nota-search.component';

describe('NotaSearchComponent', () => {
  let component: NotaSearchComponent;
  let fixture: ComponentFixture<NotaSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotaSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
