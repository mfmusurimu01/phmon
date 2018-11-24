<?php
// date_default_timezone_set('UTC+7');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "phmon";
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
try {
    $sql = "SELECT * FROM recordph";
    if ($result = $conn->query($sql)) {
        $data = array();
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        throw new Exception("Nilai pH tidak boleh kosong");
    }
} catch (exception $err) {
    echo "Error => ".$err;
}
$conn->close();


?>