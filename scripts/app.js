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
    { start: "19:00", end: "20:00", slot: "F" },
    { start: "20:00", end: "21:00", slot: "G" }
  ];

  const weekdayValue = document.getElementById("weekday").value;
  const weekday = weekdayMap[weekdayValue]; // 轉換數字為中文字
  const timeValue = document.getElementById("time").value;
  const timeSlot = timeSlotMap.find(slot => timeValue >= slot.start && timeValue < slot.end)?.slot || "未知";
  const classroom = document.getElementById("classroom").value.trim();

  if (!weekdayValue || !timeValue || !classroom) {
    Swal.fire({
        icon: 'warning',
        title: '錯誤',
        text: '請填寫所有必填欄位！'
    });
    return; // 停止後續程式執行
  }

  let favorites = [];

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
      if (data.find === 1) {
        resultsDiv.innerHTML = "<ul>" + data.data.map(item => {
          return `<li>
                      教室已被使用<br>
                      ${item.course_name} ${item.teacher_name} ${item.classroom} ${item.class_time}
                  </li>`;
        }).join("") + "</ul>";
      } else if(data.find === 0) {
        // 顯示該教室其他資料
        resultsDiv.innerHTML = `
            <p>教室目前無人使用</p>
            <p>本日使用時段:</p>
            <button id="favorite-btn">
                <img src="icon/love.png" alt="加入最愛" id="favorite-icon">
            </button>
            <ul>
                ${data.data.map(item => `
                    <li>${item.course_name} ${item.teacher_name} ${item.classroom} ${item.class_time}</li>
                `).join("")}
            </ul>
        `;

        // 綁定愛心按鈕的點擊事件
        document.getElementById("favorite-btn").addEventListener("click", function () {
          const timeValue = document.getElementById("time").value.split(":").reduce((h, m) => +h + m / 60); // 轉換成小時小數

          Swal.fire({
            title: '加入我的最愛?',
            text: "這個動作無法恢復!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
          }).then((result) => {
            console.log(result)
            if(result.isConfirmed){
              if (timeValue >= 4 && timeValue < 6) {
                Swal.fire({
                  icon: 'error',
                  title: '別在卷了啦',
                  text: '請查詢其他時段',
                })
              } else if (timeValue >= 21 || timeValue < 4) {
                Swal.fire({
                  icon: 'error',
                  title: '快回家睡覺，你的肝在哀號!!!',
                  text: '請查詢其他時段',
                })
              }
              else{
                Swal.fire({
                  icon: 'success',
                  title: '成功加入',
                  text: '你可以繼續查詢',
                })
              
                // 將資料推送到最愛陣列中
                favorites.push({
                  class_time: weekday+timeSlot,
                  classroom: classroom 
                });

                console.log("已加入最愛:", favorites);  // 顯示已收藏的資料

                favorites.forEach(favorite => {
                  // 讀取已有的資料，若沒有資料則設為空陣列
                  let storedData = JSON.parse(localStorage.getItem("favorites")) || [];

                  // 將新資料添加到陣列中
                  storedData.push(favorite);

                  // 將陣列轉換回 JSON 並儲存回 localStorage
                  localStorage.setItem("favorites", JSON.stringify(storedData));

                  // 查看 localStorage
                  console.log(localStorage);
                });
              }
            }
          })
        });
      }
  })
  .catch(error => {
      console.error("錯誤:", error);
  });
});

document.getElementById("favorite-list-btn").addEventListener("click", function() {
  // 跳转到 my_favorite.html
  window.location.href = "my_favorite.html";
});
