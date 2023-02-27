import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TaskFormComponent, TaskModel } from 'src/app/core';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {

  constructor(
    private taskSvc: TaskService,
    private alert: AlertController,
    private modal: ModalController,
  ) { }

  getTasks() {
    return this.taskSvc._tasks$;
  }

  onEditTask(task: TaskModel) {
    this.presentTaskForm(task);
  }

  async presentTaskForm(task: TaskModel) {
    const modal = await this.modal.create({
      component: TaskFormComponent,
      componentProps: {
        task: task
      },
      cssClass: "modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        switch (result.data.mode) {
          case 'New':
            this.taskSvc.createTask(result.data.task);
            break;
          case 'Edit':
            this.taskSvc.updateTask(result.data.task);
            break;
          default:
        }
      }
    });
  }

  async onDeleteTask(task: TaskModel) {
    this.onDeleteAlert(task);
  }

  async onDeleteAlert(task: TaskModel) {
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
            this.taskSvc.deleteTask(task.id);
          },
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
  }



  async presentForm(_class: typeof TaskFormComponent, onDismiss: (arg0: any) => void) {
    const modal = await this.modal.create({
      component: _class,
      cssClass: "modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        onDismiss(result.data);
      }
    });
  }

  onNewItem() {
    this.presentForm(TaskFormComponent, (data) => {
      this.taskSvc.createTask(data.task);
    });
  }

}
