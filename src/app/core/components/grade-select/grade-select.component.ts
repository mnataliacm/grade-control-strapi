import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { GradeModel } from '../../models';
import { GradeService } from '../../services';

export const GRADE_PROFILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GradeSelectComponent),
  multi: false
};

@Component({
  selector: 'app-grade-select',
  templateUrl: './grade-select.component.html',
  styleUrls: ['./grade-select.component.scss'],
  providers:[GRADE_PROFILE_VALUE_ACCESSOR]
})
export class GradeSelectComponent implements ControlValueAccessor {

  selectGrade: any;
  propagateChange = (_: any) => { }
  isDisabled:boolean = false;

  constructor(private gradeSvc:GradeService) { }

  async writeValue(obj: any) {
    try {
      this.selectGrade = await this.gradeSvc.getGradeById(obj);
    } catch (error) {
      console.log("No se ha podido recupera los datos: " + error);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  getGrades(){
    return this.gradeSvc.grades$;
  } 

  onGradeClicked(grade: GradeModel, accordion:IonAccordionGroup){
    this.selectGrade = grade;
    accordion.value='';
    this.propagateChange(this.selectGrade.acronym);
  }

}
