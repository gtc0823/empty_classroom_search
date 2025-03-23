window.onload = () => {
  // 讀取存儲在 localStorage 中的 'favorites' 資料
  const favorites = JSON.parse(localStorage.getItem("favorites"));

  // 確保獲取到有效的資料
  if (favorites) {
      // 遍歷 favorites 陣列中的每一項
      favorites.forEach((favorite, index) => {
          // 根據 class_time (e.g., 一A, 二B) 查找對應的 id
          const cellId = `cell-${favorite.class_time}`;
          
          const targetCell = document.getElementById(cellId);  // 根據 ID 查找對應的格子
          
          if (targetCell) {
              // 創建一個新的按鈕元素
              const button = document.createElement("button");
              button.innerText = `教室 ${favorite.classroom}`;  // 設定按鈕文字為 classroom
              button.style.width = "100%";
              button.style.height = "100%";
              button.classList.add("custom-button");

              // 設置按鈕的事件處理程序（刪除資料和按鈕）
              button.onclick = function() {
                Swal.fire({
                  title: '確定要刪除?',
                  text: "這個動作無法恢復!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: '確定',
                  cancelButtonText: '取消',
                  confirmButtonColor: '#4CAF50',
                  cancelButtonColor: '#F44336',
                }).then((result) => {
                    if(result.isConfirmed){
                        Swal.fire({
                            icon: 'success',
                            title: '成功刪除',
                            text: '你可以繼續選擇其他教室',
                        })
                    favorites.splice(index, 1);  // 從陣列中移除該資料
                    localStorage.setItem("favorites", JSON.stringify(favorites));  // 更新 localStorage
                      
                    // 移除按鈕從 DOM 中
                    targetCell.removeChild(button);
                  }
                });
                 
                  
                  
                  
              };
              
              // 把按鈕添加到目標格子中
              targetCell.appendChild(button);
          }
      });
  }
};

document.getElementById("back-btn").addEventListener("click", function() {
  // 跳转到 my_favorite.html
  window.location.href = "index.html";  
});