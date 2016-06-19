var app = angular.module('receipeApp', ['ngRoute', 'ngResource', 'ui.grid', 'ui.router'])
        .controller('receipeController', function(receipeService, $scope, $rootScope){
        $scope.receipes = receipeService.query();
        $scope.newReceipe = {receipeName: '', receipeDescription: '', receipePicture: ''};
        $scope.receipeName = '';
        $scope.receipeDescription = '';
        $scope.receipePicture = 'images/';
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
            $scope.newReceipe.receipePicture = $scope.receipePicture;
            receipeService.save($scope.newReceipe, function(){
                $scope.receipes = receipeService.query();
                $scope.newReceipe = {receipeName: '', receipeDescription: '', receipePicture: ''};
            });
            $scope.receipeName = '';
            $scope.receipeDescription = '';
            $scope.receipePicture = 'images/';
            $scope.getAllReceipes();
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
                {
                    field: 'receipeName',
                    sort: {
                        priority: 1
                    }
                },
                {
                    field: 'receipeDescription',
                    sort: {
                        priority: 0,
                }}
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
        receipeDescription: "@receipeDescription",
        receipePicture: "@receipePicture"
    });
});

/*
app.config(function($routeProvider){
    $routeProvider
        //the timeline display
        .when('/', {
            templateUrl: 'main.html',
            controller: 'receipeController'
        });
});
*/

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/first');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('first', {
            url: '/first',
            templateUrl: 'main.html',
            controller: 'receipeController'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('second', {
            url: '/second',
            templateUrl: 'second.html',
            controller: 'receipeController'
        });

});


app.directive('card', function(){
    return {
        templateUrl: 'receipeCard.html'
    }
});




