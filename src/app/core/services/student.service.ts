import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private _studentsSubject:BehaviorSubject<StudentModel[]> = new BehaviorSubject<StudentModel[]>([]);
  public _students$ = this._studentsSubject.asObservable();

  constructor(private api:ApiService) {
      this.refresh();
     }

  async refresh(){
    this.api.get(`/api/students&populate=grade,picture,level`).subscribe({
      next:response=>{
        console.log(response);
        var array:StudentModel[] = (response.data as Array<any>).map<StudentModel>(data=>{
          return {
            id: data.id,
            name: data.attributes.name,
            surname: data.attributes.surname,
            email: data.attributes.email,
            picture: data.attributes.picture.data?
                      environment.api_url + data.attributes.picture.data.attributes.url:
                      "", 
            grade: data.attributes.grade.data.attributes.acronym,
            level: data.attributes.level
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

// Get single People data by ID
  getStudentById(id: number): Promise<StudentModel> {
    return new Promise<StudentModel>((resolve, reject)=>{
      this.api.get(`/api/students/${id}?populate=picture`).subscribe({
        next:data=>{
          resolve({
            id:data.data.id,
            name:data.data.attributes.name,
            surname:data.data.attributes.surname,
            email:data.data.attributes.email,
            picture:data.data.attributes.picture.data?
                    environment.api_url+data.data.attributes.picture.data?.attributes.url:
                    "",
            grade:data.data.attributes.grade,
            level:data.data.attributes.level
          });
        },
        error:err=>{
          reject(err);
        }
      });
    });
  }

  async createStudent(student: StudentModel){
    var newStudent = {
      id: null,
      name: student.name,
      surname: student.surname,
      email: student.email,
      grade: student.grade,
      level: student.level
    }
    if(student['picture']){
      var id = await this.uploadImage(student['picture']);
      student['picture'] = 'id';
    }
    this.api.post(`/api/people`,{
      data:student
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

  async updateStudent(id:number, student:StudentModel){
    var _student = {
      name:student.name,
        surname:student.surname,
        email:student.email,
        picture:student.picture,
        grade:student.grade,
        level:student.level
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

  // Delete item by id
  deleteStudent(id: number) {
    this.api.delete(`/api/student/${id}`).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }
}
