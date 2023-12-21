import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { ApiNestedQuery } from '../../core/decoders/api-nested-query.decorator';
import { MovieService } from './movie.service';
import { MovieCreateInput, Recommendation } from '../../model/movie';
import { MovieWhereUniqueInput } from '../../model/movie';
import { MovieFindManyArgs } from '../../model/movie';
import { MovieUpdateInput } from '../../model/movie';
import { Movie } from '../../model/movie';
import { CreateManyMovieArgs } from '../../model/movie/CreateManyMovieArgs';

@swagger.ApiTags('movies')
@common.Controller('movies')
export class MovieController {
  constructor(protected readonly service: MovieService) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: Movie })
  @swagger.ApiForbiddenResponse({ type: common.ForbiddenException })
  async create(@common.Body() data: MovieCreateInput): Promise<Movie> {
    return await this.service.create({ data });
  }

  @common.Post('/createMany')
  @swagger.ApiCreatedResponse({ type: [Movie] })
  @swagger.ApiForbiddenResponse({ type: common.ForbiddenException })
  async createMany(@common.Body() args: CreateManyMovieArgs): Promise<Movie[]> {
    return await this.service.createMany(args);
  }

  @common.Get('/recommendation')
  @swagger.ApiOkResponse({ type: Recommendation })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(MovieFindManyArgs)
  async recommendationByPersonId(
    @common.Req() request: Request,
  ): Promise<Recommendation> {
    const args = plainToClass(MovieFindManyArgs, request.query);
    return this.service.recommendationByPersonId(args);
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [Movie] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(MovieFindManyArgs)
  async findMany(@common.Req() request: Request): Promise<Movie[]> {
    const args = plainToClass(MovieFindManyArgs, request.query);
    return this.service.findMany(args);
  }

  @common.Get('/:id')
  @swagger.ApiOkResponse({ type: Movie })
  @swagger.ApiNotFoundResponse({ type: common.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: common.ForbiddenException })
  async findOne(@common.Param() params: MovieWhereUniqueInput): Promise<Movie> {
    console.log('fine one = ' + JSON.stringify(params, null, 2));
    const result = await this.service.findOne({
      where: {
        id: params.id,
      },
    });
    if (result === null) {
      throw new common.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`,
      );
    }
    return result;
  }

  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: Movie })
  @swagger.ApiNotFoundResponse({ type: common.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: common.ForbiddenException })
  async update(
    @common.Param() params: MovieWhereUniqueInput,
    @common.Body() data: MovieUpdateInput,
  ): Promise<Movie> {
    try {
      return await this.service.update({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      // @ts-ignore
      if (isRecordNotFoundError(error)) {
        throw new common.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`,
        );
      }
      throw error;
    }
  }

  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: Movie })
  @swagger.ApiNotFoundResponse({ type: common.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: common.ForbiddenException })
  async review(
    @common.Param() params: MovieWhereUniqueInput,
    @common.Body() data: MovieUpdateInput,
  ): Promise<Movie> {
    try {
      return await this.service.review({
        where: {
          id: data.id,
        },
        data,
      });
    } catch (error) {
      // @ts-ignore
      if (isRecordNotFoundError(error)) {
        throw new common.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`,
        );
      }
      throw error;
    }
  }

  @common.Delete('/:id')
  @swagger.ApiOkResponse({ type: Movie })
  @swagger.ApiNotFoundResponse({ type: common.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: common.ForbiddenException })
  async delete(@common.Param() params: MovieWhereUniqueInput): Promise<Movie> {
    try {
      return await this.service.delete({
        where: {
          id: params.id,
        },
      });
    } catch (error) {
      // @ts-ignore
      if (isRecordNotFoundError(error)) {
        throw new common.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`,
        );
      }
      throw error;
    }
  }
}
