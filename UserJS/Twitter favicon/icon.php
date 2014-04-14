<?php
/*  icon.php - Notification icon digit generator.
 *  Written by espenoh (espen@zawiarr.com).
 *  First version: 1.0 2012-12-06 22:57
 *  Updated:       1.1 2012-12-10 00:25
 */

$im = imagecreatefrompng("favicon.png");

imagealphablending( $im, false );
imagesavealpha( $im, true );

if(isset($_GET['nr']) && !empty($_GET['nr'])) {
    $string = $_GET['nr'];
    if ((!is_numeric($string)) or (intval($string) > 99)) {
      $string = '?';
    }
} else {
    $string = '';
}
 
// Font/outline colors
$white = imagecolorallocate($im, 255, 255, 255);
$black = imagecolorallocate($im, 0, 0, 0);

// Draw font outline using 4 +/-1 draw calls with a bgcolor.
function text_outline(&$image, $size, $x, $y, $text, &$color){
  imagechar($image, $size, $x+1, $y, $text, $color);
  imagechar($image, $size, $x-1, $y, $text, $color);
  imagechar($image, $size, $x, $y+1, $text, $color);
  imagechar($image, $size, $x, $y-1, $text, $color);
}

// Check if we need to draw one or two digits.
if (intval($string) < 10) {
  text_outline($im, 2, 5, 1, $string, $black);      // Digit 1
  imagechar   ($im, 2, 5, 1, $string, $white);

} else {
  text_outline($im, 2, 2, 1, $string, $black);      // Digit 1
  imagechar   ($im, 2, 2, 1, $string, $white);
  
  text_outline($im, 2, 8, 1, $string[1], $black);   // Digit 2
  imagechar   ($im, 2, 8, 1, $string[1], $white);
  
}


if(isset($_GET['v'])) { // Check for view mode
  header('Content-type: image/png');
  imagepng($im);
  
} else { // Generate base64 coded ajax reply
  header('Access-Control-Allow-Origin: *'); 
  
  // Some cheeky shit since GD is a bitch!
  ob_start();
  imagepng($im);
  $imdata = ob_get_clean();

  print 'data:image/png;base64,' . base64_encode($imdata);
}
 
?>