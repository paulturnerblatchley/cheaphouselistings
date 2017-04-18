<?php

class DbHandler {

    private $conn;

    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }
    /**
     * Fetching single record
     */
    public function getOneRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
        return $result = $r->fetch_assoc();
    }
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) {

        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values.'"'.$$desired_key.'",';
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }

    /**
     * Initialize User Settings
     ****/
    public function initUserSettings($uid) {
        $query = "INSERT INTO user_settings (uid) VALUES(".$uid.")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }

    /**
     * Initialize Rehab Tables
     ****/
    public function initRehabTable($pid) {
        $query = "INSERT INTO rehabs (pid) VALUES(" . $pid . ")";;
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }

    public function changeSettings($uid,$where,$column,$visible,$table) {
        $query = "UPDATE " . $table . " SET `" . $column . "`='" . $visible . "' WHERE ". $where . " = " . $uid;
        return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }


     /**
     * Creating new record
     */
    public function insertComment($obj, $column_names, $table_name) {
        $c = (array) $obj;
        $values = "'" . implode ( "', '", $c ) . "'";
        $columns = implode ( ", ", $column_names );
        $query = "INSERT INTO ".$table_name."(".$columns.") VALUES(".$values.")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }

    /**
    *   Add Images to Image Table
    **/

    public function insertPropertyImages($images, $pid) {
        if (gettype($images) == 'array') {
            // Do Nothing
        } else {
            $c = explode(",", $images);
            $table_name = 'images';
            for ($i=0; $i < count($c); $i++) { 
                $query = "select 1 from images where image_name='".$c[$i]."'";
                $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
                $isImageExists = $r->fetch_assoc();
                if(!$isImageExists) {
                    $query = "INSERT INTO " . $table_name . "(image_name,pid) VALUES ('". $c[$i] ."',".$pid.")" ;
                    $this->conn->query($query);
                }
            }
        }
    }

    public function getSavedProperties($uid) {
      $query = "select savedProperties from users where uid='$uid'";
      return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    public function getSession(){
        if (!isset($_SESSION)) {
            session_start();
        }
        $sess = array();
        if(isset($_SESSION['uid']))
        {
            $uid = $_SESSION['uid'];
            $sess["uid"] = $_SESSION['uid'];
            $sess["name"] = $_SESSION['name'];
            $sess["email"] = $_SESSION['email'];
            $sess["phone"] = $_SESSION['phone'];
            $sess["isadmin"] = $_SESSION['isadmin'];
            $r = $this->conn->query("select savedProperties from users where uid=". $uid);
            $row = $r->fetch_assoc();
            foreach( $row AS $value) {
              $sess["savedProperties"] = $value;
            }
        }
        else
        {
            $sess["uid"] = '';
            $sess["name"] = 'Guest';
            $sess["email"] = '';
            $sess["phone"] = '';
            $sess["isadmin"] = NULL;
            $sess["savedProperties"] = NULL;
        }
        return $sess;
    }

    public function getPropertyImages() {
        $r = $this->conn->query("SELECT images.pid, images.image_name FROM images");
        $images = array();
        while($row = $r->fetch_assoc()) {
            array_push($images, $row);
        }
        return $images;
    }

    public function getTable($table) {
        $r = $this->conn->query("SELECT * FROM `".$table."`");
        $results = array();
        while ($row = $r->fetch_assoc()) {
          array_push($results, $row);
        }
        return $results;
    }

    public function getJoinedRehabTable() {
        $r = $this->conn->query("SELECT * FROM rehabs 
            JOIN bath ON bath.rehab_id = rehabs.rehab_id 
            JOIN demo ON demo.rehab_id = rehabs.rehab_id 
            JOIN drywall ON drywall.rehab_id = rehabs.rehab_id 
            JOIN electrical ON electrical.rehab_id = rehabs.rehab_id 
            JOIN ext_paint ON ext_paint.rehab_id = rehabs.rehab_id 
            JOIN fixtures ON fixtures.rehab_id = rehabs.rehab_id 
            JOIN flooring ON flooring.rehab_id = rehabs.rehab_id
            JOIN framing ON framing.rehab_id = rehabs.rehab_id 
            JOIN garage_door ON garage_door.rehab_id = rehabs.rehab_id 
            JOIN hardscape ON hardscape.rehab_id = rehabs.rehab_id 
            JOIN hvac ON hvac.rehab_id = rehabs.rehab_id 
            JOIN int_paint ON int_paint.rehab_id = rehabs.rehab_id 
            JOIN kitchen ON kitchen.rehab_id = rehabs.rehab_id 
            JOIN landscaping ON landscaping.rehab_id = rehabs.rehab_id 
            JOIN plumbing ON plumbing.rehab_id = rehabs.rehab_id 
            JOIN pool_spa ON pool_spa.rehab_id = rehabs.rehab_id 
            JOIN roof ON roof.rehab_id = rehabs.rehab_id 
            JOIN sales_clean ON sales_clean.rehab_id = rehabs.rehab_id 
            JOIN stucco ON stucco.rehab_id = rehabs.rehab_id 
            JOIN windows ON windows.rehab_id = rehabs.rehab_id");
        $results = array();
        while ($row = $r->fetch_assoc()) {
          array_push($results, $row);
        }
        return $results;
    }

    public function getSettings($table, $uid) {
        $r = $this->conn->query("SELECT * FROM `". $table . "` WHERE uid = " . $uid);
        $results = array();
        while ($row = $r->fetch_assoc()) {
          array_push($results, $row);
        }
        return $results;
    }

    public function updateRow($table_name,$column_name,$column_value,$id,$id_value) {
        $query = "UPDATE " . $table_name . " SET " . $column_name . "='" . $column_value . "' WHERE " . $id . "=" . $id_value;
        return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    public function addToRow($table_name,$column_name,$column_value,$id,$id_value) {
        // UPDATE `users` SET savedProperties = CONCAT_WS(',',savedProperties,'3') WHERE uid='id';
        $query = "UPDATE " . $table_name . " SET " . $column_name . "= CONCAT_WS(','," . $column_name . ",'" . $column_value . "') WHERE " . $id . "=" . $id_value;
        return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    public function removeImage($img) {
      $query = "DELETE FROM images WHERE image_name = '". $img ."' LIMIT 1";
      return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    public function removeRow($pid) {
      $query = "DELETE FROM properties WHERE pid = ".$pid." LIMIT 1";
      return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    public function destroySession(){
        if (!isset($_SESSION)) {
        session_start();
        }
        if(isSet($_SESSION['uid']))
        {
            unset($_SESSION['uid']);
            unset($_SESSION['name']);
            unset($_SESSION['email']);
            unset($_SESSION['phone']);
            unset($_SESSION['isadmin']);
            unset($_SESSION['savedProperties']);
            $info='info';
            if(isSet($_COOKIE[$info]))
            {
                setcookie ($info, '', time() - $cookie_time);
            }
            $msg="Logged Out Successfully...";
        }
        else
        {
            $msg = "Not logged in...";
        }
        return $msg;
    }

}

?>
