var app = angular.module('receipeApp', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages', 'ui.grid', 'ui.router'])
        .controller('receipeController', function($scope, $state, $http, uiGridConstants, receipeService, $rootScope){
        $scope.receipes = receipeService.query();
        $scope.newReceipe = {receipeName: '', receipeDescription: '', receipePicture: '', receipeIngredients: []};
        $scope.newIngredient = '';
        $scope.receipeName = '';
        $scope.receipeDescription = '';
        $scope.receipePicture = 'images/';
        $scope.receipeSteps = [];
        $scope.receipeType = ['App', 'Entree', 'Side', 'Dessert'];
        $scope.receipeIngredients = [];
        $scope.receipeID;
        $rootScope.singleReceipe;

        $scope.ingredients = ["Apple","Onions","Carrots","Mushrooms","Grapes"];
        $scope.selected = [];

        $scope.printThis = function(){
            alert($scope.receipeIngredients);
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            var myIdx = $scope.receipeIngredients.indexOf(item);

            if (myIdx > -1) {
                $scope.receipeIngredients.splice(myIdx, 1);
            }
            else {
                $scope.receipeIngredients.push(item);
            }

            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
                //myList.push(item);
            }
            console.clear();
            console.log("Internal list: " + list);
            console.log("Scope list: " + $scope.receipeIngredients);

        };

        $scope.choices = [{id: 'choice1'}, {id: 'choice2'}];

        $scope.addNewChoice = function() {
            var newItemNo = $scope.choices.length+1;
            $scope.choices.push({'id':'choice'+newItemNo});
        };

        $scope.removeChoice = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.postToMongo = function() {
            $scope.newReceipe.receipeName = $scope.receipeName;
            $scope.newReceipe.receipeDescription = $scope.receipeDescription;
            $scope.newReceipe.receipePicture = $scope.receipePicture;
            $scope.newReceipe.receipeIngredients = $scope.receipeIngredients;
            receipeService.save($scope.newReceipe, function(){
                $scope.receipes = receipeService.query();
                $scope.newReceipe = {receipeName: '', receipeDescription: '', receipePicture: '', receipeIngredients: []};
            });
            $scope.receipeName = '';
            $scope.receipeDescription = '';
            $scope.receipePicture = 'images/';
            $scope.receipeIngredients = [];
            $scope.getAllReceipes();
            $state.go('first');
        };

        $scope.getOneReceipe = function(id) {
            $rootScope.singleReceipe = receipeService.get({id: id}, function(receipe) {
                var thisReceipe = {receipeName: '', receipeDescription: '', receipePicture: '', receipeIngredients: []};
                thisReceipe.receipeName = receipe.receipeName;
                thisReceipe.receipeDescription = receipe.receipeDescription;
                thisReceipe.receipePicture = receipe.receipePicture;
                thisReceipe.receipeIngredients = receipe.receipeIngredients;
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
                $scope.entry.receipeIngredients = $scope.receipeIngredients;
                // TODO add a way to update picture URL.
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
});



app.controller('testController', function($scope) {

        $scope.items = ["Apple","Onions","Carrots","Mushrooms","Grapes"];
        $scope.selected = [];

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };
    });


/**
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
 **/

app.factory('receipeService', function($resource){
    return $resource("/api/receipes/:id", {
        id: "@_id",
        receipeName: "@receipeName",
        receipeDescription: "@receipeDescription",
        receipePicture: "@receipePicture",
        receipeIngredients: "@receipeIngredients"
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
        })

        .state('newIng', {
            url: '/newIng',
            templateUrl: 'newIngredient.html',
            controller: 'receipeController'
        })

        .state('new', {
            url: '/new',
            templateUrl: 'newReceipe.html',
            controller: 'receipeController'
        });

});


app.directive('card', function(){
    return {
        templateUrl: 'receipeCard.html'
    }
});




