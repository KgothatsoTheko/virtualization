import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  DOB!:string;
  ID:any;
  Date:any;
  year!: any;
  month!: string;
  day!: string;
  gender:any;
  age:any;
  citizen:any;
  isUpdate: boolean = false;
  qrCodeData: string = '';
  codes:string[] = ['A', 'A1', 'B', 'C1', 'C', 'EB', 'EC1', 'EC']
  registerForm: FormGroup
  disableSelect = new FormControl(false);

  constructor(private api: ApiService){
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      ID: new FormControl('', [Validators.required]),
      DOB: new FormControl('',[Validators.required]),
      citizenship: new FormControl('',[Validators.required]),
      gender: new FormControl('',Validators.required),
    })
    this.Date = new Date().getFullYear()
  }

  ngOnInit() {
    this.year = 'YY';
    this.month = 'MM';
    this.day = 'DD';
    this.registerForm.reset()
    sessionStorage.clear()
  }
  
  

  IdValid() {

    this.DOB = this.registerForm.controls['ID'].value.toString(); 
    let date = ''
   if(this.DOB.slice(0,1) === '0') {
    date = '20'
   } else {
    date = '19'
   }
   console.log(this.DOB);
   this.year = date + this.DOB.slice(0, 2);
   console.log(this.year)
   this.month = this.DOB.slice(2, 4);
   this.day = this.DOB.slice(4, 6);
  
   this.citizenship()
   this.genders()
  //  this.age = this.ageCalc()
  
   this.registerForm.patchValue({
     DOB: this.year + this.month + this.day,
    //  age: this.age,
     gender: this.gender,
     citizenship: this.citizen
   });
  }
  
  
  genders(){
    this.gender;
    if (parseInt(this.DOB.charAt(6), 10) >= 5) {
      this.gender = "Male";
    } else {
      this.gender = 'Female';
    }
  }
  
  citizenship(){
    let C = this.DOB.slice(10, 11);
    this.citizen;
    if (C === "0") {
      this.citizen = "RSA";
    } else {
      this.citizen = "not South African";
    }
  }
  
  // ageCalc(){
  //      let answer =  new Date().getFullYear() - this.year
  //      return answer
  // }

  cancel(){
    this.registerForm.reset()
  }

  submit() {
      
      this.api.genericPost('/register', this.registerForm.value).subscribe({
        next: (res: any) => {
          console.log("response", res);
        },
        error: (err: any) => console.log("error", err),
        complete: () => { console.log("Request complete") }
      });
    

  }
  
  
}
