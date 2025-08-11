import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { AppComponent } from './app.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatePickerComponent } from './shared/components/date-picker/date-picker.component';
import { ImageUploadComponent } from './shared/components/image-upload/image-upload.component';
import { LocationPickerComponent } from './shared/components/location-picker/location-picker.component';
import { EmojiPickerComponent } from './shared/components/emoji-picker/emoji-picker.component';
import { RatingStarsComponent } from './shared/components/rating-stars/rating-stars.component';
import { HeaderComponent } from './layout/components/header/header.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { BreadcrumbComponent } from './layout/components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageUploadComponent,
    LocationPickerComponent,
    EmojiPickerComponent,
    RatingStarsComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeNgModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
