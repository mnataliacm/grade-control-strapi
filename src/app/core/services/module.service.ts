import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModuleModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private _moduleSubject: BehaviorSubject<ModuleModel[]> = new BehaviorSubject<ModuleModel[]>([]);
  public modules$ = this._moduleSubject.asObservable();

  constructor(private api: ApiService) { this.refresh(); }

  async refresh() {
    this.api.get('/api/modules/?populate[0]=grade').subscribe({
      next: response => {
        console.log(response);
        var array: ModuleModel[] = (response.data as Array<any>).
          map<ModuleModel>(data => {
            return {
              id: data.id,
              name: data.attributes.name,
              acronym: data.attributes.acronym,
              grade: data.attributes.grade.data.attributes.acronym
            };
          });
        this._moduleSubject.next(array);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getModules() {
    return this._moduleSubject.value;
  }

  getModuleById(id: number): Promise<ModuleModel> {
    return new Promise<ModuleModel>((resolve, reject) => {
      this.api.get(`/api/modules/${id}?populate=grade`).subscribe({
        next: data => {
          resolve({
            id: data.data.id,
            name: data.data.attributes.name,
            acronym: data.data.attributes.acronym,
            grade: data.data.attributes.grade.data.attributes.acronym
          });
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  // createModule(module:ModuleModel){
  //   var _module = {
  //       name: module.name,
  //       acronym: module.acronym,
  //       // grade: module.grade         
  //   }
  //   // if(module['grade']){
  //   //   var id = this.gradeSvc.getGradeById(module['grade']);
  //   // }
  //   this.api.post(`api/modules`,{
  //     data:_module
  //   }).subscribe({
  //     next:data=>{
  //       this.refresh();
  //     },
  //     error:err=>{
  //       console.log(err);
  //     }
  //   });
  // } 

  createModule(module: ModuleModel) {
    this.api.post(`/api/modules/?populate=grade`, {
      data: {
        name: module.name,
        acronym: module.acronym,
        grade: module.grade,
      }
    }).subscribe({
      next: data => {
        this.refresh();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  updateModule(module: ModuleModel) {
    this.api.put(`/api/modules/${module.id}`, {
      data: {
        name: module.name,
        acronym: module.acronym,
        grade: module.grade
      }
    }).subscribe({
      next: data => {
        this.refresh();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  deleteModuleById(id: number) {
    this.api.delete(`/api/modules/${id}`).subscribe({
      next: data => {
        this.refresh();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
