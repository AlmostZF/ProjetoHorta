import { Component, OnInit, ChangeDetectorRef,  } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SellerSignUp } from '../../models/session-model';
import { ToastService } from '../../service/toast.service';
import { MessageService } from 'primeng/api';
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
  errorMessage: string = '' ;

  
  constructor(
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.signForm = this.fb.group({
      name: ['Guyilherm', [Validators.required, Validators.minLength(3)]],
      email: ['guilherme.vasconcelos7@Gmail.com', [Validators.required, Validators.email]],
      password: ['Senha2123**', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['Senha2123**', [Validators.required, Validators.minLength(8)]],
    });
  }

  signUp(){
      const user = this.createSignPayload(this.signForm);
      console.log(user)
      this.session.signUpSeller(user).subscribe({
        next: (response) => {
          this.showConfirm('Reserva realizada com sucesso!', "#93c732");
          this.router.navigate(["login"]);
        },
        error: (error) => {
          this.showConfirm(`Ocorreu um erro, verifique os dados e tente novamente mais tarde`, "#d32f2f");
        }
      })
  }

    
  showConfirm(message: string, severity?: string): void {

    this.toastService.show(
      {
        message: message,
        icon: 'pi pi-bell',
        color: severity
      }
    )

    this.messageService.add({
        key: 'confirm',
        severity: 'custom',
        summary: message,
        styleClass: 'bg-white rounded-2xl',
        life: 2000
    });
    this.cdr.detectChanges();
  }

  validateSignup(){
    
    if(this.signForm.invalid){
      this.signForm.markAllAsTouched();
      return; 
    }
    
    this.signUp();
  }

  verifyPassword():boolean{

    if(this.signForm.value.password != this.signForm.value.confirmPassword){
      this.errorMessage = 'Senhas precisam serem iguais';
      return true; 
    }

    const password = this.signForm.value.password;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

    if (!regex.test(password)) {
      this.errorMessage = "Senha fraca: use maiúsculas, minúsculas e símbolos.";
      return true;
    }
    
    this.errorMessage = "";
    return false
  }

  createSignPayload(signForm: FormGroup):SellerSignUp{
    return {
        email: signForm.value.email,
        name: signForm.value.name,
        password: signForm.value.password,
        phoneNumber:''
      }
  }

  navigate(route: string){
    this.router.navigate([route]);
  }

  ngOnInit(): void {
  }

  getFieldError(fieldName: string): string {
    const field = this.signForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return 'Mínimo de 8 caracteres';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Senha',
      name: 'nome',
      confirmPassword: 'confirmação de senha'
    };
    return labels[fieldName] || fieldName;
  }
}
