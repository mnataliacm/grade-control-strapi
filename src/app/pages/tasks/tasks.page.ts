import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { TaskService } from 'src/app/core/services/task.service';
import { isLowResolution as lowres } from 'src/app/utils/screen.utils';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {

  _tasks: any;
  isLowResolution = lowres;

  constructor(
    private taskSvc: TaskService,
    private alert: AlertController,
    private translate: TranslateService,
  ) {
  }

  ionViewWillEnter() {
    this.getAllTasks();
  }

  getAllTasks() {
    this.taskSvc.getListTask().subscribe(response => {
      console.log(response);
      this._tasks = response;
    })
  }

  async delete(item: { id: string; }) {
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('task.alert')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('button.cancel')),
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: await lastValueFrom(this.translate.get('button.delete')),
          role: 'confirm',
          handler: () => {
            this.taskSvc.deleteTask(item.id).subscribe(response => {
              this.getAllTasks();
            })
          },
        }
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }



  // constructor(
  //   public tasksSvc: TaskService,
  //   //private assignmentSvc: AssignmentService,
  //   private modal: ModalController,
  //   private alert: AlertController,
  //   private translate: TranslateService
  //   ) { }

  // getTasks(){
  //   return this.tasksSvc._tasks$;
  // }

  // async presentTaskForm(task:Task){
  //   const modal = await this.modal.create({
  //     component:TaskFormComponent,
  //     componentProps:{
  //       task:task
  //     }
  //   });

  //   modal.present();
  //   modal.onDidDismiss().then(result=>{
  //     if(result && result.data){
  //       switch(result.data.mode){
  //         case 'New':
  //           this.tasksSvc.addTask(result.data.task);
  //           break;
  //         case 'Edit':
  //           this.tasksSvc.updateTask(result.data.task);
  //           break;
  //         default:
  //       }
  //     }
  //   });
  // }

  // onNewTask(){
  //   this.presentTaskForm(null);  
  // }

  // onEditTask(task: Task){
  //   this.presentTaskForm(task);
  // }

  // async onDeleteAlert(task: { id: any; }){
  //   const alert = await this.alert.create({
  //     header: await lastValueFrom(this.translate.get('task.alert')),
  //     buttons: [
  //       {
  //         text: await lastValueFrom(this.translate.get('button.cancel')),
  //         role: 'cancel',
  //         handler: () => {
  //           console.log("Operacion cancelada");
  //         },
  //       },
  //       {
  //         text: await lastValueFrom(this.translate.get('button.delete')),
  //         role: 'confirm',
  //         handler: () => {
  //           this.tasksSvc.deleteTaskById(task.id);
  //         },
  //       },
  //     ],
  //   });
  //   await alert.present();
  //   const { role } = await alert.onDidDismiss();
  // }

  // async onTaskExistsAlert(person) {
  //   const alert = await this.alert.create({
  //     header: await lastValueFrom(this.translate.get('detail.warning')),
  //     message: await lastValueFrom(this.translate.get('task.warning')),
  //     buttons: [
  //       {
  //         text: await lastValueFrom(this.translate.get('button.close')),
  //         role: 'close',
  //         handler: () => { },
  //       },
  //     ],
  //   });
  //   await alert.present();
  //   const { role } = await alert.onDidDismiss();
  // }

  // onDeleteTask(task){
  //   if (!this.assignmentService.getAssignmentByTaskId(task.id).length) {
  //     this.onDeleteAlert(task);
  //   } else {
  //     this.onTaskExistsAlert(task);
  //   }
  // }

}
