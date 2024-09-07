import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Render,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from '@prisma/client';
import { Response } from 'express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @Render('posts/index')
  async getPosts(): Promise<{ posts: PostModel[] }> {
    const posts = await this.postService.posts({});
    return {
      posts,
    };
  }

  @Post()
  async create(
    @Body() postData: { title: string; content?: string },
    @Res() res: Response,
  ): Promise<void> {
    const { title, content } = postData;
    await this.postService.createPost({
      title,
      content,
    });
    return res.redirect('/posts');
  }

  @Get('new')
  @Render('posts/new')
  async new(): Promise<void> {}

  @Get(':id')
  @Render('posts/show')
  async getPostById(@Param('id') id: string): Promise<{ post: PostModel }> {
    const post = await this.postService.post({ id: Number(id) });
    return {
      post,
    };
  }
}
