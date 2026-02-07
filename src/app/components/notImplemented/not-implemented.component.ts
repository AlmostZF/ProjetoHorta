import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Login } from '../../models/session-model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-implemented',
  standalone: true,
  imports: [],
  templateUrl: './not-implemented.component.html',
  styleUrl: './not-implemented.component.scss'
})
export class NotImplementedComponent {

  constructor(private router: Router) {
  }

  navigate(route:string){
    this.router.navigate([route]);
  }
}
