import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandomizeUiKit } from './brandomize-ui-kit';

describe('BrandomizeUiKit', () => {
  let component: BrandomizeUiKit;
  let fixture: ComponentFixture<BrandomizeUiKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandomizeUiKit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandomizeUiKit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
