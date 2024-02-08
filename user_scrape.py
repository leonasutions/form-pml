import mysql.connector
import numpy as np
import warnings
warnings.filterwarnings("ignore", "\nPyarrow", DeprecationWarning)
import pandas as pd

def manual_replace(s, char, index):
    return s[:index] + char + s[index +1:]

file_excel = open('files/user.xlsx','rb')
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
df = xls.parse('Sheet1', skiprows=1, index_col=None, na_values=['NA'])

print(df.columns)
satu = df.to_dict(orient='records')
list_all = []
set_kelurahan = set()
query_kelurahan = set()
query_tps = set()
for item in satu:
    # if isinstance(item['KELURAHAN'],str) and item['alamat'] is not np.nan:
        # print(item['KECAMATAN'])
    objek = {
        'nrp':item['NRP'],
        'nama':item['NAMA'],
        'pangkat':item['PANGKAT'],
        'jabatan':item['JABATAN'],
        'penugasan':item['PENUGASAN']
        }
    # print(objek)
    # set_kelurahan.add(item['KELURAHAN'])
    # query_search_kecamatan = f"select id from pemilu.kecamatan where nama='{objek['kecamatan'].strip()}'"
    # mycursor.execute(query_search_kecamatan)
    # id_kec = mycursor.fetchone()[0]
        
        
    query = f"insert into pemilu.anggotas (`nama`,`pangkat`,`nrp`,`jabatan`,`penugasan`) values ('{objek['nama']}','{objek['pangkat']}','{objek['nrp']}','{objek['jabatan']}','{objek['penugasan']}')"
    query_app = f"insert into pemilu.user_app_iccs (`nrp`,`password`) values ('{objek['nrp']}','Polres123@')"
    query_kelurahan.add(query)
    query_tps.add(query_app)
            
# for x in query_kelurahan:
#     print(x)
#     mycursor.execute(x)
#     mydb.commit()

for y in query_tps:
    print(y)
    mycursor.execute(y)
    mydb.commit()


# for x in query_insert_tps:
#     mycursor.execute(x)
#     mydb.commit()
    
    