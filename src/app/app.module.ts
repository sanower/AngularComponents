import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CircleComponent } from './components/circle/circle.component';
import { SanTreeComponent } from './components/san-tree/san-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    CircleComponent,
    SanTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
