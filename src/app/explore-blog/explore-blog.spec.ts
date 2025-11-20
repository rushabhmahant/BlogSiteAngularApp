import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreBlog } from './explore-blog';

describe('ExploreBlog', () => {
  let component: ExploreBlog;
  let fixture: ComponentFixture<ExploreBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
