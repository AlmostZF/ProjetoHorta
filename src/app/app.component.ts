
import { Component } from '@angular/core';
;
import { LoginComponent } from './pages/login/login.component';
import { InitialPageComponent } from './pages/initial-page/initial-page.component';

import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { SignUpComponent } from './pages/signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InitialPageComponent,LoginComponent,SignUpComponent,HeaderComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'projectStore';
}
