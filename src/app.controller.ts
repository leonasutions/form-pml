import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { KecamatanDto, LoginDto, PostDto, dataDto, kelurahanDto, tpsDto } from './dto/api.dto';
import { log } from 'console';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly configService: ConfigService
  ) { }

  @Get('')
  async home(@Res() res) {
    var secret = Math.random().toString(36).slice(2).toUpperCase()
    res.render('login', { 'secret': secret, 'host': this.configService.get("HOST"), })
  }

  @Get('data')
  async inputData(@Res() res, @Query() validationData: dataDto) {
    if (validationData.nrp != null && validationData.secret != null) {
      var validateCheck = await this.appService.validation(validationData);
      if (validateCheck) {
        res.render('one', { nrp: validationData.nrp })
      } else {
        res.render('invalid')
      }
    } else {
      res.render('invalid')
    }
    // res.render('one')
  }

  @Get('api/kecamatan')
  async kecamatan(@Query() kecamatanDto: KecamatanDto) {
    var dataKecamatan = await this.appService.getKecamatan(kecamatanDto.type)
    return dataKecamatan
  }

  @Get('api/kelurahan')
  async kelurahan(@Query() getNameDto: kelurahanDto) {
    var dataKelurahan = await this.appService.getKelurahan(getNameDto.idKecamatan)
    return dataKelurahan
  }

  @Get('api/tps')
  async tps(@Query() getkelurahanDto: tpsDto) {
    var dataTps = await this.appService.getTps(getkelurahanDto.idKelurahan)
    return dataTps
  }

  @Post('api/capres')
  async capres(@Body() dataCapresDto: PostDto, @Res() res) {
    console.log(dataCapresDto)
    var dataCapres = await this.appService.postData(dataCapresDto)
    res.status(200).send({ message: "data berhasil di input", success: 1 })
  }

  @Post('api/login')
  async loginApi(@Body() loginDto: LoginDto, @Res() res) {
    var dataLogin = await this.appService.login(loginDto.nrp, loginDto.password, loginDto.no_hp)
    if (dataLogin != null) {
      await this.appService.updateSecret(loginDto.nrp, loginDto.secret)
      res.status(200).send({ message: "login successfuly", success: 1 })
    } else {
      res.status(200).send({ message: "nrp atau password salah", success: 0 })

    }
  }

  @Post('api/login-admin')
  async loginAdminApi(@Body() loginDto: LoginDto, @Res() res) {
    var dataLogin = await this.appService.loginAdmin(loginDto.nrp, loginDto.password, loginDto.no_hp)
    if (dataLogin != null) {
      res.status(200).send({ message: "login successfuly", success: 1 })
    } else {
      res.status(200).send({ message: "nrp atau password salah", success: 0 })
    }
  }

}
