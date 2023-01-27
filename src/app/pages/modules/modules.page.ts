import { Component} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GradeModel, HttpClientProvider, ModuleFormComponent, ModuleModel } from 'src/app/core';
import { ModuleService } from 'src/app/core/services/module.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage {

  constructor(
    private moduleSvc: ModuleService,
    private modal:ModalController,
    private alert:AlertController,
    private translate:TranslateService,
    private api:HttpClientProvider
  ) { }

  getModules(){
    return this.moduleSvc.modules$;
  }

  async presentModuleForm(grade: GradeModel){
    const modal = await this.modal.create({
      component:ModuleFormComponent,
      componentProps:{
        grade:grade
      },
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'New':
            this.moduleSvc.createModule(result.data.module);
            break;
          case 'Edit':
            this.moduleSvc.updateModule(result.data.id, result.data.module);
            break;
          default:
        }
      }
    });
  }

  onEditModule(module: ModuleModel){
    this.presentModuleForm(module);
  }

  async onDeleteModule(module: ModuleModel){
    const alert = await this.alert.create({
      header: 'Atención',
      message: '¿Está seguro de que desear borrar el módulo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: 'Borrar',
          role: 'confirm',
          handler: () => {
            this.moduleSvc.deleteModuleById(module.id);
          },
        },
      ],
    });
  }

}
