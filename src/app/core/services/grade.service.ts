import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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
    private api: ApiService,
    private alert: AlertController,
    private translate: TranslateService,
    ) { 
    this.refresh();
  }

  async refresh(){
    this.api.get('/api/grades/').subscribe({
      next:response=>{
        console.log(response);
        var array:GradeModel[] = (response.data as Array<GradeModel>).
        map<GradeModel>(grade=>{
          return {id:grade.id, 
                  name:grade.name, 
                  acronym:grade.acronym,
                  first:grade.first,
                  second:grade.second
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

  async createGrade(grade:GradeModel){
      var newGrade = {
        id: null,
        name: grade.name,
        acronym: grade.acronym
      }
    }

  
  
  updateGrade(id:number, grade: GradeModel | any){
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

  deleteGradeById(id:number){
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
