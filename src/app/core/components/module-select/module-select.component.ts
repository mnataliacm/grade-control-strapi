import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { ModuleService } from '../../services/module.service';


export const MODULE_PROFILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ModuleSelectComponent),
  multi: true
};

@Component({
  selector: 'app-module-select',
  templateUrl: './module-select.component.html',
  styleUrls: ['./module-select.component.scss'],
  providers: [MODULE_PROFILE_VALUE_ACCESSOR]
})
export class ModuleSelectComponent implements ControlValueAccessor {

  selectItem: any;
  propagateChange = (_: any) => { }
  isDisabled: boolean = false;

  constructor(private moduleSvc: ModuleService) { }

  async writeValue(obj: any) {
    try {
      this.selectItem = await this.moduleSvc.getModuleById(obj);
    } catch (error) {
      console.log("No se ha podido recupera los datos: " + error);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  getModules() {
    return this.moduleSvc.modules$;
  }

  onItemClicked(moduleId: any, accordion: IonAccordionGroup) {
    this.selectItem = moduleId;
    accordion.value = '';
    this.propagateChange(this.selectItem);
  }
}
