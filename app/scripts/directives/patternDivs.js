'use strict';

angular.module('knittingApp')
  .directive('patternDivs', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/pattern-divs.html',
      scope: false
    }
  });
