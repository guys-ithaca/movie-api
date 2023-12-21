import { MovieUpdateInput } from './MovieUpdateInput';
import { MovieWhereUniqueInput } from './MovieWhereUniqueInput';

class UpdateMovieArgs {
  where!: MovieWhereUniqueInput;
  data!: MovieUpdateInput;
}

export { UpdateMovieArgs };
