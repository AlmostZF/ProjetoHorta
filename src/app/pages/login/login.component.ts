import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';


//Prime NG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
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

  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage = '';

  constructor(
    private session: SessionService,
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
    this.session.login(this.loginForm.value).subscribe({
      next: (response) => {
        alert(response.message);
        this.router.navigate([""]);
      },
      error: (error) => {
        alert(error.error.message);
      }
    })
  }

  navigateToSignup(){
    this.router.navigate(["/signup"])
  }


}
