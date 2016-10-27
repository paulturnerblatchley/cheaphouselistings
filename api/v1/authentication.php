<?php
$app->get('/session', function() {
    $db = new DbHandler();
    $session = $db->getSession();
    $response["uid"] = $session['uid'];
    $response["email"] = $session['email'];
    $response["phone"] = $session['phone'];
    $response["name"] = $session['name'];
    $response["isadmin"] = $session['isadmin'];
    $response["savedListings"] = $session['savedListings'];
    echoResponse(200, $session);
});

$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'password'),$r->customer);
    $response = array();
    $db = new DbHandler();
    $password = $r->customer->password;
    $email = $r->customer->email;
    $user = $db->getOneRecord("select uid,name,password,email,phone,savedListings,isadmin,created from customers_auth where email='$email'");
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
        $_SESSION['savedListings'] = $user['savedListings'];
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
    $savedListings = '';
    $isUserExists = $db->getOneRecord("select 1 from customers_auth where phone='$phone' or email='$email'");
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $tabble_name = "customers_auth";
        $column_names = array('phone', 'name', 'email', 'password');
        $result = $db->insertIntoTable($r->customer, $column_names, $tabble_name);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["uid"] = $result;
            if (!isset($_SESSION)) {
                session_start();
            }
            $_SESSION['uid'] = $response["uid"];
            $_SESSION['phone'] = $phone;
            $_SESSION['name'] = $name;
            $_SESSION['email'] = $email;
            $_SESSION['isadmin'] = $isadmin;
            $_SESSION['savedListings'] = $savedListings;
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

$app->post('/listings', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $address = $r->listing->address;
    $city = $r->listing->city;
    $price = $r->listing->price;
    $sqft = $r->listing->sqft;
    $lotsize = $r->listing->lotsize;
    $beds = $r->listing->beds;
    $baths = $r->listing->baths;
    $listdesc = $r->listing->listdesc;
    $images = $r->listing->images;
    $isListingExists = $db->getOneRecord("select 1 from listings where address='$address'");
    if(!$isListingExists){
        $tabble_name = "listings";
        $column_names = array('address', 'city', 'price', 'sqft', 'lotsize', 'beds', 'baths', 'listdesc', 'images');
        $result = $db->insertIntoTable($r->listing, $column_names, $tabble_name);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "New Listing created successfully";
            $response["lid"] = $result;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create listing. Please try again";
            echoResponse(201, $response);
        }
    } else {
        $response["status"] = "error";
        $response["message"] = "A listing with that address already exists!";
        echoResponse(201, $response);
    }
});

$app->get('/listings', function() {
  $db = new DbHandler();
  $listings = $db->getListings();
  echoResponse(200, $listings);
});

$app->post('/uploader',function() use ($app) {

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

$app->post('/saveListing', function() use ($app) {
    $db = new DbHandler();
    $session = $db->getSession();
    $r = json_decode($app->request->getBody());
    $listing = $r->listing->lid;
    $isListingExists = $db->getOneRecord("select 1 from customers_auth where savedListings LIKE '%$listing%'");
    if(!$isListingExists){
       $result = $db->addToRow("customers_auth", "savedListings", $listing, "uid", $session['uid']);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "Listing Added to Dashboard";
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to add listing to dashboard";
            echoResponse(201, $response);
        }
    } else {
        $response["status"] = "error";
        $response["message"] = "That listing is already saved to your Dashboard.";
        echoResponse(201, $response);
    }

});
?>
