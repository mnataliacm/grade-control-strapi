import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isLowResolution as lowres} from 'src/app/utils/screen.utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isLowResolution:()=>boolean = lowres;

  constructor(
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('es');
  }

  spanish() {
    this.translate.setDefaultLang('es');
  }
  english() {
    this.translate.setDefaultLang('en');
  }

}
