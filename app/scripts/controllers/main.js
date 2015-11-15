'use strict';

angular.module('knittingApp')
  .controller('MainCtrl', function ($scope, localStorageService) {

    var ctrl = this;
    $scope.ctrl = ctrl;

    this.patternImageSrc = 'images/finalharoltheo.png';

    this.stitchesPerRow = 30;
    this.stitch = +localStorageService.get('stitch') || 0;
    this.rows = 300;
    this.totalStitches = this.stitchesPerRow * this.rows;

    this.imageWidth = 30;
    this.imageHeight = 300;

    this.getRow = function () {
      return Math.ceil(this.stitch / (this.stitchesPerRow)) + (!this.getRowStitch() ? 1 : 0);
    };

    this.getRowStitch = function () {
      return this.stitch % this.stitchesPerRow;
    };

    this.getRowFlippedOrWhatever = function (rowI) {
      if(this.isRightSide()) {
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

    this.prevStitch = function (decrease) {
      return this.stitch = +this.stitch - (decrease ? decrease : 1);
    };

    this.getScreenHeight = function() {
      return window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    };

    this.isRightSide = function() {
      return Math.floor(ctrl.stitch / ctrl.stitchesPerRow) % 2 === 0;
    };

    this.isStitchDoneYet = function(rowI, rowStitchI) {
        return !(((((rowI + 1) * ctrl.stitchesPerRow)) + rowStitchI) < ctrl.totalStitches - ctrl.stitch);
    };

    this.getStitchColour = function(stitchValue, rowI, rowStitchI) {

      if(!this.isStitchDoneYet(rowI, rowStitchI)) {
        //stitch not done yet
        var onColour = this.isRightSide() ? '#B20000' : '#CECECE';
        var offColour = this.isRightSide() ? '#CECECE' : '#B20000';

      } else {
        // stitch done
        var onColour = this.isRightSide() ? '#660000' : '#808080';
        var offColour = this.isRightSide() ? '#808080' : '#660000';
      }

      return stitchValue ? onColour : offColour;

    };

    $scope.$watch('ctrl.stitch', function(val) {
      if(typeof val === 'number') {
        localStorageService.set('stitch', val)
      }
    });
  });

