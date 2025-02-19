import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import profileConfig from '../config/profile.config';
import { User } from '../user.entity';
import { CreatePostDto } from './../../../documentation/js/search/search_index';
import { GetUsersParamDto } from './../dtos/get-users-param.dto';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting usersRepository to perform database operations
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /**
     * Injecting ConfigService
     */
    // private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // check if user already exists  with the same email
    const existingUser = await this.usersRepository.findOne({
      where: { email: createPostDto.email },
    });
    // Handle exception

    // create new user
    let newUser = this.usersRepository.create(createPostDto);
    newUser = await this.usersRepository.save(newUser); // save user to database
    return newUser;
  }

  /**
   * Method to get all users data from database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // const environment = this.configService.get<string>('S3_BUCKET');
    // console.log(environment);

    // console.log(process.env.NODE_ENV);

    //test the new Config
    console.log(this.profileConfiguration);
    console.log(this.profileConfiguration.apiKey);

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
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}
