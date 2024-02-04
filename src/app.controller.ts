import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('')
  async login(@Res() res) {
    var path = require('path');
    return res.sendFile(path.resolve('public/login.html'));
  }

  @Get('1')
  async inputData(@Res() res) {
    res.render('one', { title: 'Hey', message: 'Hello there!' })
  }


}
