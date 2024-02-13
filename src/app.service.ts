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

  async fetchDashboardDetailKecamatan(listIdKecamatan: [number], type) {
    var dataAllKecamatan = await this.dataCapresRepository.query(
      `
      SELECT 
          kec.nama,
          COALESCE(SUM(COALESCE(paslon_1, 0)), '-') AS total_paslon_1,
          COALESCE(SUM(COALESCE(paslon_2, 0)), '-') AS total_paslon_2,
          COALESCE(SUM(COALESCE(paslon_3, 0)), '-') AS total_paslon_3,
          COALESCE(SUM(COALESCE(total_dpt, 0)), '-') AS total_dpt,
          COALESCE(SUM(COALESCE(total_dpt_tambahan, 0)), '-') AS total_dpt_plus,
          COALESCE(SUM(COALESCE(total_dpt_datang, 0)), '-') AS total_dpt_datang,
          COALESCE(SUM(COALESCE(suara_sah, 0)), '-') AS total_sah,
          COALESCE(SUM(COALESCE(suara_tidak_sah, 0)), '-') AS total_tidak_sah
      FROM
          kecamatan AS kec
              LEFT JOIN
          kelurahan kel ON kec.id = kel.kecamatan_id
              LEFT JOIN
          tps tp ON tp.kelurahan_id = kel.id
              LEFT JOIN
          data_capres cap ON cap.tps_id = tp.id
      WHERE
          kec.id IN (${listIdKecamatan})
      GROUP BY
          kec.nama;
      `
    )
    return dataAllKecamatan
  }

  async fetchDashboardDetailKelurahan(listIdKecamatan: [number], type) {
    var dataAllKecamatan = await this.dataCapresRepository.query(
      `
      SELECT 
          kel.nama,
          kec.nama as kecamatan,
          COALESCE(SUM(paslon_1), '-') AS total_paslon_1,
          COALESCE(SUM(paslon_2), '-') AS total_paslon_2,
          COALESCE(SUM(paslon_3), '-') AS total_paslon_3,
          COALESCE(SUM(total_dpt), '-') AS total_dpt,
          COALESCE(SUM(total_dpt_tambahan), '-') AS total_dpt_plus,
          COALESCE(SUM(total_dpt_datang), '-') AS total_dpt_datang,
          COALESCE(SUM(suara_sah), '-') AS total_sah,
          COALESCE(SUM(suara_tidak_sah), '-') AS total_tidak_sah
      FROM
          kecamatan AS kec
          LEFT JOIN kelurahan AS kel ON kec.id = kel.kecamatan_id
          LEFT JOIN tps AS tp ON tp.kelurahan_id = kel.id
          LEFT JOIN data_capres AS cap ON cap.tps_id = tp.id
      WHERE
          kec.id IN (${listIdKecamatan})
      GROUP BY
          kel.nama, kec.nama;
      `
    )
    return dataAllKecamatan
  }

  async fetchDashboardDetailTps(listIdKecamatan: [number], type) {
    var dataAllKecamatan = await this.dataCapresRepository.query(
      `
      SELECT 
        tp.alamat,
        kel.nama AS kelurahan,
        kec.nama AS kecamatan,
        COALESCE(SUM(paslon_1), '-') AS total_paslon_1,
        COALESCE(SUM(paslon_2), '-') AS total_paslon_2,
        COALESCE(SUM(paslon_3), '-') AS total_paslon_3,
        COALESCE(SUM(total_dpt), '-') AS total_dpt,
        COALESCE(SUM(total_dpt_tambahan), '-') AS total_dpt_plus,
        COALESCE(SUM(total_dpt_datang), '-') AS total_dpt_datang,
        COALESCE(SUM(suara_sah), '-') AS total_sah,
        COALESCE(SUM(suara_tidak_sah), '-') AS total_tidak_sah
    FROM
        tps tp
        LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
        LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
        LEFT JOIN data_capres cap ON cap.tps_id = tp.id
    WHERE
        kec.id IN (${listIdKecamatan})
    GROUP BY
        tp.alamat,tp.nama, kel.nama, kec.nama;
      `
    )
    return dataAllKecamatan
  }
  async fetchDashboard(listIdKecamatan: [number], type) {
    var dataKecamatan = await this.tpsRepository.query(`
    SELECT 
        SUM(total_dpt) as total_dpt_all,
        '100' as total_dpt_all_percentage,

        SUM(total_dpt_tambahan) as total_dpt_tambahan_all,
        TRUNCATE((SUM(total_dpt_tambahan)/SUM(total_dpt))*100, 2) as total_dpt_tambahan_all_percentage,

        SUM(total_dpt_datang)  as total_hadir,
        TRUNCATE((SUM(total_dpt_datang) / (SUM(total_dpt) + SUM(total_dpt_tambahan)))*100, 2) as total_hadir_percentage,

        SUM(suara_sah) as total_suara_sah ,
        TRUNCATE((SUM(suara_sah) / SUM(total_dpt_datang))*100, 2) as total_suara_sah_percentage,

        SUM(suara_tidak_sah)  as total_suara_tidak_sah,
        TRUNCATE((SUM(suara_tidak_sah) / SUM(total_dpt_datang))*100, 2) as total_suara_tidak_sah_percentage,

        SUM(paslon_1) as total_paslon_1,
        TRUNCATE((SUM(paslon_1)/(SUM(paslon_1)+SUM(paslon_2)+SUM(paslon_3)))*100, 2) as total_paslon_1_percentage,
        SUM(paslon_2) as total_paslon_2,
        TRUNCATE((SUM(paslon_2) / (SUM(paslon_1)+SUM(paslon_2)+SUM(paslon_3)))*100, 2) as total_paslon_2_percentage,
        SUM(paslon_3) as total_paslon_3,
        TRUNCATE((SUM(paslon_3) / (SUM(paslon_1)+SUM(paslon_2)+SUM(paslon_3)))*100, 2) as total_paslon_3_percentage
    FROM
        pemilu.data_capres cap
            LEFT JOIN tps tp ON cap.tps_id = tp.id
            LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
    WHERE
        kel.kecamatan_id IN (${listIdKecamatan});
    `,)

    var total_data_tps = await this.tpsRepository.query(`
    SELECT count(tp.id)  as total_tps  FROM
        tps tp 
        left join
        kelurahan kel on tp.kelurahan_id = kel.id
        where kel.kecamatan_id in ( ${listIdKecamatan})
    `)
    var data_tps_masuk = await this.dataCapresRepository.query(`
          SELECT count(cap.tps_id) as data_tps_masuk  FROM
          pemilu.data_capres cap
              LEFT JOIN
          tps tp ON cap.tps_id = tp.id
          left join
        kelurahan kel on tp.kelurahan_id = kel.id
          where kel.kecamatan_id in ( ${listIdKecamatan});
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
    var data_tps_belum_masuk = await this.dataCapresRepository.query(`
      SELECT 
          pf.id, 
          pf.nama, 
          pf.total - COALESCE(pf.toral, 0) AS data_belum_masuk
      FROM
          (SELECT 
              total.id,
              total.nama,
              total.total,
              total.type,
              COALESCE(pd.total, 0) AS toral
          FROM
              (SELECT 
                  kec.id,
                  kec.nama,
                  COUNT(tp.id) AS total,
                  'type' AS type -- Adjust 'type' as needed, as it's currently hard-coded
              FROM
                  tps tp
              LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
              LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
              WHERE kec.id IN (${listIdKecamatan})
              GROUP BY kec.id, kec.nama) AS total
          LEFT JOIN
              (SELECT 
                  kec.id,
                  COUNT(cap.id) AS total
              FROM
                  data_capres AS cap
              LEFT JOIN tps tp ON cap.tps_id = tp.id
              LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
              LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
              WHERE kec.id IN (${listIdKecamatan})
              GROUP BY kec.id) AS pd ON total.id = pd.id) AS pf;

      `)
    dataKecamatan[0]['list_belum_masuk'] = data_tps_belum_masuk
    return dataKecamatan
  }

  async getDetailTpsKecamatan(listIdKecamatan: [number]) {
    var data_tps_kecamatan_belum_masuk = await this.dataCapresRepository.query(`
    SELECT 
        pf.id, 
        pf.nama, 
        pf.total - COALESCE(pf.toral, 0) AS data_belum_masuk,
        COALESCE(pf.toral, 0) AS data_masuk
    FROM
        (SELECT 
            total.id,
            total.nama,
            total.total,
            total.type,
            COALESCE(pd.total, 0) AS toral
        FROM
            (SELECT 
                kec.id,
                kec.nama,
                COUNT(tp.id) AS total,
                'type' AS type -- Adjust 'type' as needed, as it's currently hard-coded
            FROM
                tps tp
            LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
            LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
            WHERE kec.id IN (${listIdKecamatan})
            GROUP BY kec.id, kec.nama) AS total
        LEFT JOIN
            (SELECT 
                kec.id,
                COUNT(cap.id) AS total
            FROM
                data_capres AS cap
            LEFT JOIN tps tp ON cap.tps_id = tp.id
            LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
            LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
            WHERE kec.id IN (${listIdKecamatan})
            GROUP BY kec.id) AS pd ON total.id = pd.id) AS pf;
    `)
    return data_tps_kecamatan_belum_masuk
  }
  async getDetailTpsKelurahan(listIdKecamatan: [number]) {


    var data_tps_kelurahan_belum_masuk = await this.dataCapresRepository.query(`
    SELECT 
        pf.id, 
        pf.kelurahan,
		    pf.kecamatan,
        pf.total - COALESCE(pf.toral, 0) AS data_belum_masuk,
        COALESCE(pf.toral, 0) AS data_masuk
    FROM
        (SELECT 
            total.id,
            total.kelurahan,
            total.kecamatan,
            total.total,
            total.type,
            COALESCE(pd.total, 0) AS toral
        FROM
            (SELECT 
                kel.id,
                kel.nama as kelurahan,
                kec.nama as kecamatan,
                COUNT(tp.id) AS total,
                'type' AS type -- Adjust 'type' as needed, as it's currently hard-coded
            FROM
                tps tp
            LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
            LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
            WHERE kec.id IN (${listIdKecamatan})
            GROUP BY kel.id) AS total
        LEFT JOIN
            (SELECT 
                kel.id,
                COUNT(cap.id) AS total
            FROM
                data_capres AS cap
            LEFT JOIN tps tp ON cap.tps_id = tp.id
            LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
            LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
            WHERE kec.id IN (${listIdKecamatan})
            GROUP BY kel.id) AS pd ON total.id = pd.id) AS pf;
    `)
    return data_tps_kelurahan_belum_masuk


  }

  async getDetailTpstpx(listIdKecamatan: [number]) {
    var data_tps_tpx_belum_masuk = await this.dataCapresRepository.query(`
    SELECT 
        pf.id, 
        pf.kelurahan,
		pf.kecamatan,
        pf.total - COALESCE(pf.toral, 0) AS data_belum_masuk,
        COALESCE(pf.toral, 0) AS data_masuk
    FROM
        (SELECT 
            total.id,
            total.kelurahan,
            total.kecamatan,
            total.total,
            total.type,
            COALESCE(pd.total, 0) AS toral
        FROM
            (SELECT 
                tp.id,
                tp.nama as alamat,
                kel.nama as kelurahan,
                kec.nama as kecamatan,
                COUNT(tp.id) AS total,
                'type' AS type -- Adjust 'type' as needed, as it's currently hard-coded
            FROM
                tps tp
            LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
            LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
            WHERE kec.id IN (${listIdKecamatan})
            GROUP BY tp.id) AS total
        LEFT JOIN
            (SELECT 
                tp.id,
                COUNT(cap.id) AS total
            FROM
                data_capres AS cap
            LEFT JOIN tps tp ON cap.tps_id = tp.id
            LEFT JOIN kelurahan kel ON tp.kelurahan_id = kel.id
            LEFT JOIN kecamatan kec ON kel.kecamatan_id = kec.id
            WHERE kec.id IN (${listIdKecamatan})
            GROUP BY tp.id) AS pd ON total.id = pd.id) AS pf
            
            order by data_masuk desc;
    `)
    return data_tps_tpx_belum_masuk
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
    var dataKelurahan
    if (filter.length >0){
      dataKelurahan= await this.tpsRepository.find({
        where: {
          kelurahan: { id: idKelurahan }, id: Raw((alias) => `${alias} NOT IN (:...list_id)`, {
            list_id: filter
          }),
        },
      })
    }else{
      dataKelurahan= await this.tpsRepository.find({
        where: {
          kelurahan: { id: idKelurahan }
        },
      })
    }
    
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
    var dataKec = await this.fetchDashboardDetailKecamatan(excelFilter.listIdKecamatan, excelFilter.type)
    var dataKel = await this.fetchDashboardDetailKelurahan(excelFilter.listIdKecamatan, excelFilter.type)
    var dataTps = await this.fetchDashboardDetailTps(excelFilter.listIdKecamatan, excelFilter.type)
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
    nomor = 1
    for (const item of dataKel) {
      dataKel
      worksheet2.addRow([nomor, item.nama, item.kecamatan, item.total_dpt, item.total_dpt_plus, item.total_dpt_datang, item.total_sah, item.total_tidak_sah, item.total_paslon_1, item.total_paslon_2, item.total_paslon_3])
      nomor = nomor + 1
    }
    nomor = 1
    for (const item of dataTps) {
      worksheet3.addRow([nomor, item.alamat, item.kelurahan, item.kecamatan, item.total_dpt, item.total_dpt_plus, item.total_dpt_datang, item.total_sah, item.total_tidak_sah, item.total_paslon_1, item.total_paslon_2, item.total_paslon_3])
      nomor = nomor + 1
    }
    const excelBuffer = await workbook.xlsx.writeBuffer();
    return excelBuffer;
  }

  async excelTps(excelFilter: DashboardDto) {
    var dataKec = await this.getDetailTpsKecamatan(excelFilter.listIdKecamatan)
    var dataKel = await this.getDetailTpsKelurahan(excelFilter.listIdKecamatan)
    var dataTps = await this.getDetailTpstpx(excelFilter.listIdKecamatan)
    const workbook = new Workbook();
    await workbook.xlsx.readFile("files/excel_tps_kecamatan.xlsx");
    const worksheet = workbook.getWorksheet("KECAMATAN");
    const worksheet2 = workbook.getWorksheet("KELURAHAN");
    const worksheet3 = workbook.getWorksheet("TPS");
    var nomor = 1
    for (const item of dataKec) {
      worksheet.addRow([nomor, item.nama, item.data_masuk, item.data_belum_masuk])
      nomor = nomor + 1
    }
    nomor = 1
    for (const item of dataKel) {
      dataKel
      worksheet2.addRow([nomor, item.kelurahan, item.kecamatan, item.data_masuk, item.data_belum_masuk])
      nomor = nomor + 1
    }
    nomor = 1
    for (const item of dataTps) {
      worksheet3.addRow([nomor, item.alamat, item.kelurahan, item.kecamatan, item.data_masuk, item.data_belum_masuk])
      nomor = nomor + 1
    }
    const excelBuffer = await workbook.xlsx.writeBuffer();
    return excelBuffer;
  }






}
