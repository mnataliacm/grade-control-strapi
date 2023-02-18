import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private _tasksSubject:BehaviorSubject<TaskModel[]> = new BehaviorSubject<TaskModel[]>([]);
  public tasks$ = this._tasksSubject.asObservable();
  
  constructor(
    private api:ApiService) {
    this.refresh();
   }

   async refresh(){
    this.api.get(`/api/tasks/?populate=grade,module`).subscribe({
      next:response=>{
        console.log(response);
        var array:TaskModel[] = (response.data as Array<any>).map<TaskModel>(data=>{
          return {
            id: data.id,
            name: data.attributes.name,
            type: data.attributes.type,
            info: data.attributes.info,
            // level: data.attributes.level,
            // grade: data.attributes.grade.data.attributes.acronym,        
            // module: data.attributes.module.data.attributes.acronym,  
            //date: data.attributes.date          
          };
        });
        this._tasksSubject.next(array);     
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  getTasks(){
    return this._tasksSubject.value;
  }

  getTaskById(id:number): Promise<TaskModel> {
    return new Promise<TaskModel>((resolve, reject)=>{
      this.api.get(`/api/tasks/${id}?populate=grade,module`).subscribe({
        next:data=>{
          resolve({
            id: data.id,
            name: data.data.attributes.name,
            type: data.data.attributes.type,
            info: data.data.attributes.info,
            level: data.data.attributes.level,
            grade: data.data.attributes.grade.data.data.attributes.acronym,        
            module: data.data.attributes.module.data.data.attributes.acronym,  
            date: data.data.attributes.date     
          });
        },
        error:err=>{
          reject(err);
        }
      });
    });
  }

  async createTask(task: TaskModel){
    this.api.post(`/api/tasks`,{
      data:{
      name: task.name,
      type: task.type,
      info: task.info,
      // level: task.level,
      // grade: task.grade,
      // module: task.module,
      // date: task.date
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

  updateTask(task: TaskModel){
    this.api.put(`/api/tasks/${task.id}`,{
      data:{
      name: task.name,
      type: task.type,
      info: task.info,
      level: task.level,
      grade: task.grade,
      module: task.module,
      //date: task.date
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

  deleteTask(id: number) {
    this.api.delete(`/api/tasks/${id}`).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }
}