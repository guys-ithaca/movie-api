import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MovieModule } from './api/movie/movie.module';
import { Neo4jConfig } from './core/graphdb/neo4j.config';
import { Neo4jModule } from './core/graphdb/neo4j.module';

console.log(process.cwd());
@Module({
  controllers: [],
  imports: [MovieModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [],
  exports: [],
})
export class AppModule {}
