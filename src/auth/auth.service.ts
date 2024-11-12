import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../supabase/supabase.service'; // Supabase service for interacting with Supabase

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private supabaseService: SupabaseService // Inject Supabase service
  ) {}

  async validateUser(loginDto: LoginDto): Promise<string | null> {
    const { username, password } = loginDto;
    // Find user in Supabase
    const user = await this.supabaseService.findUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { username: user.username, sub: user.id };
      return this.jwtService.sign(payload, { expiresIn: '1h' }); // Token expires in 1 hour
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;
    // Check if user exists in Supabase
    const existingUser = await this.supabaseService.findUserByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Create user in Supabase
    const newUser = await this.supabaseService.createUser(createUserDto, hashedPassword);
    return newUser;
  }
}
