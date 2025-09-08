import { Component, EventEmitter, Input, Output, forwardRef,  } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule,  } from '@angular/forms';

type InputType = 'text' | 'password' | 'email' | 'number';

@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ],
  templateUrl: './primary-input.component.html',
  styleUrl: './primary-input.component.scss'
})
export class PrimaryInputComponent implements ControlValueAccessor {

  @Input() type: InputType = "text";
  @Input() placeholder: string = "";
  @Input() inputName: string = "";
  @Input() label: string = "";
  @Input() scrIcon: string = "";
  @Input() scrIconChange: string = "";
  @Input() altIcon: string = "";
  @Output() iconClick = new EventEmitter();
  @Input() showPassword: boolean = false;

  value: string = "";


  onChange: any = () => {};
  onTouch: any = () => {};

  onInput(event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
    // this.onTouch();
  }

  togglePasswordVisibility(){
    this.iconClick.emit(this.showPassword);
  }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {

  }



}
