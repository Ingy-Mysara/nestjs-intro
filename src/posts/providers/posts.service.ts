import { Injectable } from '@nestjs/common';
import { UsersService } from './../../users/providers/users.service';

@Injectable()
export class PostsService {
  //injecting the UsersService into the PostsService
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        user: user,
        title: 'Post 1',
        content: 'This is post 1',
      },
      {
        user: user,
        title: 'Post 2',
        content: 'This is post 2',
      },
    ];
  }

  public createPost() {
    return 'You sent a POST request to posts endpoint';
  }
}
