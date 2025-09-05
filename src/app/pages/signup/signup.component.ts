import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../service/session.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DefaultLoginComponent } from '../../components/login/default-login.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { UserSignUp } from '../../models/session-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [
    FormsModule, DefaultLoginComponent, ReactiveFormsModule,
    PrimaryInputComponent ],
  exportAs: 'app-singup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignUpComponent implements OnInit{

  signForm: any = FormGroup;
  srcIcon: string = "../../../assets/icons/eye.svg";
  srcIconConfirmPassword: string = "../../../assets/icons/eye.svg";
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    private session: SessionService,
    private router: Router
  ) {
    this.signForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
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


  togglePasswordVisibility(showPassword: boolean, tipo: number) {
    if (tipo == 0) {
      this.showPassword = !showPassword;
      this.srcIcon = !showPassword ? "../../../assets/icons/eye-slash.svg" : "../../../assets/icons/eye.svg";
    } else {
      this.showConfirmPassword = !showPassword;
      this.srcIcon = !showPassword ? "../../../assets/icons/eye-slash.svg" : "../../../assets/icons/eye.svg";
    }
  }

}
