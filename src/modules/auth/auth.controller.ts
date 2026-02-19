import { Body, Controller, Post, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'node_modules/bcryptjs';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerData: RegisterDto) {
    return await this.authService.register(registerData);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginData: LoginDto) {
    const { password, email } = loginData;
    
    const user = await this.usersService.findOne(email.toLowerCase());
    
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await this.authService.genToken(user);
        return token;
      }
    }

    throw new UnauthorizedException('Credenciales inválidas.');
  }
}
