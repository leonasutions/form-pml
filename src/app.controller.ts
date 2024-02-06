import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { kelurahanDto } from './dto/api.dto';

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


  @Get('api/kecamatan')
  async kecamatan() {
    var dataKecamatan = await this.appService.getKecamatan()
    return dataKecamatan
  }

  @Get('api/kelurahan')
  async kelurahan(@Res() res) {
    var dataKecamatan = await this.appService.getKecamatan()
    return dataKecamatan
  }

  @Get('api/tps')
  async tps(@Query() getNameDto: kelurahanDto) {
    var dataKecamatan = await this.appService.getKecamatan()
    return dataKecamatan
  }

  @Post('capres')
  async capres(@Res() res) {
    var dataKecamatan = await this.appService.getKecamatan()
    return dataKecamatan
  }


}
