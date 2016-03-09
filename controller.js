var app = angular.module('CineDB', ['firebase']);

// Retrieve the genres
app.controller('CineDBCtrl', function($scope, $pageArray1, $pageArray, $firebaseArray) {
var ref2 = new Firebase('https://cinedbnew.firebaseio.com/genres');
var data = $firebaseArray(ref2);
genres = [];
data.$loaded()
     .then(function() {
           angular.forEach(data, function(genre) {
               genres.push([genre.id, genre.name]);
		   });
   });

$scope.genres =  genres;

// Retrieve the shows aka pageItems
var ref = new Firebase('https://cinedbnew.firebaseio.com/shows');
$scope.pageItems = $pageArray(ref, 'number');

});

// Function that performs pagination of genres
app.factory('$pageArray1', function($firebaseArray) {
  return function(ref2, field) {
    var pageRef = new Firebase.util.Paginate(ref2, field);
    var list = $firebaseArray(pageRef);
    list.page = pageRef.page;
    pageRef.page.onPageCount(function(currentPageCount, couldHaveMore) {
      list.pageCount = currentPageCount;
      list.couldHaveMore = couldHaveMore;
    });

    pageRef.page.onPageChange(function(currentPageNumber) {
      list.currentPageNumber = currentPageNumber;
    });

 pageRef.page.next();
 console.log("genres list", list.length);
	return list;
  }
});

// Function that performs pagination of shows
app.factory('$pageArray', function($firebaseArray) {
  return function(ref, field) {
    var pageRef = new Firebase.util.Paginate(ref, field, {pageSize: 2});
    var list = $firebaseArray(pageRef);
    list.page = pageRef.page;
    pageRef.page.onPageCount(function(currentPageCount, couldHaveMore) {
     list.pageCount = currentPageCount;
     list.couldHaveMore = couldHaveMore;
    });

    // when the current page is changed, update local scope vars
    pageRef.page.onPageChange(function(currentPageNumber) {
      list.currentPageNumber = currentPageNumber;
    });
    // load the first page
    pageRef.page.next();
   return list;
  }
});

// Custom filter to match the genre id against the show genre id
app.filter('getNames', function () {
  return function (items, i) {
   if(items[0]==i)
	{
      return items[1];
	}
  };
});
