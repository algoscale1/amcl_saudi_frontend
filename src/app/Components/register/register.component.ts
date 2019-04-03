import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { RegisterService } from 'src/app/Services/register.service';
import { ErrorComponent } from '../log-in/error/error.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  profileImg: File;

  constructor(private router: Router, private snackBar: MatSnackBar, private registerService: RegisterService) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
      cPassword: new FormControl('', Validators.required),
      profileImg: new FormControl('')
    });
  }

  ngOnInit() {
  }

  newProfile(event) {

    this.profileImg = event.target.files[0];
  };

  onRegister() {

    let data = new FormData();
    data.append('name', this.registerForm.controls['name'].value);
    data.append('email', this.registerForm.controls['email'].value);
    data.append('phone', this.registerForm.controls['phone'].value);
    data.append('password', this.registerForm.controls['password'].value);
    data.append('profileImage', this.profileImg);

    if (this.registerForm.controls['password'].value == this.registerForm.controls['cPassword'].value) {
      this.registerService.register(data).subscribe(
        res => {
          this.router.navigate(['/logIn']);
        },
        err => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: 2000,
            data: err.message
          });
        }
      );
    }
    else {
      this.snackBar.openFromComponent(ErrorComponent, {
        duration: 2000,
        data: "Your Password didn't match Confirm Password"
      });
    }

  };

}
