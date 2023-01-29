import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GradeModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class GradeService {

  private _gradeSubject:BehaviorSubject<GradeModel[]> = new BehaviorSubject<GradeModel[]>([]);
  public grades$ = this._gradeSubject.asObservable();
  
  constructor(
    private api: ApiService) { 
    this.refresh();
  }

  async refresh(){
    this.api.get('/api/grades').subscribe({
      next:response=>{
        console.log(response);
        var array:GradeModel[] = (response.data as Array<any>).
        map<GradeModel>(data=>{
          return {id:data.id, 
                  name:data.attributes.name, 
                  acronym:data.attributes.acronym
          };
        });
        this._gradeSubject.next(array);        
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  getGrades(){
    return this._gradeSubject.value;
  }

  getGradeById(id:number):Promise<GradeModel>{
    return new Promise<GradeModel>((resolve, reject)=>{
      this.api.get(`/api/grades/${id}`).subscribe({
        next:data=>{
          resolve({
            id:data.data.id, 
            name:data.data.attributes.name, 
            acronym:data.data.attributes.acronym
          });         
        },
        error:err=>{
          reject(err);
        }
      });
    });
  }

  createGrade(grade:GradeModel){
    this.api.post(`/api/grades`,{
      data:{
        name: grade.name,
        acronym: grade.acronym
      }
    }).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
    }  
  
  updateGrade(grade: GradeModel){
    this.api.put(`/api/grades/${grade.id}`,{
      data:{
        name:grade.name,
        acronym:grade.acronym
      }
    }).subscribe({
      next:data=>{
        this.refresh(); 
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  deleteGrade(id:number){
    this.api.delete(`/api/grades/${id}`).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }
}
