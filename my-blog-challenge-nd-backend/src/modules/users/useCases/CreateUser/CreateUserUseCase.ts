import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { IUser } from '../../entities/IUser';
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';

export class CreateUserUseCase {
	constructor(
		private usersRepository: IUsersRepository,
		private hashProvider: IHashProvider
	) { }

	async execute({ email, password, name }: ICreateUserDTO): Promise<IUser> {
		// TODO: Criar usuário, atente ao fato que dois usuários não podem possuir o mesmo email - ok
		// TODO: HashProvider pode ser utilizado para criptografia da senha - ok
		const user = await this.usersRepository.findByEmail(email);

		if (user) {
			throw new AppError('Email já Cadastrado', 403);
		}

		const pass = await this.hashProvider.hash(password);
		const dataSend = {email: email, password: pass, name: name };
		const returnCreate = await this.usersRepository.create(dataSend);

		if(!returnCreate){
			throw new AppError('Erro ao Cadastrar Usuário', 403);
		}

		return returnCreate
	}	
}