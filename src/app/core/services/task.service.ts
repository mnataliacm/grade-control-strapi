import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  getListTask() {
    throw new Error('Method not implemented.');
  }

  private _tasksSubject:BehaviorSubject<TaskModel[]> = new BehaviorSubject<TaskModel[]>([]);
  public tasks$ = this._tasksSubject.asObservable();
  
  constructor(private api:ApiService) {
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
            level: data.attributes.level,
            grade: data.attributes.grade.data.attributes.acronym,        
            module: data.attributes.module.data.attributes.acronym,  
            date: data.attributes.date          
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
            name: data.attributes.name,
            type: data.attributes.type,
            info: data.attributes.info,
            level: data.attributes.level,
            grade: data.attributes.grade.data.attributes.acronym,        
            module: data.attributes.module.data.attributes.acronym,  
            date: data.attributes.date     
          });
        },
        error:err=>{
          reject(err);
        }
      });
    });
  }

  async createTask(task: TaskModel){
    var newTask = {
      id: null,
      name: task.name,
      type: task.type,
      info: task.info,
      level: task.level,
      grade: task.grade,
      module: task.module,
      date: task.date
    }
    this.api.post(`api/tasks`,{
      data:task
    }).subscribe({
      next:data=>{
        this.refresh();
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  async updateTask(id: number, task: TaskModel){
    var _task = {
      name: task.name,
      type: task.type,
      info: task.info,
      level: task.level,
      grade: task.grade,
      module: task.module,
      date: task.date
    };
    this.api.put(`/api/tasks/${task.id}`,
    {
      data:_task
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