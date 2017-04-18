<?php
$app->get('/session', function() use ($app) {
    $db = new DbHandler();
    $session = $db->getSession();
    $response["uid"] = $session['uid'];
    $response["email"] = $session['email'];
    $response["phone"] = $session['phone'];
    $response["name"] = $session['name'];
    $response["isadmin"] = $session['isadmin'];
    $response["savedProperties"] = $session['savedProperties'];

    $table = "user_settings";
    $settings = $db->getSettings($table, $session['uid']);
    $response["settings"] = $settings;
    echoResponse(200, $response);
});

$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'password'),$r->customer);
    $response = array();
    $db = new DbHandler();
    $password = $r->customer->password;
    $email = $r->customer->email;
    $user = $db->getOneRecord("select uid,name,password,email,phone,savedProperties,isadmin,created from users where email='$email'");
    if ($user != NULL) {
        if(passwordHash::check_password($user['password'],$password)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['name'] = $user['name'];
        $response['uid'] = $user['uid'];
        $response['email'] = $user['email'];
        $response['phone'] = $user['phone'];
        $response['createdAt'] = $user['created'];
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['uid'] = $user['uid'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['phone'] = $user['phone'];
        $_SESSION['isadmin'] = $user['isadmin'];
        $_SESSION['savedProperties'] = $user['savedProperties'];
        } else {
            $response['status'] = "error";
            $response['message'] = 'Login failed. Incorrect credentials';
        }
    }else {
            $response['status'] = "error";
            $response['message'] = 'No such user is registered';
        }
    echoResponse(200, $response);
});

$app->post('/signUp', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'name', 'password'),$r->customer);
    require_once 'passwordHash.php';
    $db = new DbHandler();
    $phone = $r->customer->phone;
    $name = $r->customer->name;
    $email = $r->customer->email;
    $password = $r->customer->password;
    $isadmin = 0;
    $savedProperties = '';
    $isUserExists = $db->getOneRecord("select 1 from users where phone='$phone' or email='$email'");
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $tabble_name = "users";
        $column_names = array('phone', 'name', 'email', 'password');
        $result = $db->insertIntoTable($r->customer, $column_names, $tabble_name);
        $db->initUserSettings($result);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["uid"] = $result;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }
    }else{
        $response["status"] = "error";
        $response["message"] = "An user with the provided phone or email exists!";
        echoResponse(201, $response);
    }
});

$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});

$app->post('/properties', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $status = $r->property->status;
    $phase = $r->property->phase;
    $property_type = $r->property->property_type;
    $address = $r->property->address;
    $city = $r->property->city;
    $zip = $r->property->zip;
    $latlng = $r->property->latlng;
    $county = $r->property->county;
    $year_built = $r->property->year_built;
    $sqft = $r->property->sqft;
    $lotsize = $r->property->lotsize;
    $beds = $r->property->beds;
    $baths = $r->property->baths;
    $listdesc = $r->property->listdesc;
    $pool_spa = $r->property->pool_spa;
    $occupancy = $r->property->occupancy;
    $lockbox_combo = $r->property->lockbox_combo;
    $alarm_code = $r->property->alarm_code;
    $asset_manager = $r->property->asset_manager;
    $purchase_close_date = $r->property->purchase_close_date;
    $purchase_cost = $r->property->purchase_cost;
    $entity_vesting = $r->property->entity_vesting;
    $lender = $r->property->lender;
    $rehab_estimate = $r->property->rehab_estimate;
    $arv = $r->property->arv;
    $is_listed = $r->property->is_listed;
    $listing_date = $r->property->listing_date;
    $list_price = $r->property->list_price;
    $escrow_price = $r->property->escrow_price;
    $sale_close_date = $r->property->sale_close_date;
    $images = $r->property->images;
    $isPropertyExists = $db->getOneRecord("select 1 from properties where address='$address'");
    if(!$isPropertyExists){
        $tabble_name = "properties";
        $column_names = array('status', 'phase', 'property_type', 'address', 'city', 'zip', 'latlng', 'county', 'year_built', 'sqft', 'lotsize', 'beds', 'baths', 'listdesc', 'pool_spa', 'occupancy', 'lockbox_combo', 'alarm_code', 'asset_manager', 'purchase_close_date', 'purchase_cost', 'entity_vesting', 'lender', 'rehab_estimate', 'arv', 'is_listed', 'listing_date', 'list_price', 'escrow_price', 'sale_close_date');
        $result = $db->insertIntoTable($r->property, $column_names, $tabble_name);
        $db->initRehabTable($result);
        if (count($images)) {
             $db->insertPropertyImages($images, $result);
        }
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "New Property created successfully";
            $response["pid"] = $result;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create property. Please try again";
            echoResponse(201, $response);
        }
    } else {
        $response["status"] = "error";
        $response["message"] = "A property with that address already exists!";
        echoResponse(201, $response);
    }
});

$app->post('/changeSettings', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $table = "user_settings";
    $uid = $r->change->uid;
    $where = 'uid';
    $column = $r->change->field;
    $visible = $r->change->visible;
    $result = $db->changeSettings($uid,$where, $column, $visible, $table);
    if ($result != NULL) {
        $response["status"] = "success";
        $response["message"] = "Setting changed.";
        echoResponse(200, $response);
    } else {
        $response["status"] = "error";
        $response["message"] = "Couldn't change setting. Please refresh and try again.";
        echoResponse(201, $response);
    }
});

$app->get('/properties', function() use ($app) {
  $db = new DbHandler();
  $table = "properties";
  $properties = $db->getTable($table);
  echoResponse(200, $properties);
});

$app->get('/propertyImages', function() use ($app) {
  $db = new DbHandler();
  $images = $db->getPropertyImages();
  echoResponse(200, $images);
});

$app->post('/uploader', function() use ($app) {

    $imageinfo = getimagesize($_FILES['img']['tmp_name']);
    if($imageinfo['mime'] != 'image/gif' && $imageinfo['mime'] != 'image/jpeg' && $imageinfo['mime'] != 'image/png') {
        $imgMsg = "Sorry, we only accept JPEG, PNG, or GIF images";
        echoResponse(201, $imgMsg);
        exit;
    }
    $uploaddir = 'uploads/';
    $uploadfile = $uploaddir . basename($_FILES['img']['name']);
    if (move_uploaded_file($_FILES['img']['tmp_name'], $uploadfile)) {
        echo "File is valid, and was successfully uploaded";
    } else {
        echo "File uploading failed";
    }
});

$app->post('/saveProperty', function() use ($app) {
    $db = new DbHandler();
    $session = $db->getSession();
    $r = json_decode($app->request->getBody());
    $property = $r->property->pid;
    $isPropertyExists = $db->getOneRecord("select 1 from users where savedProperties LIKE '%$property%'");
    if(!$isPropertyExists){
       $result = $db->addToRow("users", "savedProperties", $property, "uid", $session['uid']);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "Property Added to Dashboard";
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to add property to dashboard";
            echoResponse(201, $response);
        }
    } else {
        $response["status"] = "error";
        $response["message"] = "That property is already saved to your Dashboard.";
        echoResponse(201, $response);
    }
});

$app->post('/editProperty', function() use ($app) {
  $db = new DbHandler();
  $r = json_decode($app->request->getBody());
  $pid = $r->property->pid;
  if ($r->property->images) {
    $images = $r->property->images;
    $db->insertPropertyImages($images, $pid);
  }
  $tabble_name = "properties";
  $column_names = array(
    'status' => $r->property->status,
    'phase' => $r->property->phase,
    'property_type' => $r->property->property_type,
    'address' => $r->property->address,
    'city' => $r->property->city,
    'zip' => $r->property->zip,
    'latlng' => $r->property->latlng,
    'county' => $r->property->county,
    'year_built' => $r->property->year_built,
    'sqft' => $r->property->sqft,
    'lotsize' => $r->property->lotsize,
    'beds' => $r->property->beds,
    'baths' => $r->property->baths,
    'listdesc' => $r->property->listdesc,
    'pool_spa' => $r->property->pool_spa,
    'occupancy' => $r->property->occupancy,
    'lockbox_combo' => $r->property->lockbox_combo,
    'alarm_code' => $r->property->alarm_code,
    'asset_manager' => $r->property->asset_manager,
    'purchase_close_date' => $r->property->purchase_close_date,
    'purchase_cost' => $r->property->purchase_cost,
    'entity_vesting' => $r->property->entity_vesting,
    'lender' => $r->property->lender,
    'rehab_estimate' => $r->property->rehab_estimate,
    'arv' => $r->property->arv,
    'is_listed' => $r->property->is_listed,
    'listing_date' => $r->property->listing_date,
    'list_price' => $r->property->list_price,
    'escrow_price' => $r->property->escrow_price,
    'sale_close_date' => $r->property->sale_close_date
  );
  foreach ($column_names as $key => $value) {
    $result = $db->updateRow($tabble_name, $key, $value, 'pid', $pid);
  }
  if ($result != NULL) {
      $response["status"] = "success";
      $response["message"] = "Property was updated";
      echoResponse(200, $response);
  } else {
      $response["status"] = "error";
      $response["message"] = "Failed to update property";
      echoResponse(201, $response);
  }
});

$app->post('/deleteImage', function() use ($app) {
  $db = new DbHandler();
  $img = json_decode($app->request->getBody());
  $db->removeImage($img->img);
  $file_to_delete = "uploads/".$img->img;
  $result = unlink($file_to_delete);
  if ($result != NULL) {
    $response["status"] = "success";
    $response["message"] = "Image Deleted";
    echoResponse(200, $response);
  } else {
    $response["status"] = "error";
    $response["message"] = "Image failed to delete. Please try again";
    echoResponse(201, $response);
  }

});

$app->post('/deleteProperty', function() use ($app){
  $db = new DbHandler();
  $r = json_decode($app->request->getBody());
  $pid = $r->property->pid;
  $images = $r->property->images;
  for ($i = 0; $i < count($images); $i++) {
    $db->removeImage($images[$i]);
  }
  $result = $db->removeRow($pid);
  if ($result != NULL) {
    $response["status"] = "success";
    $response["message"] = "Property has been removed from the database";
    echoResponse(200, $response);
  } else {
    $response["status"] = "error";
    $response["message"] = "Property failed to delete. Please try again.";
    echoResponse(201, $response);
  }
});

// REHABS
$app->get('/rehab', function() use ($app) {
  $db = new DbHandler();
  $rehabs = $db->getJoinedRehabTable();
  echoResponse(200, $rehabs);
});


$app->post('/updateRehab', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $table = $r->change->table;
    $rehab_id = $r->change->rehab_id;
    $where = "rehab_id";
    $column = $r->change->column;
    $value = $r->change->value;
    $result = $db->changeSettings($rehab_id, $where, $column, $value, $table);
    if ($result != NULL) {
        $response["status"] = "success";
        $response["message"] = "Rehab updated.";
        echoResponse(200, $response);
    } else {
        $response["status"] = "error";
        $response["message"] = "Couldn't update rehab. Please refresh and try again.";
        echoResponse(201, $response);
    }
});


// property inquiry form post
$app->post('/formSend', function() use ($app) {
    $to = "paulturnerblatchley@gmail.com";
    $r = json_decode($app->request->getBody());
    $fromName  = $r->formData->name;
    $fromEmail = $r->formData->email;
    $subject   = "CHL Inquiry about:" . $r->formData->property;
    $message   = $r->formData->message;
    $headers = 'From: '. $fromName . '<'. $fromEmail . '>' . "\r\n";
    $headers .= 'Reply-To: '. $fromName . '<'. $fromEmail . '>' . "\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();
    $result = mail($to, $subject, $message, $headers);
    if ($result) {
        $response["status"] = "success";
        $response["message"] = "Message Sent";
        echoResponse(200, $response);
    } else {
        $response["status"] = "error";
        $response["message"] = "Message failed to send. Please try again.";
        $response["to"] = $to;
        $response["fromName"] = $fromName;
        $response["fromEmail"] = $fromEmail;
        $response["subject"] = $subject;
        $response["test"] = $message;
        $response["headers"] = $headers;
        $response["result"] = $result;
        echoResponse(201, $response);
    }
});

$app->post('/comments', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $comment = $r->comment->comment;
    $property_pid = $r->comment->property_id;
    $user_id = $r->comment->user_id;
    $tabble_name = "comments";
    $column_names = array('comment', 'properties_pid', 'users_uid');
    $result = $db->insertComment($r->comment, $column_names, $tabble_name);
    if ($result != NULL) {
        $response["status"] = "success";
        $response["message"] = "Your comment has been added";
        $response["pid"] = $result;
        echoResponse(200, $response);
    } else {
        $response["status"] = "error";
        $response["message"] = "Failed to post comment. Please try again";
        echoResponse(201, $response);
    }
});

$app->get('/comments', function() use ($app) {
  $db = new DbHandler();
  $table = "comments";
  $comments = $db->getTable($table);
  echoResponse(200, $comments);
});

$app->get('/users', function() use ($app) {
  $db = new DbHandler();
  $table = "users";
  $users = $db->getTable($table);
  echoResponse(200, $users);
});
?>
