import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username?: string;
  password?: string;
  error?: string;

  logoPath: string = 'assets/images/logo.png';


  constructor(private authService: AuthService, private router: Router) {}


  login() {
    this.authService.login(this.username, this.password)
      .subscribe(
        (response) => {
          this.router.navigate(['']);
        },
        (error) => {
          // אם ההתחברות נכשלת, נציג הודעת שגיאה
          this.error = 'שם משתמש או סיסמא שגויים';
        }
      );
  }


}
