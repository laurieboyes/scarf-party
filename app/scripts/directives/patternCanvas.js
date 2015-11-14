'use strict';

angular.module('knittingApp')
  .directive('patternCanvas', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/pattern-canvas.html',
      replace: true,
      scope: false,
      link: function(scope, element) {
        var patternContainer = element[0];
        var pattern = element.find('canvas');
        var ctx = pattern[0].getContext("2d");

        var canvasWidth = patternContainer.offsetWidth - 20;
        var canvasHeight = (scope.ctrl.imageHeight / scope.ctrl.imageWidth) * canvasWidth;
        scope.ctrl.canvasHeight = canvasHeight;

        var stitchWidth = canvasWidth / scope.ctrl.stitchesPerRow;
        var stitchHeight = canvasHeight / scope.ctrl.rows;

        pattern.attr('width', canvasWidth);
        pattern.attr('height', canvasHeight);

        function setPatternScroll() {
          patternContainer.scrollTop = (canvasHeight - (stitchHeight * scope.ctrl.getRow())) - (stitchHeight * 6);
        }

        function drawStitches() {

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          for(var i = 0; i < scope.ctrl.patternRows.length; i++) {
            for(var j = 0; j < scope.ctrl.getRowFlippedOrWhatever(i).length; j++) {

              var margin = 1;
              var stitch = scope.ctrl.getRowFlippedOrWhatever(i)[j];

              var left = j * stitchWidth + margin;
              var top = i * stitchHeight + margin;
              var width = stitchWidth - (margin * 2);
              var height = stitchHeight - (margin * 2);

              ctx.fillStyle= scope.ctrl.getStitchColour(stitch, i, j);
              ctx.fillRect(left, top, width, height);

            }
          }
        }

        scope.$watch('ctrl.stitch', function(val) {
          if(typeof val === 'number' && scope.ctrl.patternRows && scope.ctrl.patternRows.length) {
            drawStitches();
            setPatternScroll();
          }
        });

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
          for(var i = 0; i < pixelsMaybe.length; i++) {

            if(currentRow.length >= scope.ctrl.stitchesPerRow) {
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

        var img = new Image();
        img.onload = function() {
          loadImageAndStuff(img);
          drawStitches();
          setPatternScroll();
        };
        img.src = scope.ctrl.patternImageSrc;
      }
    }
  });
