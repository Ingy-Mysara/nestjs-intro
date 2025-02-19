import { Body, Injectable } from '@nestjs/common';
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
    // find the Tags
    let tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

    // find the Posts
    let post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

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

    // save the post and return
    return await this.postsRepository.save(post);
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
