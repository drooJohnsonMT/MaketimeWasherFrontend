mtMaker
.directive('formGrommet', function() {
	return {
		restrict: 'A',
		templateUrl: 'partials/form-grommet.html'
	};
})
.directive('vizGrommet', function() {
	return {
		restrict: 'A',
		templateUrl: 'partials/viz-grommet.html'
	};
})
.directive('vizEmpty', function() {
	return {
		restrict: 'A',
		templateUrl: 'viz-empty.html'
	};
})
.directive('staticGrommet', function() {
	return {
		restrict: 'A',
		templateUrl: 'partials/static-grommet.html'
	};
});