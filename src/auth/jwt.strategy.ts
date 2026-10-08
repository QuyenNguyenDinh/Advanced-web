import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly db: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.jwt || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'xedich_secret_jwt_key_2026',
    });
  }

  async validate(payload: any) {
    const res = await this.db.query(
      'SELECT id, username, email, name, role, avatar, created_at FROM users WHERE id = $1',
      [payload.sub],
    );

    if (res.rows.length === 0) {
      throw new UnauthorizedException('Người dùng không tồn tại hoặc token không hợp lệ');
    }

    return res.rows[0];
  }
}
