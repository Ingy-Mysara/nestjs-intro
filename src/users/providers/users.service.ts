import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { GetUsersParamDto } from './../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * Method to get all users data from database
   */
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

  /**
   * find a single user using id of the user
   */
  public findOneById(id: string) {
    return { id: 1234, firstName: 'Alice', email: 'alice@doe.com' };
  }
}
