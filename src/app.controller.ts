import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'Server is running! Get request successful.',
      framework: 'NestJS',
      status: 'OK',
      docs: {
        destinations: '/api/destinations',
      },
    };
  }
}
