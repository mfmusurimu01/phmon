<?php
date_default_timezone_set("Asia/Jakarta");
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
    if (isset($_POST['nilai_ph'])) {
        $tanggal = date("Y-m-d");
        $jam = date("h:i:s");
        $nilai_ph = $_POST['nilai_ph'];
        $sql = "INSERT INTO recordph (tanggal, jam, nilai_ph) VALUES ('$tanggal', '$jam', '$nilai_ph')";
        if ($conn->query($sql) === TRUE) {
            $result = "New record created successfully";
            echo $result;
        } else {
            $result = "Error: " . $sql . "<br>" . $conn->error;
            throw new Exception($result);
        }
    }else {
        throw new Exception("Nilai pH tidak boleh kosong");
    }
} catch (exception $err) {
    echo "Error => ".$err;
}
$conn->close();


?>