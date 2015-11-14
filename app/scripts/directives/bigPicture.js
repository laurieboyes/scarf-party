'use strict';

angular.module('knittingApp')
  .directive('bigPicture', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/big-picture.html',
      scope: false
    }
  });
