import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { integerValidator, NoWhitespaceDirective, passwordMatchValidator, passwordMismatchValidator, strongPasswordValidator } from '../../helper/validators';
import { ValidationErrorService } from '../../services/validation-error.service';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-log-in',
  imports: [],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  constructor(private toastr: NzMessageService) {

  }


}
