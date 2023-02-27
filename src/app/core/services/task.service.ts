import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { TaskModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private _tasksSubject:BehaviorSubject<TaskModel[]> = new BehaviorSubject<TaskModel[]>([]);
  public _tasks$ = this._tasksSubject.asObservable();
  momentjs:any = moment;
  
  constructor(private api:ApiService) { this.refresh(); }

   async refresh(){
    this.api.get(`/api/tasks/?populate=module`).subscribe({
      next:response=>{
        console.log(response);
        var array:TaskModel[] = (response.data as Array<any>).map<TaskModel>(data=>{
          return {
            id: data.id,
            name: data.attributes.name,
            type: data.attributes.type,
            info: data.attributes.info,       
            module: data.attributes.module.data?.attributes.acronym,
            //grade: data.attributes.module.data?.attributes.grade.data?.attributes.acronym,  
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
      this.api.get(`/api/tasks/${id}?populate=module`).subscribe({
        next:data=>{
          resolve({
            id: data.id,
            name: data.data.attributes.name,
            type: data.data.attributes.type,
            info: data.data.attributes.info,        
            module: data.data.attributes.module.data?.data.attributes.acronym,  
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
    this.api.post(`/api/tasks/?populate=module`,{
      data:{
      name: task.name,
      type: task.type,
      info: task.info,
      module: task.module,
      date: task.date
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

  async updateTask(task: TaskModel){
    this.api.put(`/api/tasks/${task.id}`,{
      data:{
      name: task.name,
      type: task.type,
      info: task.info,
      module: task.module,
      date: task.date
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