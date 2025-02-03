// import { PartialType } from '@nestjs/mapped-types';
// PartialType is imported from swagger instead of mapped-types so that the swagger documentation can be generated for all the properties of the DTO
// All properties are optional in the PatchPostDto

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The id of the post that needs to be updated',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
