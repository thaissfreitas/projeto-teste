import { AppError } from '../../../../shared/errors/AppError';
import { ICreatePostDTO } from '../../dtos/ICreatePostDTO';
import { IPost } from '../../entities/IPost';
import { IPostsRepository } from '../../repositories/IPostsRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';

export class CreatePostUseCase {
	constructor(
		private postsRepository: IPostsRepository,
		public usersRepository: IUsersRepository
	) { }

	async execute({userId, content, title}: ICreatePostDTO): Promise<IPost> {

		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new AppError('Usuário não encontrado', 403);
		}

		const dataSend = {userId: userId,content: content, title: title, createdAt: new Date() };
		const returnCreate = await this.postsRepository.create(dataSend);

		if(!returnCreate){
			throw new AppError('Erro ao Cadastrar Post', 403);
		}

		return returnCreate;
	
	}	
}