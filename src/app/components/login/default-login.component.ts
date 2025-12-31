import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Login } from '../../models/session-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-default-login',
  standalone: true,
  imports: [],
  templateUrl: './default-login.component.html',
  styleUrl: './default-login.component.scss'
})
export class DefaultLoginComponent {
  @Input() secundaryBtnText: string = 'Login';
  @Input() primaryBtnText: string = 'Restaurar';
  @Input() text: string = '';

  @Output("submit") onSubmit = new EventEmitter();
  @Output("navigate") onNavigate = new EventEmitter();


  submit(){
    this.onSubmit.emit();
  }

  navigate(){
    this.onNavigate.emit();
  }

}
