import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { Storage } from '@ionic/storage';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {
  form: FormGroup;
  response: HttpResponse<any> = null;

  constructor(
    public storage: Storage,
    private authenticationService: AuthenticationService

  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      user: new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      })
    });
  }

  public async submit() {
   this.response = await this.authenticationService.login(this.form.value);
  }
}
