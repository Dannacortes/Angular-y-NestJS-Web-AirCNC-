import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // Si tienes un módulo de usuarios
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity'; // Asegúrate de importar la entidad User

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    JwtModule.register({
      secret: 'your_secret_key', // Cambia esto por una clave secreta real
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AppModule {}
