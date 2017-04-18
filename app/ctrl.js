app.controller('ViewCtrl', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        $rootScope.ready = '1';
    });
    $scope.isReady = function() {
        if ($rootScope.ready == '1') {
          return true;
        } else {
          return false;
        }
    }
});

// user auth controller
app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, auth) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        auth.post('login', {
            customer: customer
        }).then(function (results) {
            auth.toast(results);
            if (results.status == "success") {
                $location.path('home');
            }
        });
    };
    $scope.isLoggedIn = function() {
        $("#form-loading").css("display", "block");
        if ($rootScope.authenticated) {
            $("#form-loading").css("display", "none");
            return true;
        } else {
            $("#form-loading").css("display", "none");
            return false;
        }
    };

    $scope.isAdmin = function() {
        if ($rootScope.isadmin == 1) {
            return true;
        } else {
            return false;
        }
    };

    $scope.signup = {email:'',password:'',name:'',phone:''};
    $scope.signUp = function (customer) {
        auth.post('signUp', {
            customer: customer
        }).then(function (results) {
            auth.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.logout = function () {
        auth.get('logout').then(function (results) {
            auth.toast(results);
            $location.path('login');
        });
    };
    $scope.hideMenu = function() {
      var nav = document.getElementById("navbar");
      if (nav.className == "navbar-collapse collapse") {
          nav.className = "navbar-collapse collapse in";
      } else {
        nav.className = "navbar-collapse collapse";
      }
    };
});

// property controller
app.controller('PropertyCtrl', function($scope, $route, $location, $http, $localStorage, $sessionStorage, auth, $timeout, properties, singleproperty, searchProperties, savedProperties, Data, $rootScope, uiGridConstants, localStorageService) {
    // DEFINITIONS
    $scope.properties = properties.properties;
    $scope.s = singleproperty.property;
    $scope.searchRes = searchProperties.properties;
    $scope.saved = savedProperties.properties;
    $scope.tableData = $scope.properties;


    for ( i in $scope.tableData) {
        $scope.tableData[i]["#"] = parseInt(i) + 1;
    }

    $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        if( col.filters[0].term ){
            return 'header-filtered';
        } else {
            return '';
        }
    };
    
    // set columns based on user settings
    if ($rootScope.settings) {
        for (i in $rootScope.settings[0]) {
            if ($rootScope.settings[0][i] == "0") {
                $rootScope.settings[0][i] = false;
            } else {
                $rootScope.settings[0][i] = true;
            }
        }

        $scope.columns = [
            { field: '#', displayName: '#', visible: $rootScope.settings[0]["#"], type: 'number', width: '3%', enableFiltering: false}, 
            { field: 'pid', displayName: 'PID', visible: $rootScope.settings[0]["pid"], type: 'number', width: '4%', enableFiltering: false, cellTemplate: '<div id="row{{grid.getCellValue(row, col)}}" class="ui-grid-cell-contents {{grid.getCellValue(row, col)}}" >{{grid.getCellValue(row, col)}}</div>'  }, 
            { field: 'phase', displayName: 'Phase', visible: $rootScope.settings[0]["phase"], cellTemplate: '<div class="ui-grid-cell-contents {{grid.getCellValue(row, col)}}" >{{grid.getCellValue(row, col)}}</div>', width: '8%',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ 
                        { value: 'Purchase', label: 'Purchase' }, 
                        { value: 'Relocation', label: 'Relocation' }, 
                        { value: 'Eviction', label: 'Eviction'}, 
                        { value: 'Plan Check', label: 'Plan Check' }, 
                        { value: 'Rehab', label: 'Rehab' }, 
                        { value: 'Listed', label: 'Listed' },
                        { value: 'Hold', label: 'Hold' },
                        { value: 'Escrow', label: 'Escrow' },
                        { value: 'Sold', label: 'Sold' } 
                    ]
            }, headerCellClass: $scope.highlightFilteredHeader }, 
            { field: 'status', displayName: 'Status', visible: $rootScope.settings[0]["status"],
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ 
                        { value: 'Active', label: 'Active' }, 
                        { value: 'Hold', label: 'Hold' }, 
                        { value: 'Closed', label: 'Closed'}
                    ]
            }, headerCellClass: $scope.highlightFilteredHeader }, 
            { field: 'property_type', displayName: 'Type', visible: $rootScope.settings[0]["property_type"],
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ 
                        { value: 'SFR', label: 'SFR' }, 
                        { value: 'Condo', label: 'Condo' }, 
                        { value: 'Duplex', label: 'Duplex'}, 
                        { value: 'Triplex', label: 'Triplex' }, 
                        { value: 'Fourplex', label: 'Fourplex' }, 
                        { value: 'MFR', label: 'MFR' } 
                    ]
            }, headerCellClass: $scope.highlightFilteredHeader},
            { field: 'address', displayName: 'Address', visible: $rootScope.settings[0]["address"], width: '12%', headerCellClass: $scope.highlightFilteredHeader }, 
            { field: 'city', displayName: 'City', visible: $rootScope.settings[0]["city"], width: '10%' }, 
            { field: 'zip', displayName: 'ZIP', visible: $rootScope.settings[0]["zip"] }, 
            { field: 'county', displayName: 'CO.', visible: $rootScope.settings[0]["county"], width: '3%' }, 
            { field: 'sqft', displayName: 'SQFT', visible: $rootScope.settings[0]["sqft"], type: 'number', width: '4%' }, 
            { field: 'lotsize', displayName: 'Lot', visible: $rootScope.settings[0]["lotsize"], type: 'number', width: '5%'}, 
            { field: 'beds', displayName: 'BD', visible: $rootScope.settings[0]["beds"], width: '3%'  }, 
            { field: 'baths', displayName: 'BA', visible: $rootScope.settings[0]["baths"], displayName: 'BA', width: '3%'  }, 
            { field: 'year_built', displayName: 'Year', visible: $rootScope.settings[0]["year_built"], width: '4%' }, 
            { field: 'pool_spa', displayName: 'Pool/Spa', visible: $rootScope.settings[0]["pool_spa"], width: '5%' }, 
            { field: 'occupancy', displayName: 'Occ.', visible: $rootScope.settings[0]["occupancy"] }, 
            { field: 'lockbox_combo', displayName: 'Lockbox', visible: $rootScope.settings[0]["lockbox_combo"] }, 
            { field: 'alarm_code', displayName: 'Alarm', visible: $rootScope.settings[0]["alarm_code"]}, 
            { field: 'asset_manager', displayName: 'Manager', visible: $rootScope.settings[0]["asset_manager"] }
        ];    

        $scope.hideColumn = function(col,uid) {

            var change = {};
            change.uid = uid;
            change.field = col.field;
            if (col.visible) {
                change.visible = 1;
            } else {
                change.visible = 0;
            }
            
            auth.post('changeSettings', {
                change: change
            }).then(function (results) {

            });
        };

        $scope.gridOptions = {
            data: $scope.tableData,
            enableSorting: true,
            enableFiltering: false,
            enableColumnMenus: false,
            multiSelect: false,
            enableRowSelection: true,
            columnDefs: $scope.columns,
            enableRowHeaderSelection: false,
            rowTemplate: '<div ng-dblclick="grid.appScope.linkToSingle(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ui-grid-one-bind-id-grid="rowRenderIndex + \'-\' + col.uid + \'-cell\'" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" role="{{col.isRowHeader ? \'rowheader\' : \'gridcell\'}}" ui-grid-cell></div>',
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;

                // Setup events so we're notified when grid state changes.
                $scope.gridApi.colMovable.on.columnPositionChanged($scope, saveState);
                $scope.gridApi.colResizable.on.columnSizeChanged($scope, saveState);
                $scope.gridApi.core.on.columnVisibilityChanged($scope, saveState);
                $scope.gridApi.core.on.filterChanged($scope, saveState);
                $scope.gridApi.core.on.sortChanged($scope, saveState);

                // Restore previously saved state.

                restoreState();

                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                    $(".ui-grid-row").removeClass("ui-grid-row-selected");
                    if ($scope.clicked) {
                        $scope.cancelClick = true;
                        return;
                    }

                    $scope.clicked = true;

                    $timeout(function () {
                        if ($scope.cancelClick) {
                            $scope.cancelClick = false;
                            $scope.clicked = false;
                            return;
                        }


                        var latlng = row.entity.latlng,
                            pid = row.entity.pid,
                            sap =  $("#select-a-property"),
                            latlng = latlng.split(","),
                            lat = parseFloat(latlng[0]),
                            lng = parseFloat(latlng[1]) + .035,
                            infoBoxWidth = $("#info-box").css("width"),
                            ib = $("#info-box"),
                            ibs = $("#info-box-switch"),
                            map = $(".property-viewer ng-map");
                            
                        sap.hide();
                        $rootScope.addInfo = pid;
                        $rootScope.mymap.setCenter({lat: lat, lng: lng});
                        $rootScope.mymap.setZoom(13);

                        for (i in $rootScope.mymap.markers) {
                            $rootScope.mymap.markers[i].setAnimation(null);
                        }
                        
                        $rootScope.mymap.markers["pin" + pid].setAnimation(google.maps.Animation.BOUNCE);

                        if (!row.isSelected) {
                            $rootScope.mymap.setZoom(8);
                            $rootScope.mymap.setCenter({lat: 34.26, lng: -117.30587750000001});
                            ib.css("right", "-" + infoBoxWidth);
                            ibs.addClass("flip");
                            ibs.css("right", "0");
                            map.css("max-width", "100%");
                            $rootScope.mymap.markers["pin" + pid].setAnimation(null);
                            setTimeout(function() {
                                ib.fadeOut();
                                $rootScope.addInfo = {};
                                sap.show();
                            }, 200);
                        } else {
                            ib.fadeIn();
                            setTimeout(function() {
                                ib.css("right", "0");
                                ibs.css("right", infoBoxWidth);
                                ibs.removeClass("flip");
                                map.css("max-width", "70%");
                            }, 200);
                        }

                        //clean up
                        $scope.cancelClick = false;
                        $scope.clicked = false;
                    }, 200);
                });
            }
        };

        function saveState() {
            var state = $scope.gridApi.saveState.save();
            state.selection = [];
            localStorageService.set('gridState', state);
        };

        function restoreState() {
            if (localStorageService.get('gridState')) {
                $("#restoring").fadeIn();  
              $timeout(function() {
                var state = localStorageService.get('gridState');
                for (i in state.columns) {
                    state.columns[i].visible = $scope.columns[i].visible;
                }
                if (state) $scope.gridApi.saveState.restore($scope, state);
                $("#restoring").fadeOut();
              });
            }
        };

    } // endif rootScope.settings

    $scope.toggleFiltering = function(){
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
        if ($scope.gridOptions.enableFiltering) {
            setTimeout( function() {
                var scrollTop     =  $(window).scrollTop(),
                    elementOffset =  $(".home-table").offset().top,
                    distance      =  (elementOffset - scrollTop),
                    space         =  window.innerHeight - distance;
            }, 200);
            $(".ui-grid-viewport").css("height", space - 40 + "px");
        } else {
            setTimeout( function() {
                var scrollTop     =  $(window).scrollTop(),
                    elementOffset =  $(".home-table").offset().top,
                    distance      =  (elementOffset - scrollTop),
                    space         =  window.innerHeight - distance;
            }, 200);
            $(".ui-grid-viewport").css("height", space - 25 + "px");
        }
    };

    $scope.linkToSingle = function(row) {
        var pid = row.entity.pid;
        $rootScope.addInfo = {};
        $location.path('properties/' + pid);
    };

    $scope.linkToSingleFromPid = function(pid) {
        $rootScope.addInfo = {};
        $location.path('properties/' + pid);
    };

    $scope.toggle = function(event) {
        var t = $(event.target);
        var id = t[0].id;
        if (t.hasClass("glyphicon-minus")) {
            $("#" + id + "-table").addClass("collapse");
            t.removeClass("glyphicon-minus");
            t.addClass("glyphicon-plus");
        } else {
            $("#" + id + "-table").removeClass("collapse");
            t.removeClass("glyphicon-plus");
            t.addClass("glyphicon-minus");
        }
 
    }

    $scope.closeBox = function() {
        var infoBoxWidth = $("#info-box").css("width");
        if ($("#info-box").css("right") == "0px") {
            setTimeout(function() {
                $("#info-box").fadeOut();
            }, 500);    
            $("#info-box").css("right", "-" + infoBoxWidth);
            $("#info-box-switch").css("right", "0");
            $("#info-box-switch").addClass("flip");
            $(".property-viewer ng-map").css("max-width", "100%");
        } else {
            $("#info-box").fadeIn();
            setTimeout(function() {
                $("#info-box").css("right", "0");
                $("#info-box-switch").css("right", infoBoxWidth);
                $("#info-box-switch").removeClass("flip");
                $(".property-viewer ng-map").css("max-width", "70%");
            }, 200);
        }
    }

    if($location.path() == "/") {
        setTimeout( function() {
            var scrollTop     = $(window).scrollTop(),
                elementOffset = $(".home-table").offset().top,
                distance      = (elementOffset - scrollTop);
                space         = window.innerHeight - distance;
            $(".home-table").css("height", space + "px");
            $("#grid1").css("height", space + "px");
            $(".ui-grid-render-container").css("height", space + "px");
            $(".ui-grid-viewport").css("height", space - 25 + "px");
        }, 200);
    }
    
    $scope.hideMap = function() {
        var map     =  $(".property-viewer ng-map"),
            mapVP   =  $(".property-viewer"),
            grid    =  $(".grid"),
            gridVP  =  $(".ui-grid-viewport"),
            ht      =  $(".home-table"),
            s       =  $("#hide-map-switch"),
            hideMap =  $(".hide-map");
        if (window.innerWidth > 675) {
            if (map.css("max-height") == "280px") {
                mapVP.css("max-height","0px");
                grid.css({
                    "height": "516px",
                    "margin-top": "40px"
                });
                gridVP.css("height", "516px");
                ht.css("height", "515px");
                s.addClass("flip");
                hideMap.css("top", "30px");
                map.css("max-height", "0px");
            } else {
                mapVP.css("max-height","280px");
                s.removeClass("flip");
                hideMap.css("top", "274px");
                map.css("max-height", "280px");
                grid.css({
                    "height": space,
                    "margin-top": "0"
                });
                gridVP.css("height", space - 25);
                ht.css("height", space);
            }
        } else {
            if (map.css("max-height") == "200px") {
                mapVP.css("max-height","0px");
                grid.css({
                    "height": "516px",
                    "margin-top": "40px"
                });
                gridVP.css("height", "516px");
                ht.css("height", "515px");
                s.addClass("flip");
                hideMap.css("top", "30px");
                map.css("max-height", "0px");
            } else {
                mapVP.css("max-height","280px");
                s.removeClass("flip");
                hideMap.css("top", "194px");
                map.css("max-height", "200px");
                grid.css({
                    "height": space,
                    "margin-top": "0"
                });
                gridVP.css("height", space - 25);
                ht.css("height", space);
            }
        }

        var infoBoxWidth = $("#info-box").css("width");
        if ($("#info-box").css("right") == infoBoxWidth && map.css("max-height") == "280px") {
            $("#info-box").fadeIn();
            setTimeout(function() {
                $("#info-box").css("right", "0");
                $("#info-box-switch").css("right", infoBoxWidth);
                $("#info-box-switch").removeClass("flip");
                $(".property-viewer ng-map").css("max-width", "70%");
            }, 200);
        } else {
            setTimeout(function() {
                $("#info-box").fadeOut();
            }, 500);    
            $("#info-box").css("right", "-" + infoBoxWidth);
            $("#info-box-switch").css("right", "0");
            $("#info-box-switch").addClass("flip");
            $(".property-viewer ng-map").css("max-width", "100%");
        }
    }

    $scope.reset = function() {
        if ($(".ui-grid-row").hasClass("ui-grid-row-selected") || $rootScope.mymap.setZoom() != 8) {
             var container = $(".ui-grid-viewport"),
                infoBoxWidth = $("#info-box").css("width");
            

            for (i in $rootScope.mymap.markers) {
                $rootScope.mymap.markers[i].setAnimation(null);
            }

            $rootScope.mymap.setZoom(8);
            $rootScope.mymap.setCenter({lat: 34.26, lng: -117.30587750000001});

            container.animate({
                scrollTop: "0"
            }, 500);

            $(".ui-grid-row").removeClass("ui-grid-row-selected");
            $("#info-box").css("right", "-" + infoBoxWidth);
            $("#info-box-switch").css("right", "0");
            $("#info-box-switch").addClass("flip");
            $(".property-viewer ng-map").css("max-width", "100%");
            setTimeout(function() {
                $("#select-a-property").show()
                $rootScope.addInfo = {};
                $("#info-box").fadeOut();
            }, 200);
        } 
    }

    // NEW PROPERTY CREATOR
    $scope.newproperty = {};
    $scope.newproperty = {status: '', phase: '', property_type: '',  address: '', city: '', zip: '', latlng: '', county: '', year_built: '', sqft: '', lotsize: '', beds: '', baths: '', listdesc: '', pool_spa: '', occupancy: '', lockbox_combo: '', alarm_code: '', asset_manager: '', purchase_close_date: '', purchase_cost: '', entity_vesting: '', lender: '', rehab_estimate: '', arv: '', is_listed: '', listing_date: '', list_price: '', escrow_price: '', sale_close_date: '', images: ''};
    $scope.newProperty = function(property) {
        $("#form-loading").css("display", "block");
        var f = document.getElementById('file').files;
        if (f.length) {
            for (i=0; i<f.length; i++) {
                if (i == 0) {
                    property.images += f[i].name;
                } else {
                    property.images += ", " + f[i].name;
                }
            }
        } else {
            property.images = null;
        }
        
        property.address = property.address;
        property.city = property.city.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        property.zip = property.zip;

        var geocoder = new google.maps.Geocoder(),
            a = property.address + ", " + property.city + ", CA " + property.zip,
            latitude,
            longitude,
            res;

        geocoder.geocode( { 'address': a}, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK && results) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
                property.latlng = latitude + "," + longitude;
                property.beds = parseInt(property.beds);
                property.baths = parseInt(property.baths);
                auth.post('properties', {
                    property: property
                }).then(function (results) {
                    $("#form-loading").css("display", "none");
                    auth.toast(results);
                    if (results.status == "success") {
                        $location.path('properties/' + results.pid);
                    }
                });
            } else {
                $("#form-loading").css("display", "none");
                var results = {};
                results.status = "error";
                results.message = "There was an error finding LAT/LNG for that address. Please check it and try again.";
                auth.toast(results);
                $route.reload();
            }
        });        
    };


    $scope.uploadFile = function() {
        if ($scope.myFile) {
            var files = [];
            for (i=0;i<$scope.myFile.length;i++) {
                files.push($scope.myFile[i]);
                Data('uploader').postImage(files[i], function(response) {
                });
            }
        }
    };

    // PROPERTY EDITOR
    $scope.deleteFile = function(img) {
      var ok = confirm("Are you sure you want to delete this image?");
      if (ok) {
        auth.post('deleteImage', {
          img:img
        }).then(function(res){
            auth.toast(res);
            if (res.status == "success") {
              var index = $scope.s.images.indexOf(img);
              if (index > -1) {
                $scope.s.images.splice(index, 1);
              }
            }
            $route.reload();
        });
      }
    };

    $scope.deleteProperty = function(property) {
        var ok = confirm("Are you sure you want to delete this property?");

        if (ok) {
          auth.post('deleteProperty', {
            property: property
          }).then(function(res){
              auth.toast(res);
              $location.path('properties/');
          });
        }
    };

    

    $scope.hasSavedProperties = function() {
      if ($scope.saved[0] != null) {
        return true;
      } else {
        return false;
      }
    }

    $scope.$storage = $localStorage;

    $scope.setParams = function(city,priceQ,beds,baths) {
        delete $scope.$storage.city;
        delete $scope.$storage.priceQ;
        delete $scope.$storage.beds;
        delete $scope.$storage.baths;
        var citySearch = city.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        $scope.$storage.city = citySearch;
        $scope.$storage.priceQ = priceQ;
        $scope.$storage.beds = beds;
        $scope.$storage.baths = baths;
        if ($location.url() != '/properties/search-results') {
            $location.path('properties/search-results');
        } else {
            $route.reload();
        }
    };

    $scope.noResults = function() {
        if($scope.searchRes[0] == null) {
            return true;
        }
    };


    // allows users to save properties to their dashboard
    $scope.saveProperty = function(property) {
        auth.post('saveProperty', {
            property: property
        }).then(function(results){
            auth.toast(results);
        });
    };

    $scope.updateProperty = function(s) {
        $("#form-loading").css("display", "block");
        var f = document.getElementById('file').files;
        if (f.length) {
        for (i=0; i<f.length; i++) {
            if (s.images) {
                s.images += "," + f[i].name;
            } else {
                s.images = f[i].name;
            }
        }
        } else {
            s.images = null;
        }
        if (s.pool_spa == "Yes" || s.pool_spa == "yes" || s.pool_spa == "Y" || s.pool_spa == "y") {
            s.pool_spa = 1;
        } else {
            s.pool_spa = 0;
        }
        if (s.is_listed == "Yes" || s.is_listed == "yes" || s.is_listed == "Y" || s.is_listed == "y") {
            s.is_listed = 1;
        } else {
            s.is_listed = 0;
        }
        var geocoder = new google.maps.Geocoder(),
            a = s.address + ", " + s.city + ", CA " + s.zip,
            latitude,
            longitude;

        geocoder.geocode( { 'address': a}, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK && results) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
                s.latlng = latitude + "," + longitude;
                auth.post('editProperty', {
                    property: s
                }).then(function (results) {
                    $("#form-loading").css("display", "none");
                    auth.toast(results);
                    $route.reload();
                });
            } else {
                $("#form-loading").css("display", "none");
                var results = {};
                results.status = "error";
                results.message = "Could not update property. Please try again later";
                auth.toast(results);
                $route.reload();
            }
        });
    };

    $scope.propertyFilters = {};
    $scope.price = {max:100000000};
    $scope.sqft = {min:0};
    $scope.lotsize = {min:0};

});

app.controller('FormCtrl', function($scope, $http, auth, singleproperty) {
    $scope.formData = {};
    $scope.getUser = function() {
        auth.get('session').then( function(res) {
            $scope.user = res;
            $scope.formData.name = $scope.user.name;
            $scope.formData.email = $scope.user.email;
            $scope.formData.phone = $scope.user.phone;
        });
    };

    $scope.getUser();


    $scope.formData.property = singleproperty.property.address;

    $scope.submitInquiry = function(formData) {
        auth.post('formSend',{
            formData: formData
        }).then(function(data) {
            auth.toast(data);
        })
    }

});

app.controller('RehabCtrl', function($scope, auth, $http, rehab, GanttData/*, rehabActivityLog*/) {
    $scope.r = rehab.rehab;
    
    $scope.updateRehab = function(r,k,column,v) {
        var change = {};
        change.rehab_id = r.rehab_id;
        change.table = k;
        change.column = column;
        change.value = v;
        auth.post('updateRehab', {
            change: change
        }).then(function (results) {
            $scope.data = GanttData.getGanttData($scope);
        });
    };

    $scope.data = GanttData.getGanttData($scope);

    // angular-gantt options
        $scope.options = {
            sortMode: 'from',
            api: function(api) {
                $scope.api = api;
                api.core.on.ready($scope, function() {
                     api.timespans.on.change($scope, function(data) {
                        console.log(data);
                     });
                });
            }
        }

    $scope.isValueAnArray = function(val) {
      return Array.isArray(val);
    }

    /* REHAB ACTIVITY LOG
    $scope.logs = rehabActivityLog.log
    $scope.newlog = {};
    $scope.newlog = {log: '', property_id: '', user_id: ''};

    $scope.newLog = function(log) {
        log.log = log.log.replace(/'/g, "''");
        log.property_id = parseInt(singleproperty.property.pid);
        log.user_id = $rootScope.uid;
        auth.post('logs', {
            log: log
        }).then(function (results) {
            auth.toast(results);
            if(results.status == "success") {
                $("#log-form").val('');

                $("#log-box").animate({
                    scrollTop: "10000px"
                }, 1000);

                log.username = $rootScope.name;

                var currentdate = new Date(); 
                if (currentdate.getHours() > 12) {
                    var hours = currentdate.getHours() - 12;
                    var ampm = "PM";
                } else {
                    var hours = currentdate.getHours();
                    var ampm = "AM";
                }
                var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/" 
                + currentdate.getFullYear() + " at "  
                + hours + ":"  
                + currentdate.getMinutes() + ampm;

                log.created = datetime;

                $scope.logs.push(log);
            }
        });
    };

    */
});

app.controller('MapCtrl', function($scope, $rootScope, NgMap) {
    var marker,
        vm = this;

    $rootScope.$on('mapInitialized', function(evt,map) {
        $rootScope.mymap = map;
        $rootScope.$apply();
    });

    vm.showDetails = function(event,pid,latlng) {
        $(".ui-grid-row").removeClass("ui-grid-row-selected");
        var row = $("#row" + pid).closest(".ui-grid-row"),
            container = $(".ui-grid-viewport"),
            infoBoxWidth = $("#info-box").css("width");
        
        row.addClass("ui-grid-row-selected");
        
        if (this.getAnimation() != null) {
            // Do Nothing
        } else {
            for (i in this.map.markers) {
                this.map.markers[i].setAnimation(null);
            }
            this.setAnimation(google.maps.Animation.BOUNCE);

            latlng = latlng.split(",");
            lat = parseFloat(latlng[0]);
            lng = parseFloat(latlng[1]) + .035;
            $rootScope.mymap.setCenter({lat: lat, lng: lng});
            $rootScope.mymap.setZoom(13);
            $rootScope.addInfo = pid;

            container.animate({
                scrollTop: row.offset().top - 360
            }, 500);

            $("#info-box").fadeIn();
            $("#select-a-property").hide();
            $("#info-box").css("right", "0px");
            $("#info-box-switch").removeClass("flip");
            $("#info-box-switch").css("right","30%");
            $(".property-viewer ng-map").css("max-width", "70%");
        }
    }   
});

app.controller('CommentCtrl', function($scope, $http, auth, singleproperty, comments, $rootScope, $route) {
    $scope.comments = comments.comments;
    $scope.newcomment = {};
    $scope.newcomment = {comment: '', property_id: '', user_id: ''};

    $scope.newComment = function(comment) {
        comment.comment = comment.comment.replace(/'/g, "''");
        comment.property_id = parseInt(singleproperty.property.pid);
        comment.user_id = $rootScope.uid;
        auth.post('comments', {
            comment: comment
        }).then(function (results) {
            auth.toast(results);
            if(results.status == "success") {
                $("#comment-form").val('');

                $("#comment-box").animate({
                    scrollTop: "10000px"
                }, 1000);

                comment.username = $rootScope.name;

                var currentdate = new Date(); 
                if (currentdate.getHours() > 12) {
                    var hours = currentdate.getHours() - 12;
                    var ampm = "PM";
                } else {
                    var hours = currentdate.getHours();
                    var ampm = "AM";
                }
                var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/" 
                + currentdate.getFullYear() + " at "  
                + hours + ":"  
                + currentdate.getMinutes() + ampm;

                comment.created = datetime;

                $scope.comments.push(comment);
            }
        });
    };

    $scope.toggleComments = function() {
        var lb = $("#lightbox");
        if (lb.css("display") == "block") {
            lb.css("display", "none");
            $("footer").css("margin-top", "0px");
        } else {
            lb.css("display", "block");
            $("footer").css("margin-top", "200px");
        }
    };
});