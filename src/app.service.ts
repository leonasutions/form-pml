import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import KecamatanEntity from './model/kecamatan.entity';
import { And, Any, DataSource, Equal, In, IsNull, Not, Raw, Repository } from 'typeorm';
import Wilayah from './model/wilayah.entity';
import kelurahanEntity from './model/kelurahan.entity';
import tpsEntity from './model/tps.entity';
import userEntity from './model/user.entity';
import { PostDto, dataDto } from './dto/api.dto';
import DataCapresEntity from './model/dataCapres.entity';




@Injectable()
export class AppService {
  constructor(
    // @InjectDataSource("PEMILU_DB") private dataSource: DataSource,
    @InjectRepository(KecamatanEntity)
    private accountingRepository: Repository<KecamatanEntity>,
    @InjectRepository(kelurahanEntity)
    private kelurahanRepository: Repository<kelurahanEntity>,
    @InjectRepository(tpsEntity)
    private tpsRepository: Repository<tpsEntity>,
    @InjectRepository(userEntity)
    private userRepository: Repository<userEntity>,
    @InjectRepository(DataCapresEntity)
    private dataCapresRepository: Repository<DataCapresEntity>
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getKecamatan(type: string) {
    var dataKecamatan = await this.accountingRepository.find({ where: { type: type }, relations: ['wilayah'] })
    return dataKecamatan
  }

  async login(nrp, password, nomor_hp) {
    if (nrp != null) {
      var dataUser = await this.userRepository.findOne({ where: { nrp: nrp, password: password } })
      if (dataUser) {
        return dataUser
      } else {
        return null
      }
    }
  }

  async updateSecret(nrp, secret) {
    if (nrp != null) {
      var dataUser = await this.userRepository.findOne({ where: { nrp: nrp } })
      if (dataUser) {
        dataUser.secret = secret
        await this.userRepository.save(dataUser)
        return dataUser
      } else {
        return null
      }
    }
  }


  async loginAdmin(nrp, password, nomor_hp) {
    if (nrp != null) {
      var dataUser = await this.userRepository.findOne({ where: { nrp: nrp, password: password } })
      if (dataUser) {
        return dataUser
      } else {
        return null
      }
    }
  }

  async getKelurahan(idKecamatan: number) {
    var dataKelurahan = await this.kelurahanRepository.find({
      where: { kecamatan: { id: idKecamatan } },
      relations: ['kecamatan']
    })
    return dataKelurahan
  }
  async validation(dataDto: dataDto) {
    var dataUser = await this.userRepository.findOne({ where: { nrp: dataDto.nrp, secret: dataDto.secret } })
    if (dataUser) {
      return dataUser
    } else {
      return null
    }
  }


  async getTps(idKelurahan: number) {
    var dataCapres = await this.dataCapresRepository.find({ select: ['tps'], relations: ['tps'] })
    var filter = []
    if (dataCapres != null) {
      for (const item of dataCapres) {
        filter.push(item.tps.id)
      }
    }
    var dataKelurahan = await this.tpsRepository.find({
      where: {
        kelurahan: { id: idKelurahan }, id: Raw((alias) => `${alias} NOT IN (:...list_id)`, {
          list_id: filter
        }),
      },
    })
    return dataKelurahan
  }
  async postData(dataCapres: PostDto) {
    var dataUser = await this.userRepository.findOne({ where: { nrp: dataCapres.nrp } })
    var dataTps = await this.tpsRepository.findOne({ where: { id: dataCapres.tps_id } })
    if (dataUser && dataTps) {
      var newDataCapres = new DataCapresEntity()
      newDataCapres.paslon_1 = dataCapres.paslon_1
      newDataCapres.paslon_2 = dataCapres.paslon_2
      newDataCapres.paslon_3 = dataCapres.paslon_3
      newDataCapres.suara_sah = dataCapres.suara_sah
      newDataCapres.suara_tidak_sah = dataCapres.suara_tidak_sah
      newDataCapres.total_dpt = dataCapres.total_dpt
      newDataCapres.total_dpt_datang = dataCapres.total_dpt_datang
      newDataCapres.total_dpt_khusus = dataCapres.total_dpt_khusus
      newDataCapres.total_dpt_tambahan = dataCapres.total_dpt_tambahan
      newDataCapres.tps = dataTps
      newDataCapres.user_id = dataUser
      await this.dataCapresRepository.insert(newDataCapres)
      return newDataCapres
    } else {
      return null
    }

  }


}
