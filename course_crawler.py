import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

# 啟動 WebDriver
service = Service("chromedriver.exe")  
driver = webdriver.Chrome(service=service)
driver.get('https://qrysub.nccu.edu.tw/')

# 點擊查詢按鈕
search_button = driver.find_element(By.XPATH, '//button[contains(@class, "btn-primary") and contains(text(), "查詢")]')
search_button.click()

# 等待數據載入
time.sleep(3)

# 找到表格 tbody
bodies = driver.find_elements(By.XPATH, "//table/tbody")

# 遍歷 tbody
for tbody in bodies:
    rows = tbody.find_elements(By.XPATH, ".//tr")
    for row in rows:
        columns = row.find_elements(By.XPATH, ".//td[4] | .//td[5] | .//td[6] | .//td[7] | .//td[13]")
        column_texts = [column.text.strip() for column in columns]
        print(column_texts)

        if len(columns) > 0:
            last_column = columns[-1]  # 取得最後一個 td
            
            # 滾動到 row 可見位置，並略微往下調整以避免遮擋
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'}); window.scrollBy(0, -50);", row)
            time.sleep(1)  # 等待滾動完成

            # 找到按鈕並點擊
            info_button = last_column.find_element(By.XPATH, ".//button[@data-target='#exampleModal_2']")
            info_button.click()

            # 等待資訊加載並獲取內容
            time.sleep(1)
            more_info = driver.find_element(By.CSS_SELECTOR, "body > ngb-modal-window > div > div > div.modal-body > div.modal-more-info")
            info = more_info.find_element(By.XPATH, './/p[4]')
            print(info.text.strip())

            # 關閉彈出視窗
            close_button = driver.find_element(By.CSS_SELECTOR, "body > ngb-modal-window > div > div > div.modal-header > button")
            close_button.click()
            time.sleep(1)

# 關閉瀏覽器
driver.quit()
