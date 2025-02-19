import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
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
    let existingUser = undefined;

    // interacting with database and having a model constraints
    try {
      // check if user already exists  with the same email
      existingUser = await this.usersRepository.findOne({
        where: { email: createPostDto.email },
      });
    } catch (error) {
      console.log(error);

      //might save the details of the exception in the database
      throw new RequestTimeoutException(
        'unable to process your request at the moment, please try later',
        {
          description: 'error connecting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email',
      );
    }

    let newUser = this.usersRepository.create(createPostDto);
    try {
      newUser = await this.usersRepository.save(newUser); // save user to database
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'unable to process your request at the moment, please try later',
        {
          description: 'error connecting to the database',
        },
      );
    }
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
    // console.log(this.profileConfiguration);
    // console.log(this.profileConfiguration.apiKey);

    /**
     * Custom Exception
     */
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'occurred because the API endpoint has moved permanently',
      },
    );
  }

  /**
   * find a single user using id of the user
   */
  public async findOneById(id: number) {
    let user = undefined;

    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      /**
       * cannot connect to database
       */
      throw new RequestTimeoutException(
        'unable to process your request at the moment, please try later',
        {
          description: 'error connecting to the database',
        },
      );
    }

    /**
     * Handle user does not exist exception
     */
    if (!user) {
      throw new BadRequestException('The user ID does not exist');
    }

    return user;
  }
}
