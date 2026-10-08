import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.login(loginDto);

    res.cookie('jwt', authResult.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    if (req.session) {
      (req.session as any).user = authResult.user;
      (req.session as any).isLoggedIn = true;
    }

    return authResult;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return {
      success: true,
      user: (req as any).user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-dashboard')
  getAdminDashboard(@Req() req: Request) {
    return {
      success: true,
      message: 'Chào mừng Admin! Bạn có toàn quyền truy cập khu vực quản trị (Authorisation thành công).',
      user: (req as any).user,
    };
  }

  @Get('cookies-demo')
  cookieDemo(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const existingCookies = req.cookies;

    res.cookie('user_preference_theme', 'forest_dark', {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('last_visit', new Date().toISOString(), {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      receivedCookies: existingCookies,
    };
  }

  @Get('session-demo')
  sessionDemo(@Req() req: Request) {
    const session = req.session as any;

    if (!session) {
      return {
        success: false,
        message: 'Session chưa được kích hoạt',
      };
    }

    session.views = (session.views || 0) + 1;

    return {
      success: true,
      sessionId: req.sessionID,
      sessionViews: session.views,
      currentUserInSession: session.user || null,
      cookieConfig: session.cookie,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('user_preference_theme');

    if (req.session) {
      req.session.destroy((err) => {
        if (err) console.error('Lỗi hủy session:', err);
      });
    }

    return {
      success: true,
      message: 'Đăng xuất thành công',
    };
  }
}
