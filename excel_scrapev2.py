import mysql.connector
import numpy as np
import warnings
warnings.filterwarnings("ignore", "\nPyarrow", DeprecationWarning)
import pandas as pd

def manual_replace(s, char, index):
    return s[:index] + char + s[index +1:]

file_excel = open('files/tps2.xlsx','rb')
xls = pd.ExcelFile(file_excel)
list_sheet = xls.sheet_names

mydb = mysql.connector.connect(
  host="116.66.206.189",
  user="udaka_svc",
  password="udaka2022",
  database="tps"
)
mycursor = mydb.cursor()
i = 0
kelur = set()
df = xls.parse('TELUK NAGA', skiprows=0, index_col=None, na_values=['NA'])


df = df.rename(columns={"ALAMAT TPS \n(MASING-MASING TPS)": "alamat"})
df = df[df['alamat'].notnull()] 
df['alamat_tps'] = df['No Tps'].astype(int)
df['nama_tps'] = 'TPS '+ df['No Tps'].astype(int).astype(str)
df = df.sort_values(by=['KECAMATAN','KELURAHAN','alamat_tps'],ascending = True)
df['alamat']=df['alamat'].str.split().str.join(' ')
# df['alamat']=df['nama_tps']+' '+df['alamat']



satu = df.to_dict(orient='records')
list_all = []
set_kelurahan = set()
query_kelurahan = set()
query_tps = set()
for item in satu:
    objek = {
            'kecamatan':item['KECAMATAN'],
            'kelurahan':item['KELURAHAN'].strip().upper(),
            'nama_tps':item['nama_tps'].upper(),
            'alamat':item['alamat'].replace("'",'').upper(),
            'nomor':item['alamat_tps']
            }

    query_search_kecamatan = f"select id from pemilu.kecamatan where nama='{objek['kecamatan'].strip()}'"
    mycursor.execute(query_search_kecamatan)
    id_kec = mycursor.fetchone()[0]
    # if objek['kelurahan'] not in ['PANGKALAN','MUARA','RAWA BURUNG']:
    #     query = f"insert into pemilu.kelurahan (`nama`,`kecamatan_id`) values ('{objek['kelurahan']}',{id_kec})"
    #     query_kelurahan.add(query)
    if id_kec==30:
            query_search_kelurahan = f"select id from pemilu.kelurahan where nama='{objek['kelurahan']}'"
            mycursor.execute(query_search_kelurahan)
            id_kel = mycursor.fetchone()[0]
            query_insert_tps = f"insert into pemilu.tps (`nama`,`alamat`,`nomor`,`kelurahan_id`) values ('{objek['nama_tps']}','{objek['alamat']}','{objek['nomor']}', {id_kel});"
            query_tps.add(query_insert_tps)
            print(query_insert_tps)


# for x in query_kelurahan:
    
#     print(x)
#     mycursor.execute(x)
#     mydb.commit()