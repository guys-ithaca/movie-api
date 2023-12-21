import { map } from 'lodash';
import { Neo4jService } from '../../core/graphdb/neo4j.service';
import {
  CreateMovieArgs,
  CreatePerson,
  DeleteMovieArgs,
  Movie,
  MovieFindManyArgs,
  MovieFindUniqueArgs,
  Person,
  Recommendation,
  UpdateMovieArgs,
} from 'src/model/movie';
import { CreateManyMovieArgs } from 'src/model/movie/CreateManyMovieArgs';
import { BadRequestException, Logger } from '@nestjs/common';
import _ from 'lodash';
import { EnumPersonRelationType } from 'src/model/common/EnumPersonRelationType';

export class MovieService {
  private readonly logger = new Logger(MovieService.name);
  constructor(private readonly neo4jService: Neo4jService) {
    console.log('neo4j = ' + this.neo4jService);
  }

  async findMany(args: MovieFindManyArgs): Promise<Movie[]> {
    console.log('fine many movie args = ' + JSON.stringify(args, null, 2));
    return [];
  }
  async findOne(args: MovieFindUniqueArgs): Promise<Movie | null> {
    console.log('fine one movie args = ' + JSON.stringify(args, null, 2));
    return null;
  }
  async create(args: CreateMovieArgs): Promise<Movie> {
    this.logger.log({ function: 'MovieService::create', args });

    const movie = args?.data;

    try {
      const movieId = movie.title.replace(' ', '');
      const movieNode = await this.neo4jService.write(
        `CREATE (${movieId}:Movie {title:'${movie.title}', released:${movie.release}, tagline:'${movie.tagLine}'})`,
      );
      this.logger.log({ function: 'MovieService::create', movieId, movieNode });
      const movieRelated = await Promise.all([
        await this.createMovieRelations(
          movieId,
          movie.actors,
          EnumPersonRelationType.Actor,
        ),
        await this.createMovieRelations(
          movieId,
          movie.actors,
          EnumPersonRelationType.Actor,
        ),
      ]);

      this.logger.log({
        function: 'MovieService::create',
        movieId,
        movieRelated,
      });
    } catch (error) {
      this.logger.error({
        function: 'MovieService::create',
        message: error.message,
        args,
      });
    }

    return null;
  }
  async createMany(args: CreateManyMovieArgs): Promise<Movie[]> {
    this.logger.log({ function: 'MovieService::createMany', args });

    const promises = map(args.data, (movie) => this.create({ data: movie }));
    const movies = await Promise.all(promises);

    console.log('created movies results = ' + JSON.stringify(movies, null, 2));
    return movies;
  }

  async update(args: UpdateMovieArgs): Promise<Movie> {
    this.logger.log({ function: 'MovieService::update', args });
    return null;
  }

  async review(args: UpdateMovieArgs): Promise<Movie> {
    this.logger.log({ function: 'MovieService::review', args });

    if (!args.data?.review) {
      throw new BadRequestException('Reviewer is missing');
    }
    const isValidId = await this.isValidFacebookId(
      args.data?.review.reviewBy.id,
    );

    if (!isValidId) {
      throw new BadRequestException('Reviewer facebook id is not valid');
    }

    //Relate Review by Person to a Movie
    const movie = await this.neo4jService.read(
      `MATCH (n:Movie{title: '${args.where.id}'}) RETURN n LIMIT 1 `,
    );

    if (!movie) {
      throw new BadRequestException('Movie is missing');
    }

    const reviewer = await this.neo4jService.read(
      `MATCH (n:Person{name: '${args.data?.review.reviewBy.id}'}) RETURN n LIMIT 1 `,
    );

    if (!reviewer) {
      //create person reviewer

      return null;
    } else if (reviewer.records[0].get('reviewCounter') < 3) {
      await this.neo4jService.write(`MATCH (p:Person {name: '${
        args.data?.review.reviewBy.id
      }'})
      SET p.reviewCounter = ${reviewer.records[0].get('reviewCounter') + 1}
      RETURN p`);
    }

    //set relation between movie and review
    await this.createMovieRelations(
      movie.records[0].get('id'),
      [args.data?.review.reviewBy],
      EnumPersonRelationType.Reviewer,
    );

    //if review is greater then 70 ->
    if (args.data?.review.rating > 70) {
      const actors = await this.neo4jService.read(
        `MATCH (:Actor )-[rel:${
          EnumPersonRelationType.Actor
        }]-(:Movie{name: '${movie.records[0].get('id')}'})
        RETURN rel`,
      );
      const directors = await this.neo4jService.read(
        `MATCH (:Director )-[rel:${
          EnumPersonRelationType.Actor
        }]-(:Movie{name: '${movie.records[0].get('id')}'})
        RETURN rel`,
      );

      const relatedLikeCommands = [];
      //set relation like between reviewer to each movie actor (Like)
      _.map(actors.records, (actor) => {
        const relatedLikeCommandText = `(${reviewer.records[0].get('id')})-[:${
          EnumPersonRelationType.Like
        }]->(${actor.get('id')})`;
        relatedLikeCommands.push(relatedLikeCommandText);
      });

      //set relation like between reviewer to each movie director (Like)
      _.map(directors.records, (director) => {
        const relatedLikeCommandText = `(${reviewer.records[0].get('id')})-[:${
          EnumPersonRelationType.Like
        }]->(${director.get('id')})`;
        relatedLikeCommands.push(relatedLikeCommandText);
      });

      //Create like relationships
      await this.neo4jService.write(`Create ${relatedLikeCommands.join(',')}`);
    }

    return null;
  }
  async recommendationByPersonId(
    args: MovieFindManyArgs,
  ): Promise<Recommendation> {
    this.logger.log({ function: 'MovieService::review', args });

    if (!args.where?.recommendationByPersonId) {
      throw new BadRequestException('person id is missing');
    }

    const reviewer = await this.neo4jService.read(
      `MATCH (n:Person{name: '${args.where.recommendationByPersonId}'}) RETURN n LIMIT 1 `,
    );

    if (!reviewer) {
      throw new BadRequestException('Person is missing');
    }
    const recommendation = new Recommendation();
    recommendation.connections = [];
    recommendation.movies = [];
    await this.neo4jService.write(`MATCH (p:Person {name: '${
      args.where.recommendationByPersonId
    }'})
    SET p.reviewCounter = ${reviewer.records[0].get('reviewCounter') + 1}
    RETURN p`);

    //if person does not have 3 reviews return empty recommendations
    if (reviewer.records[0].get('reviewCounter') + 1 < 3) {
      return recommendation;
    }

    //Get the person reviewed movies
    //Relate Review by Person to a Movie
    const movies = await this.neo4jService.read(
      `MATCH (:Movie )-[rel:${EnumPersonRelationType.Reviewer} {rating > 70}]-(:Person{name: '${args.where.recommendationByPersonId}'})
      RETURN rel`,
    );
    if (!movies) {
      throw new BadRequestException('Movie is missing');
    }

    const likeActors = await this.neo4jService.read(
      `MATCH (:Actor )-[rel:${EnumPersonRelationType.Like}]-(:Person{name: '${args.where.recommendationByPersonId}'})
      RETURN rel`,
    );

    //else
    //get other optional connections

    //get other persons related by like relationship to actors that the person likes
    const otherPersonLikeMyFavoriteActor = _.map(
      likeActors.records,
      (actor) => {
        //get other persons related by like relationship to director that the person likes
        const p = new Person();
        return p;
      },
    );
    recommendation.connections.push(...otherPersonLikeMyFavoriteActor);
    //finally: add the persons to recommendation.connections

    //get the optional movies
    //get other persons related by like relationship to actors - get the actor movies
    //get other persons related by like relationship to director - get the director movies

    return recommendation;
  }
  async myTestConnectionsByPersonId(
    args: MovieFindManyArgs,
  ): Promise<Recommendation> {
    this.logger.log({ function: 'MovieService::review', args });

    if (!args.where?.recommendationByPersonId) {
      throw new BadRequestException('person id is missing');
    }

    //Relate Review by Person to a Movie
    const movie = `MATCH (n:Movie{title: '${args.where.id}'}) RETURN n LIMIT 1 `;
    if (!movie) {
      throw new BadRequestException('Movie is missing');
    }

    const reviewer = `MATCH (n:Person{name: '${args.where.recommendationByPersonId}'}) RETURN n LIMIT 1 `;
    if (!reviewer) {
      throw new BadRequestException('Person is missing');
    }
    const recommendation = new Recommendation();
    recommendation.connections = [];
    recommendation.movies = [];
    //if person does not have 3 reviews return empty recommendations
    //return recommendation

    //else
    //get all person review all movie the given person reviewed with same score

    return recommendation;
  }
  async delete(args: DeleteMovieArgs): Promise<Movie> {
    console.log('delete movie args = ' + JSON.stringify(args, null, 2));
    return null;
  }

  async createMovieRelations(
    movieId: string,
    persons: CreatePerson[],
    relationToMovieType: EnumPersonRelationType,
  ) {
    const relationCommand: string[] = [];

    const nodes = _.map(persons, async (person) => {
      const actorId = person.name.replace(' ', '');
      const actorNode = await this.neo4jService.write(
        `CREATE (${actorId}:Person {name:'${person.name}', born:${person.born}, type: '${relationToMovieType}'})`,
      );
      this.logger.log({ function: 'MovieService::create', actorNode });
      const relatedActorCommand = `(${actorId})-[:${relationToMovieType} {roles:['${'staticRole'}']}]->(${movieId})`;
      relationCommand.push(relatedActorCommand);

      this.logger.log({
        function: 'MovieService::create',
        relationCommand,
      });

      return actorNode;
    });

    this.logger.log({
      function: 'MovieService::create',
      actorNodes: nodes,
    });

    //create the actors relationship
    const personToMovieNodes = await this.neo4jService.write(
      `CREATE ${relationCommand.join(',')}`,
    );

    this.logger.log({
      function: 'MovieService::create',
      personToMovieNodes,
    });
  }
  async isValidFacebookId(id: string) {
    return true;
  }
}
