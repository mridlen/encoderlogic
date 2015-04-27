<?php
//turns the directory contents of the commands directory into json format for use in importing the modules

header("Content-Type: application/json");

$dir          = "commands/";
$return_array = array();

if(is_dir($dir)){

    if($dh = opendir($dir)){
        while(($file = readdir($dh)) != false){

            if($file == "." or $file == ".."){

            } else {
                //pulls the .js off the end because requirejs needs just the file name not the extension
                $cropped = implode("", explode(".js", $file));
                $return_array[] = $cropped; // Add the file to the array
            }
        }
    }

    echo json_encode($return_array);
}
