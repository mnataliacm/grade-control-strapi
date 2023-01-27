import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { GradeModel } from '../../models';

@Component({
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.scss'],
})
export class GradeFormComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  @Input('grade') set grade(grade:GradeModel){
    if(grade){
      this.form.controls['id'].setValue(grade.id);
      this.form.controls['name'].setValue(grade.name);
      this.form.controls['acronym'].setValue(grade.acronym);
      this.mode = "Edit";
    }
  }
  

  constructor(
    private fb:FormBuilder,
    private modal:ModalController
  ) { 
    this.form = this.fb.group({
      id:[null],
      name:['', [Validators.required]],
      acronym:['']
    });
  }

  ngOnInit() {

  }

  onSubmit(){
    
    this.modal.dismiss({task: this.form.value, mode:this.mode}, 'ok');
  }

  onDismiss(result: any){
    this.modal.dismiss(null, 'cancel');
  }

}
