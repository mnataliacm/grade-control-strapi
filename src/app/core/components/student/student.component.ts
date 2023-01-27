import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { StudentModel } from '../../models';
import { StudentService } from '../../services';
import { isLowResolution as lowres} from 'src/app/utils/screen.utils';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() student:StudentModel | any ;
  isLowResolution:()=>boolean = lowres;

  constructor(
    private studentSvc:StudentService,
  ){}

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this.student);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this.student);
  }

}
