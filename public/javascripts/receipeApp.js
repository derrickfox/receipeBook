var app = angular.module('receipeApp', ['ngRoute', 'ngResource', 'ui.grid'])
        .controller('receipeController', function(receipeService, $scope, $rootScope){
        $scope.receipes = receipeService.query();
        $scope.newReceipe = {receipeName: '', receipeDescription: ''};
        $scope.receipeName = '';
        $scope.receipeDescription = '';
        $scope.gridOptions;
        //$scope.returnedReceipe;

        $scope.myData = [
            {
                "firstName": "Cox",
                "lastName": "Carney",
                "company": "Enormo",
                "employed": true
            },
            {
                "firstName": "Lorraine",
                "lastName": "Wise",
                "company": "Comveyer",
                "employed": false
            },
            {
                "firstName": "Nancy",
                "lastName": "Waters",
                "company": "Fuelton",
                "employed": false
            }
        ];

        $scope.postToMongo = function() {
            $scope.newReceipe.receipeName = $scope.receipeName;
            $scope.newReceipe.receipeDescription = $scope.receipeDescription;
            receipeService.save($scope.newReceipe, function(){
                $scope.receipes = receipeService.query();
                $scope.newReceipe = {receipeName: '', receipeDescription: ''};
            });
            alert("Saved " + $scope.receipeName);
            $scope.receipeName = '';
            $scope.receipeDescription = '';
        };

        $scope.getOneReceipe = function() {
            $scope.returnedReceipe = receipeService.get({id: '_id'});

            console.log($scope.returnedReceipe);

        };

        $scope.getAllReceipes = function() {
            $scope.returnedReceipe = receipeService.query();
            console.log($scope.returnedReceipe);
            // $scope.gridOptions.data = $scope.returnedReceipe;

        };

        $scope.getAllReceipes();

        $scope.deleteReceipe = function(id) {
            receipeService.delete({_id: id});
            $scope.getAllReceipes();
        }

        $scope.gridOptions = [{
            enableFiltering: true,
            data: $scope.returnedReceipe,
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
            },
            columnDefs: [
                // default
                //{ field: 'name', headerCellClass: $scope.highlightFilteredHeader }
            ]
        }];

        $scope.toggleFiltering = function(){
            $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
        };

});

app.factory('receipeService', function($resource){
    // return $resource('/api/receipes/:id');
    return $resource("/api/receipes/:id", {
        id: "@id",
        receipeName: "@receipeName",
        receipeDescription: "@receipeDescription"
    });
});

app.config(function($routeProvider){
    $routeProvider
        //the timeline display
        .when('/', {
            templateUrl: 'main.html',
            controller: 'receipeController'
        });
});





