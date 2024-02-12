
export class kelurahanDto {
  idKecamatan?: number;
}

export class dataDto {
  nrp: string;
  secret: string;
}



export class tpsDto {
  idKelurahan?: number;
}

export class KecamatanDto {
  type?: string;
}
export class WilayahDto {
  type?: string;
}
export class LoginDto {
  nrp: string;
  password: string;
  no_hp?: string;
  secret: number;
}

export class DashboardDto {
  listIdKelurahan: [number];
  type: string;
}

export class ExcelDto {
  type: string;
}



export class PostDto {
  user: string;
  paslon_1: number;
  paslon_2: number;
  paslon_3: number;
  suara_sah: number;
  total_dpt: number;
  total_dpt_tambahan: number;
  total_dpt_khusus: number;
  total_dpt_datang: number;
  suara_tidak_sah: number;
  tps_id: number;
  nrp: string;
}