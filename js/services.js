/*global angular : true fixes codekit error*/
/*global Firebase : true fixes codekit error*/
angular.module('app.services', ['firebase'])
    .factory('emotionsdata', function($firebase) {
        var firebaseUrl = 'https://glaring-heat-7055.firebaseio.com/';
        var ref = new Firebase(firebaseUrl);
        var emotionsRef = ref.child('emotions');
        var emotions = $firebase(emotionsRef).$asArray();
        return {
            all: function() {
                return emotions;
            },
            get: function(name) {
                console.log(name);
                return emotions.filter(function(obj) {
                    if (obj.name === name) {
                        return obj;
                    }
                })[0];
            },
            update: function(emotion, count) {

                console.log('update emotion: ', emotion);
                emotionsRef.child(emotion.name).update({
                    "test": "test"
                });
            },
        };
    })
    .factory('colors', function() {
        var colors = [{
            'name': 'yellow',
            'hex': '#F8BD0B',
            "font": '#333'
        }, {
            'name': 'orange',
            'hex': '#FD8344',
            "font": '#FFF'
        }, {
            'name': 'red',
            'hex': '#FC1343',
            "font": '#FFF'
        }, {
            'name': 'purple',
            'hex': '#CD7BDD',
            "font": '#FFF'
        }, {
            'name': 'blue',
            'hex': '#007CDC',
            "font": '#FFF'
        }, {
            'name': 'green',
            'hex': '#8BC443',
            "font": '#FFF'
        }, {
            'name': 'grey',
            'hex': '#D0D1D5',
            "font": '#333'
        }];

        return colors;
    })
    .factory('motions', function() {
        var motions = [{
            'name': 'ease',
            'cubicbezier': '.25,.1,.25,1'
        }, {
            'name': 'linear',
            'cubicbezier': '0,0,1,1'
        }, {
            'name': 'ease-in',
            'cubicbezier': '.42,0,1,1'
        }, {
            'name': 'ease-out',
            'cubicbezier': '0,0,.58,1'
        }, {
            'name': 'ease-in-out',
            'cubicbezier': '.42,0,.58,1'
        }, {
            'name': 'snap',
            'cubicbezier': '.4,.01,1,.5'
        }, {
            'name': 'Bounce',
            'cubicbezier': '.42,0,.58,1'
        }];
        return motions;
    })
    .factory('emotions', function() {
        var emotions = ['interest', 'aniticipation', 'serenity', 'love', 'agressiveness', 'contempt', 'remorse'];
        var emotion = {
            "color": {
                "name": "blue",
                "hex": "#007CDC",
                "font": "#FFF",
            },
            "radius": "0",
            "motion": {
                "name": "ease-out",
                "cubicbezier": "0,0,.58,1"
            }
        };
        return {
            all: function() {
                return emotions;
            },
            random: function() {
                var random = emotions[Math.floor(Math.random() * emotions.length)];
                return random;
            },
            current: function() {
                return emotion;
            }

        };
    });