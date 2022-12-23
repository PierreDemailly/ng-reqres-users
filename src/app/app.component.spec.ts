import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { UsersService } from './shared/services/users/users.service';
import { IPaginatedResult } from './shared/interfaces/paginated-result';
import { IUser } from './shared/interfaces/user';
import { of } from 'rxjs';

const mockUsers: IUser[] = [{
  id: 1,
  first_name: 'john',
  last_name: 'doe',
  email: 'john@doe.com',
  avatar: 'john_doe_avatar',
}];
const mockResult: IPaginatedResult<IUser> = {
  page: 1,
  per_page: 1,
  total: 1,
  total_pages: 1,
  data: mockUsers,
}
const mockUsersService = {
  find: () => of(mockResult),
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: UsersService, useValue: mockUsersService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('form should be builded', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.form.get('search')).toBeTruthy();
  });

  it('search should be valid by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.form.get('search')!.valid).toBeTruthy();
  });

  it('search form should be valid with letters and numbers', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.form.get('search')!.setValue('lorem');
    expect(app.form.get('search')!.valid).toBeTruthy();

    app.form.get('search')!.setValue(123);
    expect(app.form.get('search')!.valid).toBeTruthy();

    app.form.get('search')!.setValue('lorem 123');
    expect(app.form.get('search')!.valid).toBeTruthy();
  });

  it('search form should be invalid with special caracters', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.form.get('search')!.setValue('lorem -');
    expect(app.form.get('search')!.invalid).toBeTruthy();

    app.form.get('search')!.setValue('lorem $$');
    expect(app.form.get('search')!.invalid).toBeTruthy();

    app.form.get('search')!.setValue('^^ :)');
    expect(app.form.get('search')!.invalid).toBeTruthy();
  });

  it('should fetch users', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.fetchUsers();
    expect(app.users).toEqual(mockUsers)
  });

  it('should filter users', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.fetchUsers();

    app.filterUsers('');
    expect(app.filteredUsers[0].id).toBe(1);

    app.filterUsers('john');
    expect(app.filteredUsers[0].id).toBe(1);

    app.filterUsers('doe');
    expect(app.filteredUsers[0].id).toBe(1);

    app.filterUsers('john@doe');
    expect(app.filteredUsers[0].id).toBe(1);
  });

  it('should not find user', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.fetchUsers();

    app.filterUsers('eminem');
    expect(app.filteredUsers.length).toBe(0);
  });
});
