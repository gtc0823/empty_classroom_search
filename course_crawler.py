import selenium
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By


service = Service("chromedriver.exe")  # 請填入 chromedriver.exe 的完整路徑
driver = webdriver.Chrome(service=service)
driver.get('https://qrysub.nccu.edu.tw/')

search_button = driver.find_element(By.XPATH, '//button[contains(@class, "btn-primary") and contains(text(), "查詢")]')
search_button.click()

# **讀取表頭**
try:
    thead = driver.find_element(By.XPATH, "//table/thead")
    headers = [th.get_attribute("innerText").strip() for th in thead.find_elements(By.TAG_NAME, "th")]
    print("表頭:", headers[3:7])
except Exception as e:
    print("表頭未找到:", e)

# **3. 讀取表格內容**
# 找到 tbody
body = driver.find_elements(By.XPATH, "//table/tbody")

time.sleep(3)

# 遍歷每一個 tbody
for tbody in body:
    # 在每個 tbody 內找到所有 tr 元素
  rows = tbody.find_elements(By.XPATH, ".//tr")
  for row in rows:
    columns = row.find_elements(By.XPATH, ".//td[4] | .//td[5] | .//td[6] | .//td[7] | .//td[13]")
    # 在每一個 tr 內找到所有 td 元素
    column_texts = [column.text.strip() for column in columns]
    print(column_texts)

    if len(columns) > 0:
      last_column = columns[-1]  # 取得最後一個 td
      
      # 查找最後一個 td 內的按鈕
      info_button = last_column.find_element(By.XPATH, ".//button[@data-target='#exampleModal_2']")
      time.sleep(1)
      info_button.click()
      # 等待信息並打印
      more_info = driver.find_element(By.CSS_SELECTOR, "body > ngb-modal-window > div > div > div.modal-body > div.modal-more-info")
      info = more_info.find_element(By.XPATH, './/p[4]')
      print(info.text.strip())

      close_button = driver.find_element(By.CSS_SELECTOR, "body > ngb-modal-window > div > div > div.modal-header > button")
      close_button.click()

      time.sleep(1)




    
            

# 關閉瀏覽器
driver.quit()
