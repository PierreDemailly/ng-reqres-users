import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IUser } from './shared/interfaces/user';
import { UsersService } from './shared/services/users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form!: FormGroup;
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  page = 0;
  pageSize?: number;
  total?: number;
  totalPages?: number;

  constructor(private formBuilder: FormBuilder, private usersService: UsersService) {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      // https://gist.github.com/guillefd/dc50900569f289b7533ed7c752fc2174
      search: [null, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')],
    });
  }

  ngOnInit(): void {
    this.fetchUsers();

    this.form.get('search')!.valueChanges.subscribe((value: string) => {
      if (value.length < 3 || this.form.get('search')!.invalid) {
        this.filteredUsers = this.users;
        return;
      }

      this.filterUsers(value);
    });
  }

  fetchUsers(): void {
    this.usersService.find(this.page).subscribe(({data, page, per_page: pageSize, total, total_pages: totalPages}) => {
      this.users = this.users.concat(data);
      this.page = page;
      this.pageSize = pageSize;
      this.total = total;
      this.totalPages = totalPages;

      if (this.page < this.totalPages) {
        this.page++;
        this.fetchUsers();
      } else {
        this.filteredUsers = this.users;
      }
    });
  }

  filterUsers(filter: string): void {
    this.filteredUsers = [];

    for (const user of this.users) {
      const { first_name, last_name, email } = user;
      if (first_name.includes(filter) || last_name.includes(filter) || email.includes(filter)) {
        this.filteredUsers.push(user);
      }
    }
  }
}
