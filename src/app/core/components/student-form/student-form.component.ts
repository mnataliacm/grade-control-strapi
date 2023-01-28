import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { StudentModel } from '../../models';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  currentImage = new BehaviorSubject<string>("");
  currentImage$ = this.currentImage.asObservable();
  @Input('student') set student(student:StudentModel){
    if(student){
      this.form.controls['id'].setValue(student.id);
      this.form.controls['name'].setValue(student.name);
      this.form.controls['surname'].setValue(student.surname);
      this.form.controls['email'].setValue(student.email);
      this.form.controls['picture'].setValue(student.picture);
      if(student.picture)
        this.currentImage.next(student.picture);
      this.form.controls['picture'].setValue(null);
      this.mode = "Edit";
    }
  }
  

  constructor(
    private fb:FormBuilder,
    private modal:ModalController,
    private cdr:ChangeDetectorRef
  ) { 
    this.form = this.fb.group({
      id:[null],
      name:['', [Validators.required]],
      surname:['', [Validators.required]],
      nickname:['', [Validators.required]],
      picture:[''],
      pictureFile:[null]
    });
  }

  onSubmit(){   
    this.modal.dismiss({student: this.form.value, mode:this.mode}, 'ok');
  }

  onDismiss(result: any){
    this.modal.dismiss(null, 'cancel');
  }

  
  changePic(fileLoader: any){
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader = new FileReader();
      reader.onload = () => {   
        that.currentImage.next(reader.result as string);
        that.cdr.detectChanges();
        that.form.controls['picture'].setValue(file);
      };
      reader.onerror = (error) =>{
        console.log(error);
      }
      reader.readAsDataURL(file);
    }
  }
}
