<?php
$filename = "calendar.ics";
unlink($filename);
$file = "YOUR_CALENDAR_URL"; 
file_put_contents($filename, fopen($file, 'r'));
echo $filename;
exit();
?>
