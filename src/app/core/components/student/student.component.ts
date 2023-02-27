import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { GradeModel, StudentModel } from '../../models';
import { GradeService } from '../../services';
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
  @Input() grade:GradeModel | any;
  isLowResolution:()=>boolean = lowres;

  constructor(
    private gradeSvc:GradeService,
  ){}

  getGrades() {
    return this.gradeSvc.grades$;
  }

  getFilteredStudents(grade:string){
    return this.student.filter((s:any)=>s.grade == grade);
  }

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this.student);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this.student);
  }

}
