import { MovieWhereUniqueInput } from './MovieWhereUniqueInput';
import { MovieUpdateInput } from './MovieUpdateInput';

class UpdateMovieArgs {
  where!: MovieWhereUniqueInput;
  data!: MovieUpdateInput;
}

export { UpdateMovieArgs };
