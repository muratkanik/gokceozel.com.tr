<?php
if (isset($_FILES['file'])) {
    $target = basename($_FILES['file']['name']);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
        echo "Success: " . $target . " uploaded. Size: " . filesize($target);
    } else {
        echo "Error: Upload failed.";
    }
} else {
    echo '<form method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <input type="submit" value="Upload">
    </form>';
}
?>
