document.getElementById("search-btn").addEventListener("click", function () {

  const weekdayMap = {
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "日"
  };
  const timeSlotMap = [
    { start: "06:00", end: "07:00", slot: "A" },
    { start: "07:00", end: "08:00", slot: "B" },
    { start: "08:00", end: "09:00", slot: "1" },
    { start: "09:00", end: "10:00", slot: "2" },
    { start: "10:00", end: "11:00", slot: "3" },
    { start: "11:00", end: "12:00", slot: "4" },
    { start: "12:00", end: "13:00", slot: "C" },
    { start: "13:00", end: "14:00", slot: "D" },
    { start: "14:00", end: "15:00", slot: "5" },
    { start: "15:00", end: "16:00", slot: "6" },
    { start: "16:00", end: "17:00", slot: "7" },
    { start: "17:00", end: "18:00", slot: "8" },
    { start: "18:00", end: "19:00", slot: "E" },
    { start: "19:00", end: "20:00", slot: "F" }
  ];

  const weekdayValue = document.getElementById("weekday").value;
  const weekday = weekdayMap[weekdayValue]; // 轉換數字為中文字
  const timeValue = document.getElementById("time").value;
  const timeSlot = timeSlotMap.find(slot => timeValue >= slot.start && timeValue < slot.end)?.slot || "未知";
  const classroom = document.getElementById("classroom").value.trim();


  console.log("星期:", weekday);
  console.log("時間:", timeSlot);
  console.log("教室編碼:", classroom);

  const requestData = {
    weekday: weekday,       // 星期
    timeSlot: timeSlot,     // 時間段
    classroom: classroom    // 教室編碼
  };

  // 發送 POST 請求到 Flask API
  fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)  // 將資料轉換為 JSON 字串
  })
  .then(response => response.json())  // 將返回的 JSON 資料解析為物件
  .then(data => {
      console.log(data);  // 在控制台顯示返回的資料（你可以根據需要處理它）

      // 這裡可以根據返回的資料動態顯示結果
      const resultsDiv = document.getElementById("results");
      if (data.find = 1) {
        resultsDiv.innerHTML = "<ul>" + data.map(item => {
          return `<li>
                      教室已被使用<br>
                      ${item.course_name} ${item.teacher_name} ${item.classroom} ${item.class_time}
                  </li>`;
        }).join("") + "</ul>";
      } else if(data.find = 0) {
        // 顯示該教室其他資料
        resultsDiv.innerHTML = "<ul>" + data.map(item => {
            return `<li>
                      教室目前無人使用<br>
                      ${item.course_name} ${item.teacher_name} ${item.classroom} ${item.class_time}
                    </li>`;
        }).join("") + "</ul>";
    }
  })
  .catch(error => {
      console.error("錯誤:", error);
  });
});
