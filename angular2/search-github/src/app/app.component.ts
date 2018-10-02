import { Component } from '@angular/core';
import { UserService } from './user-services/user.service';

@Component({
  selector: 'app-root',
  template: '<git-user></git-user>',
  providers: [UserService]
})
export class AppComponent { }
