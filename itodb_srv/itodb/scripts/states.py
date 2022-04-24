import psycopg2
import time
conn = psycopg2.connect(database="itodb",
                        user='itoUser1',
                        password='28108213',
                        host='172.22.2.129',
                        port= '54324')
conn.autocommit = True

#
def getFullStat(conn):
  while True:
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM itodb_object")
    objectsIds = cursor.fetchall();
    res = []
    for elem in objectsIds:
      stat = getObjStat(elem[0], conn)
      res.append(stat)


def getObjStat(pk, conn):
  cursor = conn.cursor()
  cursor.execute("SELECT * FROM itodb_object WHERE id='"+str(pk)+"'")
  objNameRow = cursor.fetchall();
  objName = objNameRow[0][1]
  cursor.execute("SELECT * FROM itodb_stuff WHERE object_fact='" + str(objName) + "' OR object_target='"+str(objName)+"'")
  stuffRows = cursor.fetchall();
  cursor.execute("SELECT * FROM itodb_status WHERE connect_id='" + str(pk) + "'")
  p_data = cursor.fetchall();
  i = 0
  check = '0'
  if len(p_data) != 0:
    check = '2'
    for elem in p_data:
      cur_count = getElemStat(curRows=stuffRows, objName=objName,curType=elem[2], curModel=elem[1])
      if int(elem[3]) != int(cur_count):
        check = '1'
  sql_update_query = """Update itodb_object set state = %s where id = %s"""
  cursor.execute(sql_update_query, (check, pk))
  conn.commit()
  return check

def getElemStat(curRows, objName, curType, curModel):
  pFactNum = 0
  for row in curRows:
    if str(row[1]) == curType:
      if str(row[2]) == curModel:
        if (str(row[3]) == 'Склад Офис') or (str(row[8]) == objName):
          pFactNum += 1
  pFactNum = str(pFactNum)
  return pFactNum

try:
  getFullStat(conn)
except:
  getFullStat(conn)

# print(getObjStat(82, conn))