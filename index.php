<!DOCTYPE html>
<html lang="en" ng-app="chl">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="HandheldFriendly" content="true" />
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no" />
    <title>Structured Capital</title>
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i|Open+Sans:300,400,700" rel="stylesheet">
    <link rel="stylesheet" href="css/ui-grid.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-tree/2.22.5/angular-ui-tree.min.css" />
    <link rel="stylesheet" href="http://cdn.jsdelivr.net/angular.gantt/1.3.1/angular-gantt.min.css"/>
    <link rel="stylesheet" href="http://cdn.jsdelivr.net/angular.gantt/1.3.1/angular-gantt-plugins.min.css"/>
    <link href="css/custom.css" rel="stylesheet">
    <link href="css/toaster.css" rel="stylesheet">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]><link href= "css/bootstrap-theme.css"rel= "stylesheet" >
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

  </head>

  <body class="{{bodylayout}}" ng-cloak ng-controller="ViewCtrl">
    <ng-include src="'partials/nav.html'" ng-controller="ViewCtrl"></ng-include>
      <div ng-view id="ng-view" autoscroll="true" class="" ng-controller="ViewCtrl">

      </div>
    <ng-include src="'partials/footer.html'" ng-show="isReady()" ng-controller="ViewCtrl"></ng-include>
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
  <script src="https://maps.googleapis.com/maps/api/js?&v=3&key=AIzaSyAdRvOOy-X61Hkr2CvXuEkUhgS--B2XpsU" async="" defer="defer" type="text/javascript"></script>
  <script src="js/ng-map.min.js"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-touch.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-local-storage/0.2.2/angular-local-storage.min.js"></script>
  <script src="js/moment.js"></script>
  <script src="js/draganddrop.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-tree/2.22.5/angular-ui-tree.min.js"></script>
  <script src="https://cdn.jsdelivr.net/angular.moment/1.0.1/angular-moment.min.js"></script>
  <script src="http://cdn.jsdelivr.net/angular.gantt/1.3.1/angular-gantt.min.js"></script>
  <script src="http://cdn.jsdelivr.net/angular.gantt/1.3.1/angular-gantt-plugins.min.js"></script>
  <script src="js/ui-grid.min.js"></script>
  <script src="js/toaster.js"></script>
  <script src="app/app.js"></script>
  <script src="app/data.js"></script>
  <script src="app/directives.js"></script>
  <script src="app/ctrl.js"></script>
  <script src="js/jquery.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
</html>
