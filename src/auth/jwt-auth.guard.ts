import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          success: false,
          message: 'Bạn chưa đăng nhập hoặc Token JWT không hợp lệ / đã hết hạn',
          error: info?.message || 'Unauthorized',
        })
      );
    }
    return user;
  }
}
