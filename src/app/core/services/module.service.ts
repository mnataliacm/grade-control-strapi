import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModuleModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private _moduleSubject:BehaviorSubject<ModuleModel[]> = new BehaviorSubject<ModuleModel[]>([]);
  public modules$ = this._moduleSubject.asObservable();
  
  constructor(private api: ApiService) { 
    this.refresh();
  }

  async refresh(){
    this.api.get('/api/grades').subscribe({
      next:response=>{
        console.log(response);
        var array:ModuleModel[] = (response.data as Array<ModuleModel>).
        map<ModuleModel>(grade=>{
          return {id:grade.id, 
                  name:grade.name, 
                  acronym:grade.acronym
          };
        });
        this._moduleSubject.next(array);        
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  getModules(){
    return this._moduleSubject.value;
  }

  getModuleById(id:number):Promise<ModuleModel>{
    return new Promise<ModuleModel>((resolve, reject)=>{
      this.api.get(`/api/modules/${id}`).subscribe({
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

  async createModule(grade:ModuleModel){
      var newModule = {
        id: null,
        name: grade.name,
        acronym: grade.acronym
      }
    }

  
  
  updateModule(id:number, grade: ModuleModel | any){
    this.api.put(`/api/modules/${module.id}`,{
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

  deleteModuleById(id:number){
    this.api.delete(`/api/modules/${id}`).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }
}
