import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSignUp } from '../../models/session-model';
import { Router } from '@angular/router';

//Prime NG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    MessageModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule, 
  ],
  exportAs: 'app-singup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit{

  signForm: any = FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage = '';

  
  constructor(
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.signForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signUp(){
      const user: UserSignUp = {
        email: this.signForm.value.email,
        name: this.signForm.value.name,
        password: this.signForm.value.password
      }
      this.session.signUp(user).subscribe({
        next: (response) => {
          alert(response.data.message);
          this.router.navigate(["login"]);
        },
        error: (error) => {
          console.log(error.error.message)
          alert(error.message);
        }
      })
  }
  navigate(){
    this.router.navigate(["login"]);
  }
  ngOnInit(): void {
  }

  getFieldError(fieldName: string): string {
    const field = this.signForm.get(fieldName);
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
}
