<!DOCTYPE html>
<html lang="en" ng-app="chl">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Cheap House Listings</title>
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i|Open+Sans:300,700" rel="stylesheet">
    <link href="css/custom.css" rel="stylesheet">
    <link href="css/toaster.css" rel="stylesheet">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]><link href= "css/bootstrap-theme.css"rel= "stylesheet" >
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

  </head>

  <body ng-cloak>
    <ng-include src="'partials/nav.html'" ng-cloak></ng-include>
      <div ng-view id="ng-view" autoscroll="true" class="slide-animation">

      </div>
    <ng-include src="'partials/footer.html'"></ng-include>
  </body>
  <toaster-container toaster-options="{'time-out': 3000}"></toaster-container>
  <!-- Libs -->
  <script src="js/angular.min.js"></script>
  <script src="js/angular-route.min.js"></script>
  <script src="js/angular-animate.min.js" ></script>
  <script src="js/ng-file-upload-shim.min.js" ></script>
  <script src="js/ng-file-upload.min.js" ></script>
  <script src="js/angular-resource.min.js"></script>
  <script src="js/ngStorage.min.js"></script>
  <script src="js/toaster.js"></script>
  <script src="app/app.js"></script>
  <script src="app/data.js"></script>
  <script src="app/directives.js"></script>
  <script src="app/ctrl.js"></script>
  <script src="js/jquery-3.1.1.slim.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
</html>
