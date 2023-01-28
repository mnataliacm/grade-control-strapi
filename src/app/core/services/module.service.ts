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
    this.api.get('/api/modules/?populate=grade').subscribe({
      next:response=>{
        console.log(response);
        var array:ModuleModel[] = (response.data as Array<ModuleModel>).
        map<ModuleModel>(module=>{
          return {id:module.id, 
                  name:module.name, 
                  acronym:module.acronym,
                  level:module.level
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
            acronym:data.data.attributes.acronym,
            level:data.data.attributes.level
          });         
        },
        error:err=>{
          reject(err);
        }
      });
    });
  }

  async createModule(module:ModuleModel){
      var newModule = {
        id: null,
        name: module.name,
        acronym: module.acronym,
        level: module.level
      }
    }

  
  
  updateModule(id:number, module: ModuleModel | any){
    this.api.put(`/api/modules/${module.id}`,{
      data:{
        name:module.name,
        acronym:module.acronym,
        level:module.level
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
