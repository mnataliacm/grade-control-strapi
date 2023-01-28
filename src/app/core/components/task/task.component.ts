import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskModel } from '../../models';
import { isLowResolution as lowres} from 'src/app/utils/screen.utils';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() task:TaskModel | any;
  isLowResolution = lowres;
  constructor() { }

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this.task);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this.task);
  }

}
