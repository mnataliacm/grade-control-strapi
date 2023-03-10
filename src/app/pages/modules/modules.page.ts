import { Component} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModuleFormComponent, ModuleModel } from 'src/app/core';
import { ModuleService } from 'src/app/core/services/module.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage {

  _modules: ModuleModel[] = [];

  constructor(
    private moduleSvc: ModuleService,
    private modal:ModalController,
    private alert:AlertController,
  ) { }

  getModules(){
    return this.moduleSvc.modules$;
  }

  // getGrades() {
  //   return this.gradeSvc.grades$;
  // }

  // getFilteredByGrade(grade:string|null){
  //   return this._modules.filter(s=>s.grade == grade);
  // }

  getTotal(){
    var total = 0;
    this.moduleSvc.getModules().forEach(value => {
      total += 1;
    })
    return total;
  }

  onEditModule(module: ModuleModel){
    this.presentModuleForm(module);
  }

  async presentModuleForm(module: ModuleModel){
    const modal = await this.modal.create({
      component:ModuleFormComponent,
      componentProps:{
        module:module
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
            this.moduleSvc.updateModule(result.data.module);
            break;
          default:
        }
      }
    });
  }

  async onDeleteModule(module:ModuleModel){
    this.onDeleteAlert(module);
  }

  async onDeleteAlert(module: ModuleModel){
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
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

  async presentForm(_class: typeof ModuleFormComponent, onDismiss:(arg0: any)=>void){
    const modal = await this.modal.create({
      component:_class,
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result.data);
      }
    });
  }

  onNewItem(){
    this.presentForm(ModuleFormComponent, (data)=>{
      this.moduleSvc.createModule(data.module);
    });
  }

}
