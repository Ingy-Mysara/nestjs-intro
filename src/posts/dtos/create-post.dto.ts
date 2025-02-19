import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { postStatus } from '../enums/postStatus.enum';
import { postType } from '../enums/postType.enum';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My first post',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'Possible Values: post, page, story, series',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description:
      'A slug is a part of a URL that identifies a particular page on a website in an easy to read form. For example, "my-url"',
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: 'Possible Values: draft, scheduled, review, published',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'The content of the post',
    example: 'This is my first post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object, else a validation error will be thrown',
    example:
      '{\r\n \"@context\": \"https:\/\/schema.org\",\r\n \"@type\": \"Person\"\r\n}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string; // JSON string

  @ApiPropertyOptional({
    description: 'The URL of the featured image',
    example: 'http://localhost.com/images/image1.jpg',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The date the post was published',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601() // ISO 8601 date format
  @IsOptional()
  publishedOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of IDs of tags',
    example: '[1, 2]',
  })
  @IsInt({ each: true }) // each: true means that each item in the array should be a string
  @IsArray()
  @IsOptional()
  tags?: number[];

  @ApiPropertyOptional({
    type: 'object',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'string',
          description: 'The metaValue is a JSON string',
          example: '{"sidebarEnabled": true}',
        },
      },
    },
  }) // metadata options is not required, but objects inside the array are required
  @IsOptional()
  // Nested validation
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  // this type decorator does two things.
  // First, it matches the incoming request to this particular DTO over here and creates an instance of this particular DTO whenever an incoming request comes in.
  // Secondly, all the properties of the objects are validated against the create post meta options DTO.
  // So the incoming object should contain all these properties, and it should match all the validations
  metaOptions?: CreatePostMetaOptionsDto | null;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    type: 'integer',
    required: true,
    example: 1,
  })
  authorId: number;
}
