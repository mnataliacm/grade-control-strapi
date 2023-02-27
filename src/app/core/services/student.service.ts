import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class StudentService {

  private _studentsSubject:BehaviorSubject<StudentModel[]> = new BehaviorSubject<StudentModel[]>([]);
  public _students$ = this._studentsSubject.asObservable();

  constructor(
    private api:ApiService) { this.refresh(); }

  async refresh(){
    this.api.get(`/api/students/?populate=picture,grade`).subscribe({
      next:response=>{
        console.log(response);
        var array:StudentModel[] = (response.data as Array<any>).map<StudentModel>(data=>{
          return {
            id: data.id,
            name: data.attributes.name,
            surname: data.attributes.surname,
            email: data.attributes.email,
            level: data.attributes.level,        
            grade: data.attributes.grade.data?.attributes.acronym,
            picture: data.attributes.picture.data?
                      environment.api_url + data.attributes.picture.data.attributes.url:
                      ""                       
          };
        });
        this._studentsSubject.next(array);     
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  getStudents(){
    return this._studentsSubject.value;
  }

  getStudentById(id: number): Promise<StudentModel> {
    return new Promise<StudentModel>((resolve, reject)=>{
      this.api.get(`/api/students/${id}?populate=picture,grade`).subscribe({
        next:data=>{
          resolve({
            id:data.data.id,
            name:data.data.attributes.name,
            surname:data.data.attributes.surname,
            email:data.data.attributes.email,
            level:data.data.attributes.level,
            grade:data.data.attributes.grade.data?.attributes.acronym,
            picture:data.data.attributes.picture.data?
                    environment.api_url+data.data.attributes.picture.data?.attributes.url:
                    ""                       
          });
        },
        error:err=>{
          reject(err);
        }
      });
    });
  }

  async createStudent(student: StudentModel){
    var _student = {
      name: student.name,
      surname: student.surname,
      email: student.email,
      level: student.level,
      grade: student.grade, 
    }
    if(student['picture']){
      var id = await this.uploadImage(student['picture']);
      student['picture'] = 'id';
    }
    this.api.post(`/api/students/?populate=grade`,{
      data:_student
    }).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  uploadImage(file: any){  
    return new Promise<number>((resolve, reject)=>{
      var formData = new FormData();
      formData.append('files', file);
      this.api.post("/api/upload",formData).subscribe({
        next: data=>{
          resolve(data[0].id);
        },
        error: err=>{
          reject(err);
        }
      });
    });
  }

  async updateStudent(student:StudentModel){
    var _student = {
      name:student.name,
      surname:student.surname,
      email:student.email,
      level:student.level,
      grade:student.grade,
      picture:student.picture,            
    };
    if(student['picture']){
      var id = await this.uploadImage(student['picture']);
      _student['picture'] = 'id';
    }
    this.api.put(`/api/students/${student.id}`,
    {
      data:_student
    }).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  } 

  deleteStudent(id: number) {
    this.api.delete(`/api/students/${id}`).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }
}
