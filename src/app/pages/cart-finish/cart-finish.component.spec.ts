import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartFinishComponent } from './cart-finish.component';


describe('SingUpComponent', () => {
  let component: CartFinishComponent;
  let fixture: ComponentFixture<CartFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartFinishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
