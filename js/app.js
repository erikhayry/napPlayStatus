"use strict"
var statusApp = angular.module('statusApp', []);

statusApp.factory('dataFactory', function($http, $q){
	return {
		getData : function(url){
			return $http({method: 'GET', url: 'https://api.github.com/repos/erikportin/napPlayAdmin/' + url});
		},
		getBranchData : function(url){
				var deferred = $q.defer();
				
				$http({method: 'GET', url: 'https://api.github.com/repos/erikportin/napPlayAdmin/statuses/' + url}).
					success(function(data, status, headers, config) {
					    deferred.resolve({data : data, url : url});
					  }).
					  error(function(data, status, headers, config) {
					    deferred.resolve({data : data, url : url});
					  });

 				return deferred.promise;
		}
	}
})

statusApp.controller('appCtrl', function($scope, dataFactory){
	console.log('appCtrl');
	$scope.branches = {};
	$scope.status = 'loading new data';

	dataFactory.getData('branches')
	.then(function(data){
		for (var i = 0; i < data.data.length; i++) {
			dataFactory.getBranchData(data.data[i].name).then(function(data){
				$scope.branches[data.url] = {data : data.data, url : data.url};
			});
			
		};
	}).then(function(){
		console.log('done?')
	})



});