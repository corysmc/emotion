/*global angular : true fixes codekit error*/
var personalityApp = angular.module('personalityApp', ['ngRoute', 'ngAnimate', 'app.services', 'highcharts-ng', 'chart.js', '720kb.socialshare']);

personalityApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/builder.html',
            controller: 'mainController'
        })
        .when('/results', {
            templateUrl: 'templates/results.html',
            controller: 'resultsController'
        })
        .when('/results/:id', {
            templateUrl: 'templates/results.html',
            controller: 'resultsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

personalityApp.controller('mainController', function($scope, $location, $timeout, motions, emotions, emotionsdata) {
    $scope.motions = motions;
    $scope.Q = 1;
    $scope.emotions = emotions.all();
    $scope.emotion = emotions.current();
    $scope.animation = emotions.current().motion;
    //find lowest entry
    $scope.allEmotions = emotionsdata.all();

    $scope.allEmotions.$loaded().then(function() {
        var emotiongroupmin = 1000000;

        function ObjectLength(object) {
            var length = 0;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ++length;
                }
            }
            return length;
        }

        angular.forEach($scope.allEmotions, function(emotiongroup) {
            //console.log(ObjectLength(emotiongroup));

            if (ObjectLength(emotiongroup) < emotiongroupmin) {
                emotiongroupmin = ObjectLength(emotiongroup);
                //console.log('new min', emotiongroup.$id, ObjectLength(emotiongroup));
                lowestEmotionCount = emotiongroup.$id;
            }

        });
        //console.log('lowest', lowestEmotionCount)
        $scope.emotion.name = lowestEmotionCount;

    });

    $scope.changeMotion = function(motion) {
        console.log('motion', motion);
        $scope.animation = null;

        $timeout(function() {
            $scope.animation = motion;
        }, 10);
    };
    $scope.submitEmotion = function(Q, emotion) {
        if (Q === 3) {
            var path = '/results/' + emotion.name;
            $location.path(path);

            //emotionsdata.update(emotion, emotionsdata.all());
            emotionsdata.add(emotion);
        } else {

            $scope.Q = (Q + 1);
        }
    };
    $scope.$watch('Q', function(newValue) {
            if ($scope.Q === 3) {
                $scope.infinite = "infinite";
            } else {
                $scope.infinite = "";
            }
        })
        //this function adds active class to sidebar items//
    $scope.isActive = function(viewRoot, viewEnd) {
        var viewLocation = viewRoot + viewEnd;
        var active = (viewLocation === $location.url());
        return active;

    };
    //this finds the lowest count of data.
});
personalityApp.controller('resultsController', function($scope, $location, emotionsdata, $routeParams) {
    //gets emotion name from URL
    $scope.emotionResult = $routeParams.id;
    $scope.emotionResults = emotionsdata.get($scope.emotionResult);

    $scope.averageEmotion = {};

    $scope.emotionResults.$loaded().then(function() {
        sliceData();
    });

    $scope.changeResults = function(emotion) {
        $location.path('/results/' + emotion);
    };

    var sliceData = function() {
            var hue = 0;
            var radius = 0;
            var speed = 0;
            motions = [];
            hues = [];
            radii = [];
            speeds = [];
            angular.forEach($scope.emotionResults, function(emotion) {
                hue += Number(emotion.hue);
                radius += Number(emotion.radius);
                speed += Number(emotion.speed);

                //create array of motions
                motions.push(emotion.motion);
                hues.push(emotion.hue);
                radii.push(emotion.radius);
                speeds.push(emotion.speed);
                //console.log(hueCount, hue, emotion.hue);
            });
            $scope.averageEmotion.radius = (radius / $scope.emotionResults.length);
            //$scope.averageEmotion.hue = (hue / $scope.emotionResults.length);
            $scope.averageEmotion.hue = averageAngles(hues);
            $scope.averageEmotion.speed = (speed / $scope.emotionResults.length);
            console.log('average', $scope.averageEmotion.hue);

            //convert to polar cartesian coordinates to average correctly

            function averageAngles(hues) {
                var x = 0;
                var y = 0;
                angular.forEach(hues, function(hue) {
                    var radian = hue * Math.PI / 180;
                    //console.log(Math.cos(radian));

                    x += Math.cos(radian);
                    y += Math.sin(radian);
                });
                var aveX = x / $scope.emotionResults.length;
                var aveY = y / $scope.emotionResults.length;
                //console.log('x', aveX, 'y', aveY)

                var radians = Math.atan2(aveY , aveX);
                //console.log('radians', radians);
                var degrees = radians * (180 / Math.PI);
                if(degrees < 0){
                    degrees = degrees + 360;
                }
                return degrees;
            };
        //which motion has the highest count
    $scope.averageEmotion.motion = mode(motions);

    //Data for motion pie Chart 
    $scope.motionLabels = countDuplicates(motions)[0];
    $scope.motionData = countDuplicates(motions)[1];

    //colors array for chart
    var colors = []
    var colorcount = 0;
    angular.forEach(countDuplicates(hues)[0], function(hue) {
            colors.push([Number(hue), countDuplicates(hues)[1][colorcount]]);
            colorcount++;
        })
        //console.log('colors', colors[0])
    $scope.colorColors = colors;

    //radius array for chart
    var radiuss = []
    var radiuscount = 0;
    angular.forEach(countDuplicates(radii)[0], function(radius) {
            radiuss.push([Number(radius), countDuplicates(radii)[1][radiuscount]]);
            radiuscount++;
        })
        //console.log('radii', radiuss[0])
    $scope.radii = radiuss;

    //speed array for chart
    var speedss = []
    var speedcount = 0;
    angular.forEach(countDuplicates(speeds)[0], function(speed) {
            speedss.push([Number(-speed), countDuplicates(speeds)[1][speedcount]]);
            speedcount++;
        })
        //console.log('speed', speedss[0])
    $scope.speeds = speedss;

    function countInArray(array, what) {
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] == what) {
                count++;
            }
        }
        return count;
    };

    $scope.colorChartConfig = {
        "options": {
            "chart": {
                "type": "scatter",
                "backgroundColor": 'transparent',
                events: {
                    load: function() {
                        this.renderer.image('img/hue.png', 10, 10, '95.5%', 126).add(); // add image(url, x, y, w, h) old value with y axis(40, 10, '89%', 376)
                    }
                }
            },
            "tooltip": {
                formatter: function() {
                    var personpeople = 'People';
                    if (this.y == 1) {
                        personpeople = 'Person'
                    };
                    return '<b>' + this.y + '</b> ' + personpeople + ' chose <b>' + this.x + '</b>';
                }
            },
            "plotOptions": {
                "series": {
                    "stacking": "normal"
                }
            }
        },
        "series": [{
            "color": "#fff",
            "showInLegend": false,
            "data": $scope.colorColors,
            "id": "series-0",
            "name": "Other Hue Values"
        }],
        "title": {
            "text": ""
        },
        "xAxis": {
            "min": 0,
            "max": 360,
            "gridLineColor": "transparent",
            "title": {
                "text": null
            },
            "labels": {
                "enabled": false
            }
        },
        "yAxis": {
            "gridLineColor": "transparent",
            "title": {
                "text": null
            },
            "labels": {
                "enabled": false
            }
        },
        "credits": {
            "enabled": false
        },
        "loading": false,
        "size": {},
        "tooltip": {
            backgroundColor: 'rgba(0,0,0,.5)',
            borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3
        }
    };

    $scope.radiusChartConfig = {
        "options": {
            "chart": {
                "type": "scatter",
                "backgroundColor": 'transparent',
            },
            "tooltip": {
                formatter: function() {
                    var personpeople = 'People';
                    if (this.y == 1) {
                        personpeople = 'Person'
                    };
                    return '<b>' + this.y + '</b> ' + personpeople + ' chose <b>' + this.x + '% radius</b>';
                }
            },
            "plotOptions": {
                "series": {
                    "stacking": "normal"
                }
            }
        },
        "series": [{
            "color": "#999",
            "showInLegend": false,
            "data": $scope.radii,
            "id": "series-0",
            "name": "Other Hue Values"
        }],
        "title": {
            "text": ""
        },
        "xAxis": {
            "min": 0,
            "max": 50,
            "title": {
                "text": null
            },
        },
        "yAxis": {
            "title": {
                "text": null
            },
        },
        "credits": {
            "enabled": false
        },
        "loading": false,
        "size": {},
        "tooltip": {
            backgroundColor: 'rgba(0,0,0,.5)',
            borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3
        }
    };
    $scope.speedChartConfig = {
        "options": {
            "chart": {
                "type": "scatter",
                "backgroundColor": 'transparent',
            },
            "tooltip": {
                formatter: function() {
                    var personpeople = 'People';
                    if (this.y == 1) {
                        personpeople = 'Person'
                    };
                    return '<b>' + this.y + '</b> ' + personpeople + ' chose <b>' + this.x + 's</b>';
                }
            },
            "plotOptions": {
                "series": {
                    "stacking": "normal"
                }
            }
        },
        "series": [{
            "color": "#999",
            "showInLegend": false,
            "data": $scope.speeds,
            "id": "series-0",
            "name": "Other Hue Values"
        }],
        "title": {
            "text": ""
        },
        "xAxis": {
            "min": .2,
            "max": 2,
            "reversed": false,
            "title": {
                "text": null
            },
        },
        "yAxis": {
            "title": {
                "text": null
            },
        },
        "credits": {
            "enabled": false
        },
        "loading": false,
        "size": {},
        "tooltip": {
            backgroundColor: 'rgba(0,0,0,.5)',
            borderColor: 'black',
            borderRadius: 10,
            borderWidth: 3
        }
    };
};

function mode(array) {
    if (array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0],
        maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;

    //create color chart

}
//returns array that removes duplicates -> a
//returns array of the count of each in array a -> b
function countDuplicates(arr) {
    var a = [],
        b = [],
        prev;

    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length - 1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

$scope.restart = function() {
    $location.path('/');
};
});

personalityApp.controller('socialShare', function($scope) {
    $scope.social = {
        url: 'http://corysmc.github.io/emotion/',
        img: 'http://corysmc.github.io/emotion/img/social-share.png',
        text: 'Design an emotion, see the results, and compare your design to others.',
        hastags: 'design, emotion, coding, web design'


    }

});