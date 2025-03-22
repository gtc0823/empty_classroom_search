from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # 允許跨來源請求

# 設定 MySQL 連線
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="ryan0823",
    database="nccu_classes"
)

cursor = db.cursor(dictionary=True)  # 讓查詢結果以字典格式返回

@app.route("/search", methods=["POST"])
def search_classroom():

    data = request.json
    weekday = data.get("weekday")
    time_slot = data.get("timeSlot")
    classroom = data.get("classroom", "").strip()

    # 查詢條件，使用 LIKE 來模糊匹配 class_time 和 classroom
    query = "SELECT * FROM classrooms WHERE class_time LIKE %s AND class_time LIKE %s"
    values = [f"%{weekday}%",f"%{time_slot}%"]  # 使用 LIKE 來匹配 class_time 中包含 weekday 和 time_slot 的部分
    # 如果提供了 classroom，也使用 LIKE 進行模糊匹配
    if classroom:
        query += " AND classroom LIKE %s"
        values.append(f"%{classroom}%")
        print(query)
        print(values)

    cursor.execute(query, values)
    results = cursor.fetchall() 
    if results:
        response = {
            "data": results,
            "find": 1  # 找到資料
        }
    else:
        # 如果沒有找到資料，查詢該天所有資料並設置 find = 0
        query = "SELECT * FROM classrooms WHERE class_time LIKE %s"
        values = [f"%{weekday}%"]  # 只根據 weekday 查詢，返回該天的所有資料
        if classroom:
            query += " AND classroom LIKE %s"
            values.append(f"%{classroom}%")

        cursor.execute(query, values)
        results = cursor.fetchall()
        print("Alternative results:", results)

        response = {
            "data": results,
            "find": 0  # 沒有找到對應資料
        }

    #回傳資料給JS
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
