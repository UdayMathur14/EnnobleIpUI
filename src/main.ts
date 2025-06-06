/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


if (environment.production) {
  enableProdMode();
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

