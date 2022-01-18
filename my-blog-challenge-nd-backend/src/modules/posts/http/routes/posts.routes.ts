import { Router } from 'express';
import { ensureAuthenticated } from '../../../../shared/http/middlewares/ensureAuthenticated';
import { upload } from '../../../../shared/http/middlewares/upload';

import { DeletePostController } from '../../useCases/DeletePost/DeletePostController';
import { GetAllPostsController } from '../../useCases/GetAllPosts/GetAllPostsController';
import { GetPostByIdController } from '../../useCases/GetPostById/GetPostByIdController';
import { UpdatePostController } from '../../useCases/UpdatePost/UpdatePostController';
import { UpdatePostImageController } from '../../useCases/UpdatePostImage/UpdatePostImageController';
import { CreatePostController } from '../../useCases/CreatePost/CreatePostController';

const postsRouter = Router();

postsRouter.use(ensureAuthenticated);

postsRouter.get('/', (new GetAllPostsController()).handle);

postsRouter.get('/:id', (new GetPostByIdController()).handle);

 postsRouter.post('/', (new CreatePostController()).handle);

postsRouter.put('/:id', (new UpdatePostController()).handle);

postsRouter.patch('/:id/updateImg', upload.single('image'), (new UpdatePostImageController()).handle);

postsRouter.delete('/:id', (new DeletePostController()).handle);

/* Rotas de criação/ listagem/ update/remoção de postagens e atualização de imagem
de perfil/postagens devem ser implementadas de forma privada sendo acessíveis
somente através de passagem de token de autenticação no header Authorization da
requisição. */



export { postsRouter };