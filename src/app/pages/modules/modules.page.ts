import { Component} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { GradeFormComponent, GradeModel, GradeService } from 'src/app/core';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.page.html',
  styleUrls: ['./modules.page.scss'],
})
export class ModulesPage {


  constructor(
    private gradeSvc: GradeService,
    private modal:ModalController,
    private alert:AlertController
  ) { }

  getModules(){
    return this.gradeSvc.grades$;
  }

  async presentGradeForm(grade: GradeModel){
    const modal = await this.modal.create({
      component:GradeFormComponent,
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
            this.gradeSvc.createGrade(result.data.grade);
            break;
          case 'Edit':
            this.gradeSvc.updateGrade(result.data.id, result.data.grade);
            break;
          default:
        }
      }
    });
  }

  onEditGrade(grade: GradeModel){
    this.presentGradeForm(grade);
  }

  async onDeleteGrade(grade: GradeModel){

    const alert = await this.alert.create({
      header: 'Atención',
      message: '¿Está seguro de que desear borrar la tarea?',
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
            this.gradeSvc.deleteGradeById(grade.id);
          },
        },
      ],
    });
  }

}
