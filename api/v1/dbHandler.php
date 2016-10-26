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

    public function getSavedListings($uid) {
      $query = "select savedListings from customers_auth where uid='$uid'";
      return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    public function getSession(){
        if (!isset($_SESSION)) {
            session_start();
        }
        $sess = array();
        if(isset($_SESSION['uid']))
        {
            $sess["uid"] = $_SESSION['uid'];
            $sess["name"] = $_SESSION['name'];
            $sess["email"] = $_SESSION['email'];
            $sess["isadmin"] = $_SESSION['isadmin'];
            $r = $this->conn->query("select savedListings from customers_auth where uid=1");
            $row = $r->fetch_assoc();
            foreach( $row AS $value) {
              $sess["savedListings"] = $value;
            }
        }
        else
        {
            $sess["uid"] = '';
            $sess["name"] = 'Guest';
            $sess["email"] = '';
            $sess["isadmin"] = NULL;
            $sess["savedListings"] = NULL;
        }
        return $sess;
    }

    public function getListings(){
      $r = $this->conn->query("SELECT * FROM `listings`");
      return $result = $r->fetch_all(MYSQLI_ASSOC);
    }

    public function updateRow($table_name,$column_name,$column_value,$id,$id_value) {
        $query = "UPDATE " . $table_name . " SET " . $column_name . "='" . $column_value . "' WHERE " . $id . "=" . $id_value;
        return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    public function addToRow($table_name,$column_name,$column_value,$id,$id_value) {
        // UPDATE `customers_auth` SET savedListings = CONCAT_WS(',',savedListings,'3') WHERE uid='id';
        $query = "UPDATE " . $table_name . " SET " . $column_name . "= CONCAT_WS(','," . $column_name . ", '" . $column_value . "') WHERE " . $id . "=" . $id_value;
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
            unset($_SESSION['isadmin']);
            unset($_SESSION['savedListings']);
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
