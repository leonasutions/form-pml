import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto, kelurahanDto, tpsDto } from './dto/api.dto';
import { log } from 'console';

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
  async kelurahan(@Query() getNameDto: kelurahanDto) {
    var dataKecamatan = await this.appService.getKelurahan(getNameDto.idKecamatan)
    return dataKecamatan
  }

  @Get('api/tps')
  async tps(@Query() getkelurahanDto: tpsDto) {
    var dataKecamatan = await this.appService.getTps(getkelurahanDto.idKelurahan)
    return dataKecamatan
  }

  @Post('api/capres')
  async capres(@Res() res) {
    var dataKecamatan = await this.appService.getKecamatan()
    return dataKecamatan
  }

  @Post('api/login')
  async loginApi(@Body() loginDto: LoginDto, @Res() res) {
    var dataKecamatan = await this.appService.login(loginDto.nrp, loginDto.password, loginDto.no_hp)
    if (dataKecamatan != null) {
      res.status(200).send({ message: "login successfuly", success: 1 })
    } else {
      res.status(200).send({ message: "nrp atau password salah", success: 0 })

    }
  }


}
