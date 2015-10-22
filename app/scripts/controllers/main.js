'use strict';

/**
 * @ngdoc function
 * @name knittingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the knittingApp
 */
angular.module('knittingApp')
  .controller('MainCtrl', function ($scope) {

    $scope.ctrl = this;

    this.stitchesPerRow = 30;
    this.stitch = 7;

    this.getRow = function() {
      return Math.ceil(this.stitch / (this.stitchesPerRow));
    };

    this.getRowStitch = function() {
      return this.stitch % this.stitchesPerRow;
    };

    this.nextStitch = function() {
      return this.stitch++;
    };

    this.prevStitch = function() {
      return this.stitch--;
    };

  });
