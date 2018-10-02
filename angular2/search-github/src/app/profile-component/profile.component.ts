import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-services/user.service';

@Component({
  selector: 'git-user',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{
  userData: any;
  repoData: any[];
  username: string;

  constructor(private userService: UserService) {
    this.userData = false;
}

searchUser(){
  this.userService.updateUser(this.username);

  this.userService.getUserData()
      .subscribe(
        users => {
          this.userData = users;
          console.log(users);
        }
      );

      this.userService.getRepoData()
          .subscribe(
            repos => {
              this.repoData = repos;
              console.log(repos);
            }
          );
}

}
