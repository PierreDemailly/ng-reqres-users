import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IPaginatedResult } from '../../interfaces/paginated-result';
import { IUser } from '../../interfaces/user';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockUsers: IUser[] = [{
      id: 1,
      first_name: 'john',
      last_name: 'doe',
      email: 'john@doe.com',
      avatar: 'john_doe_avatar',
    }];
    const mockResult: IPaginatedResult<IUser> = {
      page: 1,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: mockUsers,
    }

    service.find(2).subscribe((result) => {
      expect(result).toEqual(mockResult);
    });

    const req = httpTestingController.expectOne('https://reqres.in/api/users?page=2');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResult);
  });
});
