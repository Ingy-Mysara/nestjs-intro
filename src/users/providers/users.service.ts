import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from './../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
  //mimic a database call
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }
}
