import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { username, password, email, name } = dto;

    try {
      const checkUser = await this.db.query(
        'SELECT id FROM users WHERE username = $1',
        [username],
      );

      if (checkUser.rows.length > 0) {
        throw new BadRequestException({
          success: false,
          message: `Username '${username}' đã tồn tại, vui lòng chọn tên khác!`,
        });
      }

      if (email) {
        const checkEmail = await this.db.query(
          'SELECT id FROM users WHERE email = $1',
          [email],
        );
        if (checkEmail.rows.length > 0) {
          throw new BadRequestException({
            success: false,
            message: `Email '${email}' đã được đăng ký!`,
          });
        }
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const insertQuery = `
        INSERT INTO users (username, password, email, name, role)
        VALUES ($1, $2, $3, $4, 'user')
        RETURNING id, username, email, name, role, created_at
      `;
      const result = await this.db.query(insertQuery, [
        username,
        hashedPassword,
        email || `${username}@example.com`,
        name || username,
      ]);

      const newUser = new User(result.rows[0]);

      return {
        success: true,
        message: 'Đăng ký tài khoản thành công! Mật khẩu đã được mã hóa an toàn.',
        data: newUser,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      console.error('Lỗi khi đăng ký người dùng:', error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Lỗi máy chủ khi đăng ký tài khoản',
        error: error.message,
      });
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const userRes = await this.db.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );

    if (userRes.rows.length === 0) {
      return null;
    }

    const user = userRes.rows[0];
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác',
      });
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      success: true,
      message: 'Đăng nhập thành công!',
      access_token: token,
      token_type: 'Bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
