import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor, ResponseInterceptor } from './core/interceptor';
import { BootService } from './core/service/boot.service';
import { initializeAppFactory } from './core/initializer/app.initializer';
import { ExportAsModule, ExportAsService } from 'ngx-export-as';
import { NgbDateCustomParserFormatterService } from './core/service/NgbDateCustomParserFormatter.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ExportAsModule,
    NgSelectModule,
    ToastrModule.forRoot({
      enableHtml: true,
      timeOut: 8000,
      progressBar: true,
      extendedTimeOut: 4000
    })
  ],
  providers: [
    ExportAsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [BootService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
