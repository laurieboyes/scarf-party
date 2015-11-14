'use strict';

angular.module('knittingApp')
  .controller('MainCtrl', function ($scope, localStorageService) {

    var ctrl = this;
    $scope.ctrl = ctrl;

    this.patternImageSrc = 'images/spacedproper.png';

    this.stitchesPerRow = 30;
    this.stitch = +localStorageService.get('stitch') || 0;
    this.rows = 300;
    this.totalStitches = this.stitchesPerRow * this.rows;

    this.imageWidth = 30;
    this.imageHeight = 300;

    this.getRow = function () {
      return Math.ceil(this.stitch / (this.stitchesPerRow));
    };

    this.getRowStitch = function () {
      return this.stitch % this.stitchesPerRow;
    };

    this.getRowFlippedOrWhatever = function (rowI) {
      if(isRightSide()) {
        return ctrl.patternRows[rowI];
      } else {
        return ctrl.patternRowsReversed[rowI];
      }
    };

    this.getImagePaddingBottom = function() {
      return ((this.imageHeight / this.imageWidth) * 100) + '%';
    };

    this.nextStitch = function (increase) {
      return this.stitch = +this.stitch + (increase ? increase : 1);
    };

    this.prevStitch = function () {
      return this.stitch--;
    };

    this.getScreenHeight = function() {
      return window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    };

    function isRightSide() {
      return Math.floor(ctrl.stitch / ctrl.stitchesPerRow) % 2 === 0;
    }

    this.getStitchColour = function(stitchValue, rowI, rowStitchI) {

      if(((((rowI + 1) * ctrl.stitchesPerRow)) + rowStitchI) < ctrl.totalStitches - ctrl.stitch) {
        //stitch not done yet
        var onColour = isRightSide() ? '#B20000' : '#CECECE';
        var offColour = isRightSide() ? '#CECECE' : '#B20000';

        return stitchValue ? onColour : offColour;

      } else {
        // stitch done
        return 'green';

      }

    };

    $scope.$watch('ctrl.stitch', function(val) {
      if(typeof val === 'number') {
        localStorageService.set('stitch', val)
      }
    });
  });

