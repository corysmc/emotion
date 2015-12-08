/*global angular : true fixes codekit error*/
/*global Firebase : true fixes codekit error*/
angular.module('app.services', ['firebase'])
    .factory('emotionsdata', function($firebase) {
        var firebaseUrl = 'https://e-motion.firebaseio.com/';
        var ref = new Firebase(firebaseUrl);
        var emotionsRef = ref.child('emotions');
        var emotions = $firebase(emotionsRef).$asArray();

        return {
            all: function() {
                return emotions;
            },
            add: function(emotion) {
                //console.log('add', emotion)
                emotion.timestamp = Firebase.ServerValue.TIMESTAMP;
                emotionsRef.child(emotion.name).push(emotion);
            },
            get: function(emotion) {
                return $firebase(emotionsRef.child(emotion)).$asArray();
            },
            number: function() {
                return $firebase(emotionsRef.child('number')).$asObject();
            }
        };
    })
    .factory('motions', function() {
        var motions = ['Bounce', 'Wobble', 'Tada', 'RubberBand', 'Jello'];

        return motions;
    })
    .factory('emotions', function() {
        var emotions = ['Joy', 'Aniticipation', 'Anger', 'Disgust', 'Sadness', 'Surprise', 'Fear', 'Trust'];


        return {
            all: function() {
                return emotions;
            },
            random: function() {
                var random = emotions[Math.floor(Math.random() * emotions.length)];
                //var random = emotions[4];
                return random;
            },
            next: function(number) {
                var next = emotions[number];
                //var random = emotions[4];
                return next;
            },
            current: function() {
                var emotion = {
                    "name": this.random(),
                    "hue": 180,
                    "radius": 25,
                    "speed": -1,
                    "motion": "Bounce",

                };
                return emotion;
            }
        };
    });