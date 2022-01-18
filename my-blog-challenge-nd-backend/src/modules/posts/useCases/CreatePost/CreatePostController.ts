import { classToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { UsersRepository } from '../../../users/infra/typeorm/repositories/UsersRepository';
import { PostsRepository } from '../../infra/typeorm/repositories/PostsRepository';
import { CreatePostUseCase } from './CreatePostUseCase';

export class CreatePostController {
	async handle(request: Request, response: Response): Promise<void | Response> {
		const { userId, content, title, createdAt } = request.body;
		const postsRepository = new PostsRepository();
		const usersRepository = new UsersRepository();
		const createPostUseCase = new CreatePostUseCase(postsRepository, usersRepository);
		return response.json(classToPlain(await createPostUseCase.execute({
			userId, 
			content, 
			title,
			createdAt
		})));
	}
}