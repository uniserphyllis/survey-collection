<?php
// 設置資料庫連線資訊
$servername = "localhost";
$username = "productwebmanager";
$password = "your_password"; // 使用實際的資料庫密碼
$dbname = "your_database";    // 資料庫名稱

// 建立資料庫連線
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連線
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 獲取 POST 的 JSON 數據
$data = json_decode(file_get_contents('php://input'), true);

// 驗證數據是否已接收
if ($data) {
    // 構建 SQL 插入語句
    $stmt = $conn->prepare("INSERT INTO your_table_name (field1, field2, field3) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $data['field1'], $data['field2'], $data['field3']); // 修改欄位名稱和數據類型

    // 執行插入並檢查是否成功
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Data saved successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save data."]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "No data received."]);
}

// 關閉資料庫連線
$conn->close();
?>
