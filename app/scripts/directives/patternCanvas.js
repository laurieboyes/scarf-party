'use strict';

angular.module('knittingApp')
  .directive('patternCanvas', function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'views/pattern-canvas.html',
      replace: true,
      scope: false,
      link: function (scope, element) {

        var patternContainer;
        var pattern;
        var ctx;
        var canvasWidth;
        var canvasHeight;
        var stitchWidth;
        var stitchHeight;

        var img;

        $timeout(function () {

          patternContainer = element[0];
          patternContainer.style.height = (scope.ctrl.getScreenHeight() / 4) + 'px';
          pattern = element.find('canvas');
          ctx = pattern[0].getContext("2d");

          canvasWidth = patternContainer.offsetWidth;
          canvasHeight = (scope.ctrl.imageHeight / scope.ctrl.imageWidth) * canvasWidth;
          scope.ctrl.canvasHeight = canvasHeight;

          stitchWidth = canvasWidth / scope.ctrl.stitchesPerRow;
          stitchHeight = canvasHeight / scope.ctrl.rows;

          pattern.attr('width', canvasWidth);
          pattern.attr('height', canvasHeight);

          scope.$watch('ctrl.stitch', function (val) {
            if (typeof val === 'number' && scope.ctrl.patternRows && scope.ctrl.patternRows.length) {
              drawStitches();
              setPatternScroll();
            }
          });

          img = new Image();
          img.onload = function () {
            loadImageAndStuff(img);
            drawStitches();
            setPatternScroll();
          };
          img.src = scope.ctrl.patternImageSrc;

        });

        function setPatternScroll() {
          patternContainer.scrollTop = (canvasHeight - (stitchHeight * scope.ctrl.getRow())) - (stitchHeight * 6);
        }

        function drawStitches() {

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          for (var i = 0; i < scope.ctrl.patternRows.length; i++) {
            for (var j = 0; j < scope.ctrl.getRowFlippedOrWhatever(i).length; j++) {

              var margin = scope.ctrl.isStitchDoneYet(i, j) ? 0 : 1;
              var stitch = scope.ctrl.getRowFlippedOrWhatever(i)[j];

              var left = j * stitchWidth + margin;
              var top = i * stitchHeight + margin;
              var width = stitchWidth - (margin * 2);
              var height = stitchHeight - (margin * 2);

              ctx.fillStyle = scope.ctrl.getStitchColour(stitch, i, j);
              ctx.fillRect(left, top, width, height);

            }
          }
        }

        function loadImageAndStuff(img) {

          var c = document.getElementById("tempCanvas");
          var ctx = c.getContext("2d");

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
          for (var i = 0; i < pixelsMaybe.length; i++) {

            if (currentRow.length >= scope.ctrl.stitchesPerRow) {
              rows.push(currentRow);

              var rowReversed = currentRow.slice();
              rowReversed.reverse();
              rowsReversed.push(rowReversed);

              currentRow = [];
            }
            currentRow.push(pixelsMaybe[i]);
          }

          scope.ctrl.patternRows = rows;
          scope.ctrl.patternRowsReversed = rowsReversed;

        }
      }
    }
  });
