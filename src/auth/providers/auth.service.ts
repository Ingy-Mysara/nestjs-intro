import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from './../../users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    //to avoid circular dependency
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public login(email: string, password: string, id: string): string {
    // const user = this.usersService.findOneById('1234');
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
