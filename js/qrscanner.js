var qrscannerCrtl = angular.module('qrscanner', []);

qrscannerCrtl.controller('qrscannerCrtl', ['$scope', function($scope) {

  $scope.onSuccess = function(data) {
    console.log(data);
      alert(data);
    //window.URL = data;
  };
  $scope.onError = function(error) {
    console.log(error);
  };
  $scope.onVideoError = function(error) {
    console.log(error);
  };
}]);

qrscannerCrtl.directive('qrScanner', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      ngSuccess: '&ngSuccess',
      ngError: '&ngError',
      ngVideoError: '&ngVideoError'
    },
    link: function(scope, element, attrs) {
    
      window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
      var height = attrs.height || 100+"%";
      var width = attrs.width || 100+"%";
      var localMediaStream;
    
      var video = document.createElement('video');
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      video.setAttribute('autoplay','autoplay');
      var canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'qr-canvas');
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      canvas.setAttribute('style', 'display:none;'); 
    
      angular.element(element).append(video);
      angular.element(element).append(canvas);
      var context = canvas.getContext('2d'); 
    
      var scan = function() {
        if (localMediaStream) {
          context.drawImage(video, 0, 0,100,100);
          try {
            qrcode.decode();
          } catch(e) {
            scope.ngError({error: e});
            console.log(e);
          }
        }
        $timeout(scan, 100);
      }

      var successCallback = function(stream) {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        localMediaStream = stream;

        video.play();
        $timeout(scan, 1000);
      }

      /* Call the getUserMedia method with our callback functions
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, successCallback, function(e) {
          scope.ngVideoError({error: e});
        });
      } else {
        scope.ngVideoError({error: 'Native web camera streaming (getUserMedia) not supported in this browser.'});
      }*/

      qrcode.callback = function(data) {
        scope.ngSuccess({data: data});
      };


var videoSelect = document.querySelector("select#videoSource");

function gotSources(sourceInfos) {
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    var option = document.createElement("option");
    option.value = sourceInfo.id;

    if (sourceInfo.kind === 'video') {
      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }
}

if (typeof MediaStreamTrack === 'undefined'){
  scope.ngVideoError({error:'This browser does not support MediaStreamTrack.\n\n requires Chrome 30 or later to run.\n\nTry Chrome Canary.'});
} else {
  MediaStreamTrack.getSources(gotSources);
}

function start(){

var videoSource = videoSelect.value;
  var constraints = {
    video: {
      optional: [{sourceId: videoSource}]
    }
  };
  navigator.getUserMedia(constraints, successCallback, function(e) {
    scope.ngVideoError({error: e});
  });
}
 videoSelect.onchange = start
 //start();
    }
  }
}]);