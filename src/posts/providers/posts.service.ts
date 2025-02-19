import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { TagsService } from './../../tags/providers/tags.service';
import { UsersService } from './../../users/providers/users.service';
import { PatchPostDto } from './../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  //injecting the UsersService into the PostsService
  constructor(
    /**
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Inject postsRepository
     */

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,

    /**
     * Inject TagsService
     */
    private readonly tagsService: TagsService,
  ) {}

  public async findAll(userId: string) {
    // const user = this.usersService.findOneById(userId);
    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        tags: true,
      },
    });
    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags = undefined;
    let post = undefined;

    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
      );
    }
    /**
     * Number of tags sent needs to be equal to the number of tags returned
     */
    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException('Please check your tag IDs');
    }

    try {
      // find the Tags
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
      );
    }

    if (!post) {
      throw new BadRequestException('Post ID does not exist');
    }

    // update the properties
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDto.publishedOn ?? post.publishedOn;

    // assign the new tags
    post.tags = tags;

    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
      );
    }
    // save the post and return
    return post;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    // find author from database based on authorId
    let author = await this.usersService.findOneById(createPostDto.authorId);

    // find tags
    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    // Create Post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    // deleting the Post
    await this.postsRepository.delete(id);

    // Confirmation
    return { deleted: true, id };
  }
}
