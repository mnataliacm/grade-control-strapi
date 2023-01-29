import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClientNativeProvider } from './core/services/http-client-native.provider';
import { HttpClientWebProvider } from './core/services/http-client-web.provider';
import { HttpClientProvider } from './core/services/http-client.provider';
import { CoreModule } from './core/core.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

export function httpProviderFactory(
  httpNative:HTTP,
  http:HttpClient,
  platform:Platform) {
  if(platform.is('mobile') && !platform.is('mobileweb'))
    return new HttpClientNativeProvider(httpNative, http);
  else
    return new HttpClientWebProvider(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    CoreModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot({
      name: '__gradecontroldb',
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
          //driverOrder: ['indexedDB', 'sqlite', 'websql']
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    {
      provide: HttpClientProvider,
      deps: [HTTP, HttpClient, Platform],
      useFactory: httpProviderFactory,  
    },
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
