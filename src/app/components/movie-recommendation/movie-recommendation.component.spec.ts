import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MovieRecommendationComponent } from './movie-recommendation.component';

describe('MovieRecommendationComponent', () => {
  let component: MovieRecommendationComponent;
  let fixture: ComponentFixture<MovieRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatInputModule,
        MatButtonModule,
        HttpClientModule,
        MatAutocompleteModule,
        MatListModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [ MovieRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
