import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GradeModel } from '../../models';
import { isLowResolution as lowres} from 'src/app/utils/screen.utils';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() grade:GradeModel | any;
  isLowResolution = lowres;
  constructor() { }

  ngOnInit() {}

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this.grade);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this.grade);
  }

}
