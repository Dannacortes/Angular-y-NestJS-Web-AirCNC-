import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = new SupabaseClient('https://your-supabase-url', 'your-anon-key');
  }

  async findUserByUsername(username: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users') // Name of the table in Supabase
      .select('*')
      .eq('username', username)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async createUser(createUserDto: CreateUserDto, hashedPassword: string): Promise<any> {
    const { username, email } = createUserDto;
    const { data, error } = await this.supabase
      .from('users') // Name of the table in Supabase
      .insert([{ username, email, password: hashedPassword }]);

    if (error) throw new Error(error.message);
    return data[0]; // Return the created user
  }
}
