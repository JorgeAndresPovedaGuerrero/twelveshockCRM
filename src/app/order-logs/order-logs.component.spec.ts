import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLogsComponent } from './order-logs.component';

describe('OrderLogsComponent', () => {
  let component: OrderLogsComponent;
  let fixture: ComponentFixture<OrderLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
