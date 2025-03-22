import time
import mysql.connector
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

db = mysql.connector.connect(
    host= "localhost",
    user= "root",
    password= "ryan0823",
    database="nccu_classes"  # 資料庫名稱
)
cursor = db.cursor()

# 啟動 WebDriver
service = Service("chromedriver.exe")  
driver = webdriver.Chrome(service=service)
driver.maximize_window()
driver.get('https://qrysub.nccu.edu.tw/')

# 點擊查詢按鈕
search_button = driver.find_element(By.XPATH, '//button[contains(@class, "btn-primary") and contains(text(), "查詢")]')
search_button.click()

# 等待數據載入
time.sleep(0.3)

while True:
  # 找到表格 tbody
  bodies = driver.find_elements(By.XPATH, "//table/tbody")

  # 遍歷 tbody
  for tbody in bodies:
      rows = tbody.find_elements(By.XPATH, ".//tr")
      for row in rows:
          columns = row.find_elements(By.XPATH, ".//td[4] | .//td[5] | .//td[6] | .//td[7] | .//td[13]")
          column_texts = [column.text.strip() for column in columns]

          if len(columns) > 0:
              last_column = columns[-1]  # 取得最後一個 td

              # 如果頁面還沒到底，則滾動到 row 可見位置
              driver.execute_script("arguments[0].scrollIntoView({block: 'center'}); window.scrollBy(0, -70);", row)
              time.sleep(0.1)  # 等待滾動完成
              
              # 找到按鈕並點擊
              info_button = last_column.find_element(By.XPATH, ".//button[@data-target='#exampleModal_2']")
              info_button.click()

              # 等待資訊加載並獲取內容
              time.sleep(0.1)
              more_info = driver.find_element(By.CSS_SELECTOR, "body > ngb-modal-window > div > div > div.modal-body > div.modal-more-info")
              info = more_info.find_element(By.XPATH, './/p[4]')

              classroom_text = info.text.strip().replace("上課教室：", "").strip()
              column_texts[4] = classroom_text

              # 構建 INSERT INTO 查詢
              insert_query = """
                  INSERT INTO classrooms (course_name, teacher_name, credit, class_time, classroom)
                  VALUES (%s, %s, %s, %s, %s)
              """
              # 假設 column_texts 中的順序是：
              # [course_name, teacher_name, credit, class_time, classroom]
              data_to_insert = (column_texts[0], column_texts[1], column_texts[2], column_texts[3], column_texts[4])

              # 執行 INSERT 查詢
              cursor.execute(insert_query, data_to_insert)

              # 提交更改到資料庫
              db.commit()

              # 關閉彈出視窗
              close_button = driver.find_element(By.CSS_SELECTOR, "body > ngb-modal-window > div > div > div.modal-header > button")
              close_button.click()

  # 嘗試點擊「下一頁」按鈕
  try:
    next_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button.mat-mdc-paginator-navigation-next"))
    )
    print('success')
    
    next_button.click()
    time.sleep(0.3)  # 等待新頁面加載

    # 滾動到最頂端
    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(0.1)

  except Exception as e:
    print("下一頁按鈕未找到，結束爬蟲", e)
    break


# 關閉瀏覽器
driver.quit()
