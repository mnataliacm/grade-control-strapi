import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ProfileComponent, StudentFormComponent, StudentModel } from 'src/app/core';
import { GradeService, StudentService } from 'src/app/core/services';
import { HttpClientProvider } from 'src/app/core/services/http-client.provider';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
})
export class StudentsPage {

  constructor(
    private studentSvc: StudentService,
    private gradeSvc: GradeService,
    private alert: AlertController,
    private modal: ModalController,
    private translate: TranslateService,
    private api:HttpClientProvider
  ) {
  }

  getStudent(){
    return this.studentSvc._students$;
  }

  // getFilteredStudents(grade:string, student:StudentModel){
  //   return  this.studentSvc.getStudentById(student.id);
  // }

  getAllGrades() {
    this.gradeSvc.grades$;
  }

  async presentStudentForm(student:StudentModel){
    const modal = await this.modal.create({
      component:StudentFormComponent,
      componentProps:{
        student:student
      },
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'New':
            this.studentSvc.createStudent(result.data.student);
            break;
          case 'Edit':
            this.studentSvc.updateStudent(result.data.id, result.data.student);
            break;
          default:
        }
      }
    });
  }

  onEditStudent(student: StudentModel){
    this.presentStudentForm(student);
  }

  async onDeleteStudent(student: StudentModel) {
    const alert = await this.alert.create({
      header:'Atención',
      message: '¿Está seguro de que desear borrar este estudiante?',
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
            this.studentSvc.deleteStudent(student.id);
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

  toPerfil(student: StudentModel) {
    this.presentProfileStudent(student);
  }

  async presentProfileStudent(student: StudentModel) {
    const modal = await this.modal.create({
      component: ProfileComponent,
      componentProps: {
        student: student
      }
    });

    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        switch (result.data.mode) {
          case 'New':
            this.studentSvc.createStudent(result.data.student);
            break;
          case 'Edit':
            this.studentSvc.updateStudent(result.data.student.id, result.data.student);
            break;
          default:
        }
      }
    });
  }

}
