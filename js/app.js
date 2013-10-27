"use strict"
var statusApp = angular.module('statusApp', []);

statusApp.factory('dataFactory', function($http, $q){
	return {
		getData : function(base, url){
			return $http({method: 'GET', url: base + '/' + url});
		},
		getBranchData : function(base, url){
				var deferred = $q.defer();
				
				$http({method: 'GET', url: base + '/statuses/' + url}).
					success(function(data, status, headers, config) {
					    deferred.resolve({data : data, url : url});
					  }).
					  error(function(data, status, headers, config) {
					  	console.log('error')
					    deferred.resolve({data : data, url : url});
					  });

 				return deferred.promise;
		}
	}
})

statusApp.directive('windowChangeAction', function(){
    var _linker = function(){
		window.onresize = function(){
    		var _els = ['h1', 'h2', 'a']
    		for (var i = 0; i < _els.length; i++) {
    			var _newEls = document.querySelectorAll(_els[i]);
    			for (var j = 0; j < _newEls.length; j++) {
    				_newEls[j].style.zIndex = '1';
    			};
    		};
    	}
    }

    return {
        'link' : _linker,
        'restrict' : 'A',
    } 
})

statusApp.controller('appCtrl', function($scope, dataFactory){

	/*
	 * JavaScript Pretty Date
	 * Copyright (c) 2011 John Resig (ejohn.org)
	 * Licensed under the MIT and GPL licenses.
	 */

	// Takes an ISO time and returns a string representing how
	// long ago the date represents.
	function _prettyDate(time){
		var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
				
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
				
		return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "Yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
	}

	$scope.branches;


	$scope.status = 'loading new data';

	var _base = 'https://api.github.com/repos/erikportin/napPlayAdmin';
	$scope.projectName = _base.substr(_base.lastIndexOf("/") + 1)

	dataFactory.getData(_base, 'branches')
		.success(function(data){
			$scope.branches = {};
			for (var i = 0; i < data.length; i++) {
				dataFactory.getBranchData(_base, data[i].name).then(function(data){
					$scope.branches[data.url] = {
													time : _prettyDate(data.data[0].created_at),
													target : data.data[0].target_url, 
													state : data.data[0].state,
													url : data.url
												};
				});
			};
		})
		.error(function(data){
			$scope.status = _base + ' unavailable';
		})		
		.then(function(){
			console.log('done?')
		})



});