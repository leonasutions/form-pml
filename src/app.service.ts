import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import KecamatanEntity from './model/kecamatan.entity';
import { And, Any, DataSource, Equal, In, IsNull, Not, Raw, Repository } from 'typeorm';
import Wilayah from './model/wilayah.entity';
import kelurahanEntity from './model/kelurahan.entity';
import tpsEntity from './model/tps.entity';
import userEntity from './model/user.entity';
import { DashboardDto, PostDto, dataDto } from './dto/api.dto';
import DataCapresEntity from './model/dataCapres.entity';
import { Workbook } from "exceljs";




@Injectable()
export class AppService {
  constructor(
    // @InjectDataSource("PEMILU_DB") private dataSource: DataSource,
    @InjectRepository(KecamatanEntity)
    private kecamatanRepository: Repository<KecamatanEntity>,
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
    var dataKecamatan = await this.kecamatanRepository.find({ where: { type: type }, relations: ['wilayah'] })
    return dataKecamatan
  }

  async fetchDashboardDetailKecamatan(idKelurahan: [number], type) {
    var dataAllKecamatan = await this.dataCapresRepository.query(
      `
      SELECT 
          kec.nama,
          CASE
              WHEN SUM(paslon_1) IS NULL THEN '-'
              ELSE SUM(paslon_1)
          END AS total_paslon_1,
          CASE
              WHEN SUM(paslon_2) IS NULL THEN '-'
              ELSE SUM(paslon_2)
          END AS total_paslon_2,
          CASE
              WHEN SUM(paslon_3) IS NULL THEN '-'
              ELSE SUM(paslon_3)
          END AS total_paslon_3,
          CASE
              WHEN SUM(total_dpt) IS NULL THEN '-'
              ELSE SUM(total_dpt)
          END AS total_dpt,
          CASE
              WHEN SUM(total_dpt_tambahan) IS NULL THEN '-'
              ELSE SUM(total_dpt_tambahan)
          END AS total_dpt_plus,
          CASE
              WHEN SUM(total_dpt_datang) IS NULL THEN '-'
              ELSE SUM(total_dpt_datang)
          END AS total_dpt_datang,
          CASE
              WHEN SUM(suara_sah) IS NULL THEN '-'
              ELSE SUM(suara_sah)
          END AS total_sah,
          CASE
              WHEN SUM(suara_tidak_sah) IS NULL THEN '-'
              ELSE SUM(suara_tidak_sah)
          END AS total_tidak_sah
      FROM
          kecamatan AS kec
              LEFT JOIN
          kelurahan kel ON kec.id = kel.kecamatan_id
              LEFT JOIN
          tps tp ON tp.kelurahan_id = kel.id
              LEFT JOIN
          data_capres cap ON cap.tps_id = tp.id
          where kel.id in (${idKelurahan})
      group by kec.nama
      `
    )
    return dataAllKecamatan
  }

  async fetchDashboardDetailKelurahan(idKelurahan: [number], type) {
    var dataAllKecamatan = await this.dataCapresRepository.query(
      `
      SELECT 
          kel.nama,kec.nama as kecamatan,
          CASE
              WHEN SUM(paslon_1) IS NULL THEN '-'
              ELSE SUM(paslon_1)
          END AS total_paslon_1,
          CASE
              WHEN SUM(paslon_2) IS NULL THEN '-'
              ELSE SUM(paslon_2)
          END AS total_paslon_2,
          CASE
              WHEN SUM(paslon_3) IS NULL THEN '-'
              ELSE SUM(paslon_3)
          END AS total_paslon_3,
          CASE
              WHEN SUM(total_dpt) IS NULL THEN '-'
              ELSE SUM(total_dpt)
          END AS total_dpt,
          CASE
              WHEN SUM(total_dpt_tambahan) IS NULL THEN '-'
              ELSE SUM(total_dpt_tambahan)
          END AS total_dpt_plus,
          CASE
              WHEN SUM(total_dpt_datang) IS NULL THEN '-'
              ELSE SUM(total_dpt_datang)
          END AS total_dpt_datang,
          CASE
              WHEN SUM(suara_sah) IS NULL THEN '-'
              ELSE SUM(suara_sah)
          END AS total_sah,
          CASE
              WHEN SUM(suara_tidak_sah) IS NULL THEN '-'
              ELSE SUM(suara_tidak_sah)
          END AS total_tidak_sah
      FROM
          kecamatan AS kec
              LEFT JOIN
          kelurahan kel ON kec.id = kel.kecamatan_id
              LEFT JOIN
          tps tp ON tp.kelurahan_id = kel.id
              LEFT JOIN
          data_capres cap ON cap.tps_id = tp.id
          where kel.id in (${idKelurahan})
      group by kel.nama,kec.nama
      `
    )
    return dataAllKecamatan
  }

  async fetchDashboardDetailTps(idKelurahan: [number], type) {
    var dataAllKecamatan = await this.dataCapresRepository.query(
      `
      SELECT 
        tp.alamat,kel.nama as kelurahan,kec.nama as kecamatan,
          CASE
              WHEN SUM(paslon_1) IS NULL THEN '-'
              ELSE SUM(paslon_1)
          END AS total_paslon_1,
          CASE
              WHEN SUM(paslon_2) IS NULL THEN '-'
              ELSE SUM(paslon_2)
          END AS total_paslon_2,
          CASE
              WHEN SUM(paslon_3) IS NULL THEN '-'
              ELSE SUM(paslon_3)
          END AS total_paslon_3,
          CASE
              WHEN SUM(total_dpt) IS NULL THEN '-'
              ELSE SUM(total_dpt)
          END AS total_dpt,
          CASE
              WHEN SUM(total_dpt_tambahan) IS NULL THEN '-'
              ELSE SUM(total_dpt_tambahan)
          END AS total_dpt_plus,
          CASE
              WHEN SUM(total_dpt_datang) IS NULL THEN '-'
              ELSE SUM(total_dpt_datang)
          END AS total_dpt_datang,
          CASE
              WHEN SUM(suara_sah) IS NULL THEN '-'
              ELSE SUM(suara_sah)
          END AS total_sah,
          CASE
              WHEN SUM(suara_tidak_sah) IS NULL THEN '-'
              ELSE SUM(suara_tidak_sah)
          END AS total_tidak_sah
      FROM
          kecamatan AS kec
              LEFT JOIN
          kelurahan kel ON kec.id = kel.kecamatan_id
              LEFT JOIN
          tps tp ON tp.kelurahan_id = kel.id
              LEFT JOIN
          data_capres cap ON cap.tps_id = tp.id
          where kel.id in (${idKelurahan})
      group by tp.alamat,kel.nama,kec.nama
      `
    )
    return dataAllKecamatan
  }
  async fetchDashboard(idKelurahan: [number], type) {
    var dataKecamatan = await this.tpsRepository.query(`
    SELECT 
          sum(total_dpt) as total_dpt_all,
          '100' as total_dpt_all_percentage,
          sum(total_dpt_tambahan) as total_dpt_tambahan_all,
          TRUNCATE((sum(total_dpt_tambahan)/sum(total_dpt))*100,2) as total_dpt_tambahan_all_percentage,
          sum(total_dpt_datang)  as total_hadir,
          TRUNCATE((sum(total_dpt_datang) / (sum(total_dpt) + sum(total_dpt_tambahan)))*100,2) as total_hadir_percentage,
          sum(suara_sah) as total_suara_sah ,
          TRUNCATE((sum(suara_sah) / sum(total_dpt))*100,2) as total_suara_sah_percentage,
          sum(suara_tidak_sah)  as total_suara_tidak_sah,
          TRUNCATE((sum(suara_tidak_sah) / sum(total_dpt))*100,2) as total_suara_tidak_sah_percentage,
          sum(paslon_1) as total_paslon_1,
          TRUNCATE((sum(paslon_1)/(sum(paslon_1)+sum(paslon_2)+sum(paslon_3)))*100,2) as total_paslon_1_percentage,
          sum(paslon_2) as total_paslon_2,
          TRUNCATE((sum(paslon_2) / (sum(paslon_1)+sum(paslon_2)+sum(paslon_3)))*100,2) as total_paslon_2_percentage,
          sum(paslon_3) as total_paslon_3,
          TRUNCATE((sum(paslon_3) / (sum(paslon_1)+sum(paslon_2)+sum(paslon_3)))*100,2) as total_paslon_3_percentage
      FROM
          pemilu.data_capres cap
              LEFT JOIN
          tps tp ON cap.tps_id = tp.id
          left join
        kelurahan kel on tp.kelurahan_id = kel.id
          where kel.id in ( ${idKelurahan})
      ;
    `,)

    var total_data_tps = await this.tpsRepository.query(`
    SELECT count(tp.id)  as total_tps  FROM
        tps tp 
        left join
      kelurahan kel on tp.kelurahan_id = kel.id
        left join kecamatan kec on kel.kecamatan_id = kec.id
        where kel.id in ( ${idKelurahan})
    `)
    var data_tps_masuk = await this.dataCapresRepository.query(`
          SELECT count(cap.tps_id) as data_tps_masuk  FROM
          pemilu.data_capres cap
              LEFT JOIN
          tps tp ON cap.tps_id = tp.id
          left join
        kelurahan kel on tp.kelurahan_id = kel.id
          where kel.id in ( ${idKelurahan});
    `)
    var total_tps
    var total_tps_masuk
    for (const item of total_data_tps) {
      total_tps = item.total_tps
    }

    for (const item of data_tps_masuk) {
      total_tps_masuk = item.data_tps_masuk
    }
    dataKecamatan[0]['total_tps_masuk'] = total_tps_masuk
    dataKecamatan[0]['total_tps'] = total_tps
    var data_tps_belum_masuk
    if (type == 'SELURUH WILAYAH') {
      data_tps_belum_masuk = await this.dataCapresRepository.query(`
      SELECT 
      id, nama,total-toral as data_belum_masuk
      FROM
          (SELECT 
              id,
                  total.nama,
                  total.total,type,
                  CASE
                      WHEN pd.total IS NULL THEN 0
                      ELSE pd.total
                  END AS toral
          FROM
              (SELECT 
              kec.nama, kec.id as id,type, COUNT(tp.id) AS total
          FROM
              tps tp
          LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
          LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
          GROUP BY kec.nama) AS total
          LEFT JOIN (SELECT 
              kec.nama, COUNT(cap.id) AS total
          FROM
              data_capres AS cap
          LEFT JOIN tps tp ON cap.tps_id = tp.id
          LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
          LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
          GROUP BY kec.nama) AS pd ON total.nama = pd.nama) AS pf
      `)
    } else {
      data_tps_belum_masuk = await this.dataCapresRepository.query(`
      SELECT 
      id, nama,total-toral as data_belum_masuk
      FROM
          (SELECT 
              id,
                  total.nama,
                  total.total,type,
                  CASE
                      WHEN pd.total IS NULL THEN 0
                      ELSE pd.total
                  END AS toral
          FROM
              (SELECT 
              kec.nama, kec.id as id,type, COUNT(tp.id) AS total
          FROM
              tps tp
          LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
          LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
          GROUP BY kec.nama) AS total
          LEFT JOIN (SELECT 
              kec.nama, COUNT(cap.id) AS total
          FROM
              data_capres AS cap
          LEFT JOIN tps tp ON cap.tps_id = tp.id
          LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
          LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
          GROUP BY kec.nama) AS pd ON total.nama = pd.nama) AS pf
          where type='${type}'
      `)
    }
    dataKecamatan[0]['list_belum_masuk'] = data_tps_belum_masuk
    return dataKecamatan
  }

  async getWilayah(type: string) {
    var dataKecamatan
    if (type == 'SELURUH WILAYAH') {
      dataKecamatan = await this.kecamatanRepository.find({ relations: ['kelurahans'] })

    } else {
      dataKecamatan = await this.kecamatanRepository.find({ where: { type: type }, relations: ['kelurahans'] })
    }
    return dataKecamatan
  }

  async login(nrp, password, nomor_hp) {
    if (nrp != null) {
      var dataUser = await this.userRepository.findOne({ where: { nrp: nrp, password: password } })
      if (dataUser) {
        dataUser.phone = nomor_hp
        await this.userRepository.save(dataUser);
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
  async excel(excelFilter: DashboardDto) {
    var dataKec = await this.fetchDashboardDetailKecamatan(excelFilter.listIdKelurahan, excelFilter.type)
    var dataKel = await this.fetchDashboardDetailKelurahan(excelFilter.listIdKelurahan, excelFilter.type)
    var dataTps = await this.fetchDashboardDetailTps(excelFilter.listIdKelurahan, excelFilter.type)
    const workbook = new Workbook();
    await workbook.xlsx.readFile("files/excel_kecamatan.xlsx");
    const worksheet = workbook.getWorksheet("KECAMATAN");
    const worksheet2 = workbook.getWorksheet("KELURAHAN");
    const worksheet3 = workbook.getWorksheet("TPS");
    var nomor = 1
    for (const item of dataKec) {
      worksheet.addRow([nomor, item.nama, item.total_dpt, item.total_dpt_plus, item.total_dpt_datang, item.total_sah, item.total_tidak_sah, item.total_paslon_1, item.total_paslon_2, item.total_paslon_3])
      nomor = nomor + 1
    }

    for (const item of dataKel) {dataKel
      worksheet2.addRow([nomor, item.nama, item.kecamatan, item.total_dpt, item.total_dpt_plus, item.total_dpt_datang, item.total_sah, item.total_tidak_sah, item.total_paslon_1, item.total_paslon_2, item.total_paslon_3])
      nomor = nomor + 1
    }

    for (const item of dataTps) {
      worksheet3.addRow([nomor, item.alamat, item.kelurahan, item.kecamatan, item.total_dpt, item.total_dpt_plus, item.total_dpt_datang, item.total_sah, item.total_tidak_sah, item.total_paslon_1, item.total_paslon_2, item.total_paslon_3])
      nomor = nomor + 1
    }
    const excelBuffer = await workbook.xlsx.writeBuffer();
    return excelBuffer;
  }



}
