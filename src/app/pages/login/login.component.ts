import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 

//Prime NG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

// Service
import { SessionService } from '../../service/session.service';
import { AuthService } from '../../service/auth.service';
import { LoadingService } from '../../service/loading.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CardModule,
    MessageModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule, 
  ],
  exportAs: 'app-Login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Froms
  loginForm: FormGroup;

  // Message
  errorMessage = '';

  // Controle de interface
  showPassword: boolean = false;

  constructor(
    private session: SessionService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private fb: FormBuilder,
    
  ) {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Senha'
    };
    return labels[fieldName] || fieldName;
  }

  ngOnInit(): void {
  }

  login(){
    this.loadingService.show();
    this.authService.loginSeller(this.loginForm.value).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.loadingService.hide();
        alert(error.error.message);
      }
    })
  }

  navigateToSignup(){
    this.router.navigate(["/signup"])
  }


}
