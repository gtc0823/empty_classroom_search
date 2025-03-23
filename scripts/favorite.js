window.onload = () => {
  // 讀取存儲在 localStorage 中的 id
  const cellId = localStorage.getItem("cellData");
  
  // 確保獲取到了有效的 id
  if (cellId) {
      const targetCell = document.getElementById(cellId);  // 根據 ID 查找對應的元素
      
      if (targetCell) {
          // 創建一個新的按鈕元素
          const button = document.createElement("button");
          button.innerText = "點我!";
          button.style.width = "210px";
          button.style.height = "60px";
          
          // 可以設置按鈕的事件處理程序
          button.onclick = function() {
              alert("按鈕被點擊了！");
          };
          
          // 把按鈕添加到目標元素中
          targetCell.appendChild(button);
      }
  }
};
