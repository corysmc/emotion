/*global angular : true fixes codekit error*/
angular.module('app.services', [])
    .factory('services', function() {
        var service = [{
            id: 1,
            animation: 'cubic',
            question: 'What do you think?',
            name: 'Q1',

            //Basic Particle Components
        }, {
            id: 2,
            animation: 'cubic',
            question: 'What are you thinking?',
            name: 'Q2',

            //Basic Particle Components
        }, {
            id: 3,
            animation: 'cubic',
            question: 'What do you think?',
            name: 'Q3',

            //Basic Particle Components
        }, {
            id: 4,
            animation: 'cubic',
            question: 'What are you thinking?',
            name: 'Q4',

            //Basic Particle Components
        }, {
            id: 5,
            animation: 'cubic',
            question: 'What do you think?',
            name: 'Q5',

            //Basic Particle Components
        }, {
            id: 6,
            animation: 'cubic',
            question: 'What are you thinking?',
            name: 'Q6',

            //Basic Particle Components
        }];

        return {
            all: function() {
                return service;
            },
            get: function(id) {

                return service.filter(function(obj) {
                    if (obj.id === id) {
                        return obj;
                    }
                })[0];
            }

        };
    })
    .factory('colors', function() {
        var colors = [{
            'name': 'white',
            'hex': '#FFF',
            "font": '#333'
        }, {
            'name': 'yellow',
            'hex': '#F8BD0B',
            "font": '#333'
        }, {
            'name': 'orange',
            'hex': '#FD8344',
            "font": '#333'
        }, {
            'name': 'red',
            'hex': '#FC1343',
            "font": '#FFF'
        }, {
            'name': 'purple',
            'hex': '#CD7BDD',
            "font": '#333'
        }, {
            'name': 'blue',
            'hex': '#007CDC',
            "font": '#FFF'
        }, {
            'name': 'green',
            'hex': '#8BC443',
            "font": '#333'
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
        return {
            all: function() {
                return emotions;
            },
            random: function() {
                var random = emotions[Math.floor(Math.random() * emotions.length)];
                return random;
            }

        };
    });