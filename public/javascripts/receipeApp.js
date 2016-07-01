var app = angular.module('receipeApp', ['ngRoute', 'ngResource', 'ui.grid', 'ui.router'])
        .controller('receipeController', function($scope, $state, $http, uiGridConstants, receipeService, $rootScope){
        $scope.receipes = receipeService.query();
        $scope.newReceipe = {receipeName: '', receipeDescription: '', receipePicture: ''};
        $scope.receipeName = '';
        $scope.receipeDescription = '';
        $scope.receipePicture = 'images/';
        $scope.receipeID;
        $rootScope.singleReceipe;

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
            $rootScope.singleReceipe = receipeService.get({id: id}, function(receipe) {
                var thisReceipe = {receipeName: '', receipeDescription: '', receipePicture: ''};
                thisReceipe.receipeName = receipe.receipeName;
                thisReceipe.receipeDescription = receipe.receipeDescription;
                return thisReceipe;
            });
            $state.go('details');
        };

        $scope.getAllReceipes = function() {
            $scope.returnedReceipe = receipeService.query();
            //console.log($scope.returnedReceipe);
            // $scope.gridOptions.data = $scope.returnedReceipe;

        };

        // TODO here could be why the $scope is being cleared when the state changes/loads
        $scope.getAllReceipes();

        $scope.updateReceipe = function() {
            //alert($rootScope.singleReceipe._id);
            $scope.entry = receipeService.get({ id: $rootScope.singleReceipe._id }, function() {
                $scope.entry.receipeName = $scope.receipeName;
                $scope.entry.receipeDescription = $scope.receipeDescription;
                $scope.entry.$update(function() {
                    $state.go('first');
                });

            });

        };

        $scope.deleteReceipe = function(id) {
            receipeService.delete({id: id});
            $scope.getAllReceipes();
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

        /*
        $scope.$watch(
            "singleReceipe.receipeName",
            function handleChange() {
                alert("0 : " + $rootScope.singleReceipe.receipeName);
            }
        );
        */

});

app.controller('testController', function($scope, $state, $http, uiGridConstants, receipeService, $rootScope) {
    $scope.receipeName = 'FIRST PAGE: Test Receipe Name';
    $scope.receipeDescription = 'SECOND PAGE: Test Description';

    $scope.toSecondState = function() {
        $state.go('test2');
    };

    $scope.toFirstState = function() {
        $state.go('test1');
    };

});

app.factory('receipeService', function($resource){
    return $resource("/api/receipes/:id", {
        id: "@_id",
        receipeName: "@receipeName",
        receipeDescription: "@receipeDescription",
        receipePicture: "@receipePicture"
    },
    {
        update: {
            method: 'PUT'
        }
    });
});

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
        })

        .state('details/:id', {
            url: '/details/:id',
            templateUrl: 'receipeDetails.html',
            controller: 'receipeController'
        })

        .state('test1', {
            url: '/test1',
            templateUrl: 'test1.html',
            controller: 'testController'
        })

        .state('test2', {
            url: '/test2',
            templateUrl: 'test2.html',
            controller: 'testController'
        });

});


app.directive('card', function(){
    return {
        templateUrl: 'receipeCard.html'
    }
});




