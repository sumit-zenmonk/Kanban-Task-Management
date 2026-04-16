import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSource } from './infrastructure/database/data-source';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './infrastructure/repository/user.repo';
import { AuthenticateMiddleware } from './infrastructure/middleware/authenticate.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { JwtHelperService } from './infrastructure/services/jwtservice';
import { SocketModule } from './infrastructure/socket/socket.module';
import { TeamModule } from './features/team/team.module';
import { UserModule } from './features/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MemberModule } from './features/member/member.module';
import { ProjectModule } from './features/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      ...dataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_POST) || 2525,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),

    //Modules
    AuthModule,
    SocketModule,
    TeamModule,
    UserModule,
    MemberModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository, JwtHelperService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: 'auth/*path', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
