'use strict';

/**
 * @ngdoc function
 * @name knittingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the knittingApp
 */
angular.module('knittingApp')

  .directive('patternDivs', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/pattern-divs.html',
      scope: false
    }
  })

  .directive('patternCanvas', function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'views/pattern-canvas.html',
      scope: false,
      link: function(scope, element) {
        var patternContainer = element.find('div')[0];
        var pattern = element.find('canvas');
        var ctx = pattern[0].getContext("2d");


        var canvasWidth = patternContainer.offsetWidth - 20;
        var canvasHeight = (scope.ctrl.imageHeight / scope.ctrl.imageWidth) * canvasWidth;

        var stitchWidth = canvasWidth / scope.ctrl.stitchesPerRow;
        var stitchHeight = canvasHeight / scope.ctrl.rows;

        pattern.attr('width', canvasWidth);
        pattern.attr('height', canvasHeight);


        function drawStitches() {
          for(var i = 0; i < scope.ctrl.patternRows.length; i++) {
            for(var j = 0; j < scope.ctrl.getRowFlippedOrWhatever(i).length; j++) {

              var stitch = scope.ctrl.getRowFlippedOrWhatever(i)[j];

              var left = j * stitchWidth;
              var top = i * stitchHeight;
              var width = stitchWidth;
              var height = stitchHeight;

              ctx.fillStyle= scope.ctrl.getStitchColour(stitch, i, j);
              ctx.fillRect(left, top, width, height);

            }
          }
        }

        scope.$watch('ctrl.stitch', function(val) {
          if(typeof val === 'number' && scope.ctrl.patternRows && scope.ctrl.patternRows.length) {
            drawStitches();
          }
        });

        scope.$on('image-ready', function() {
          drawStitches();
        })
    }
    }
  })

  .controller('MainCtrl', function ($scope, $timeout) {

    var ctrl = this;
    $scope.ctrl = ctrl;

    this.stitchesPerRow = 30;
    this.stitch = 7;
    this.rows = 251;
    this.totalStitches = this.stitchesPerRow * this.rows;

    this.imageWidth = 30;
    this.imageHeight = 251;

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


    // after dom loaded (sneaky sneaky)
    $timeout(function () {

      var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var img = document.getElementById("patternImage");

        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, c.width, c.height);

      var pixelsMaybe = [];

        // invert colors
        for (var i = 0; i < imgData.data.length; i += 4) {

          pixelsMaybe.push(imgData.data[i] > 127 ? 0 : 1);
        }



      var currentRow = [];
      var rows = [];
      var rowsReversed = [];
      for(var i = 0; i < pixelsMaybe.length; i++) {

        if(currentRow.length >= ctrl.stitchesPerRow) {
          rows.push(currentRow);

          var rowReversed = currentRow.slice();
          rowReversed.reverse();
          rowsReversed.push(rowReversed);

          currentRow = [];
        }
        currentRow.push(pixelsMaybe[i]);
      }

      ctrl.patternRows = rows;
      ctrl.patternRowsReversed = rowsReversed;

      $scope.$broadcast('image-ready');

      //logRows(rows);

      }, 300);

  });


function logRows(rows) {
  //print to be sure
  for(var i = 0; i < rows.length; i++) {
    var row = '';
    for(var j = 0; j < rows[i].length; j++) {
      row+= rows[i][j];
    }
    console.log(row);
  }
}
