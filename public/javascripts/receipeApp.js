var app = angular.module('receipeApp', ['ngRoute', 'ngResource', 'ui.grid', 'ui.router'])
        .controller('receipeController', function($scope, $http, uiGridConstants, receipeService, $rootScope){
        $scope.receipes = receipeService.query();
        $scope.newReceipe = {receipeName: '', receipeDescription: '', receipePicture: ''};
        $scope.receipeName = '';
        $scope.receipeDescription = '';
        $scope.receipePicture = 'images/';
        $scope.receipeID;

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

        $scope.getOneReceipe = function(id) {
            $scope.singleReceipe = receipeService.get({_id: id});
            console.log(singleReceipe);
        };

        $scope.getAllReceipes = function() {
            $scope.returnedReceipe = receipeService.query();
            //console.log($scope.returnedReceipe);
            // $scope.gridOptions.data = $scope.returnedReceipe;

        };

        $scope.getAllReceipes();

        $scope.deleteReceipe = function(id) {
            receipeService.delete({id: id});
            $scope.getAllReceipes();
            alert(id);
        };

        $scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
                return 'header-filtered';
            } else {
                return '';
            }
        };

        $scope.gridOptions = {
            enableFiltering: true,
            data: $scope.returnedReceipe,
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
            },

            columnDefs: [
                {
                    field: 'receipeName',
                    headerCellClass: $scope.highlightFilteredHeader
                },
                {
                    field: 'receipeDescription'
                }
            ]
        };

        $scope.toggleFiltering = function(){
            alert('Working First');
            $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
            alert('Working Second');
            //$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
            alert('Working Last');
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
        })

        .state('details', {
            url: '/details',
            templateUrl: 'receipeDetails.html',
            controller: 'receipeController'
        });

});


app.directive('card', function(){
    return {
        templateUrl: 'receipeCard.html'
    }
});




