import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastoChartComponent } from './gasto-chart.component';

describe('GastoChartComponent', () => {
  let component: GastoChartComponent;
  let fixture: ComponentFixture<GastoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastoChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
