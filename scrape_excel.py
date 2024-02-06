import mysql.connector
import numpy as np
import warnings
warnings.filterwarnings("ignore", "\nPyarrow", DeprecationWarning)
import pandas as pd
file_excel = open('files/lampiran.xlsx','rb')
xls = pd.ExcelFile(file_excel)
list_sheet = xls.sheet_names
print(list_sheet)

mydb = mysql.connector.connect(
  host="116.66.206.189",
  user="udaka_svc",
  password="udaka2022",
  database="tps"
)
mycursor = mydb.cursor()
i = 0
kelur = set()
# for item in list_sheet:
#     rows = 9
#     if i!=0:
#         rows=5
    # df = xls.parse(item, skiprows=rows, index_col=None, na_values=['NA'])
    # df = df.rename(columns={"ALAMAT TPS \n(MASING-MASING TPS)": "alamat"})
    # satu = df.to_dict(orient='records')
    # for item in satu:
    #     if isinstance(item['KELURAHAN'],str):
    #         # print(item['KECAMATAN'])
    #         kelur.add (item['KECAMATAN'])
    #         # print(item['KELURAHAN'])
    #         # print(item['alamat'])
    # i=5
    # print(kelur)
    # print(len(kelur))
df = xls.parse('2. Batuceper', skiprows=5, index_col=None, na_values=['NA'])
print(df['ALAMAT TPS \n(MASING-MASING TPS)'])
df = df.rename(columns={"ALAMAT TPS \n(MASING-MASING TPS)": "alamat"})
df = df[df['alamat'].notnull()] 
df['alamat_tps'] = df['alamat'].str.lstrip().str.split(' ').str[1].astype('Int64')
df['nama_tps'] = df['alamat'].str.lstrip().str.split(' ').str[0] + ' ' + df['alamat'].str.lstrip().str.split(' ').str[1]
df = df.sort_values(by=['KECAMATAN','KELURAHAN','alamat_tps'],ascending = True)
df['alamat']=df['alamat'].str.split().str.join(' ')
satu = df.to_dict(orient='records')
list_all = []
set_kelurahan = set()
query_kelurahan = set()
query_tps = set()
for item in satu:
    if isinstance(item['KELURAHAN'],str) and item['alamat'] is not np.nan:
        # print(item['KECAMATAN'])
        objek = {
            'kecamatan':item['KECAMATAN'],
            'kelurahan':item['KELURAHAN'].upper(),
            'nama_tps':item['nama_tps'].upper(),
            'alamat':item['alamat'].replace("'",'').upper(),
            'nomor':item['alamat_tps']
            }
        # print(objek)
        set_kelurahan.add(item['KELURAHAN'])
        list_all.append(objek)
        
        
        # query = f"insert into pemilu.kelurahan (`nama`,`kecamatan_id`) values ('{objek['kelurahan']}',14)"
        # query_kelurahan.add(query)
        # print(query_kelurahan)
        
        query_search_kelurahan = f"select id from pemilu.kelurahan where nama='{objek['kelurahan']}'"
        mycursor.execute(query_search_kelurahan)
        id_kel = mycursor.fetchone()[0]
        query_insert_tps = f"insert into pemilu.tps (`nama`,`alamat`,`nomor`,`kelurahan_id`) values ('{objek['nama_tps']}','{objek['alamat']}','{objek['nomor']}', {id_kel});"
        query_tps.add(query_insert_tps)
        print(query_insert_tps)
 
# for x in query_kelurahan:
#     mycursor.execute(x)
#     mydb.commit()


for x in query_insert_tps:
    mycursor.execute(x)
    mydb.commit()
    
    