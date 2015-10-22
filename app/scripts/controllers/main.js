'use strict';

/**
 * @ngdoc function
 * @name knittingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the knittingApp
 */
angular.module('knittingApp')
  .controller('MainCtrl', function ($scope, $timeout) {

    var ctrl = this;
    $scope.ctrl = ctrl;

    this.stitchesPerRow = 30;
    this.stitch = 7;

    this.getRow = function () {
      return Math.ceil(this.stitch / (this.stitchesPerRow));
    };

    this.getRowStitch = function () {
      return this.stitch % this.stitchesPerRow;
    };

    this.nextStitch = function () {
      return this.stitch++;
    };

    this.prevStitch = function () {
      return this.stitch--;
    };

    // after dom loaded (sneaky sneaky)
    $timeout(function () {


      console.log('haha');

        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var img = document.getElementById("patternImage");
        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, c.width, c.height);

      var pixelsMaybe = [];

        // invert colors
        for (var i = 0; i < imgData.data.length; i += 4) {

          pixelsMaybe.push(imgData.data[i] > 0 ? 1 : 0);

          imgData.data[i] = 255 - imgData.data[i];
          imgData.data[i + 1] = 255 - imgData.data[i + 1];
          imgData.data[i + 2] = 255 - imgData.data[i + 2];
          imgData.data[i + 3] = 255;
        }


      var currentRow = '';
      for(var i = 0; i < pixelsMaybe.length; i++) {

        if(currentRow.length >= ctrl.stitchesPerRow) {
          console.log(currentRow);
          currentRow = '';
        }
        currentRow += pixelsMaybe[i];

      }



    }, 300);

  });
