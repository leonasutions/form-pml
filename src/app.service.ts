import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import KecamatanEntity from './model/kecamatan.entity';
import { DataSource, Equal, In, IsNull, Not, Repository } from 'typeorm';
import Wilayah from './model/wilayah.entity';
import kelurahanEntity from './model/kelurahan.entity';
import tpsEntity from './model/tps.entity';




@Injectable()
export class AppService {
  constructor(
    // @InjectDataSource("PEMILU_DB") private dataSource: DataSource,
    @InjectRepository(KecamatanEntity)
    private accountingRepository: Repository<KecamatanEntity>,
    @InjectRepository(kelurahanEntity)
    private kelurahanRepository: Repository<kelurahanEntity>,
    @InjectRepository(tpsEntity)
    private tpsRepository: Repository<tpsEntity>
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getKecamatan() {
    var dataKecamatan = await this.accountingRepository.find({ relations: ['wilayah'] })
    return dataKecamatan
  }

  async getKelurahan(idKecamatan: number) {
    var dataKelurahan = await this.kelurahanRepository.find({
      where: { kecamatan: { id: idKecamatan } },
      relations: ['kecamatan']
    })
    return dataKelurahan
  }

  
  async getTps(idKelurahan: number) {
    var dataKelurahan = await this.tpsRepository.find({
      where: { kelurahan: { id: idKelurahan } },
    })
    return dataKelurahan
  }
}
