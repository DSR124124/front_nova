import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { EmojiPickerComponent } from './components/emoji-picker/emoji-picker.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { LocationPickerComponent } from './components/location-picker/location-picker.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';



@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    DatePickerComponent,
    EmojiPickerComponent,
    ImageUploadComponent,
    LocationPickerComponent,
    RatingStarsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    DatePickerComponent,
    EmojiPickerComponent,
    ImageUploadComponent,
    LocationPickerComponent,
    RatingStarsComponent
  ]
})
export class SharedModule { }
