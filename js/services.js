/*global angular : true fixes codekit error*/
/*global Firebase : true fixes codekit error*/
angular.module('app.services', ['firebase'])
    .factory('emotionsdata', function($firebase) {
        var firebaseUrl = 'https://glaring-heat-7055.firebaseio.com/';
        var ref = new Firebase(firebaseUrl);
        var emotionsRef = ref.child('emotions2');
        var emotions = $firebase(emotionsRef).$asArray();

        return {
            all: function() {
                return emotions;
            },
            latest: function(emotion) {
                return $firebase(emotionsRef.child(emotion).limit(3)).$asArray();

            },
            add: function(emotion) {
                console.log('add', emotion)
                emotionsRef.child(emotion.name).push(emotion);
            },
            get: function(emotion) {
                return $firebase(emotionsRef.child(emotion)).$asArray();
            },
            update: function(emotion, currentData) {

                var get = function(name) {
                    console.log(name);
                    return currentData.filter(function(obj) {
                        if (obj.$id === name) {
                            return obj;
                        }
                    })[0];
                };

                var currentEmotionData = get(emotion.name);
                //console.log(currentEmotionData.colors[emotion.color.name]);
                var currentColorCount = 0;
                var currentRadiusCount = 0;
                var currentMotionCount = 0;
                if (currentEmotionData) {
                    if (currentEmotionData.colors) {
                        if (currentEmotionData.colors[emotion.color.name]) {
                            currentColorCount = currentEmotionData.colors[emotion.color.name].count;
                        }
                    }
                    if (currentEmotionData.radius) {
                        if (currentEmotionData.radius[emotion.radius]) {
                            currentRadiusCount = currentEmotionData.radius[emotion.radius].count;
                        }
                    }
                    if (currentEmotionData.motions) {
                        if (currentEmotionData.motions[emotion.motion.name]) {
                            currentMotionCount = currentEmotionData.motions[emotion.motion.name].count;
                        }
                    }
                }

                var colorCount = {
                    'hue': emotion.hue,
                    'count': currentColorCount + 1,
                };
                var radiusCount = {
                    'count': currentRadiusCount + 1,
                };
                var motionCount = {
                    'name': emotion.motion.name,
                    'count': currentMotionCount + 1,
                };


                // emotionsRef.child(emotion.name).child('colors').child(emotion.color.name).update(colorCount);
                // emotionsRef.child(emotion.name).child('radius').child(emotion.radius).update(radiusCount);
                // emotionsRef.child(emotion.name).child('motions').child(emotion.motion.name).update(motionCount);
                var obj = {};
                obj[emotion.name] = {};
                obj[emotion.name].colors = {};
                obj[emotion.name].radius = {};
                obj[emotion.name].motion = {};
                obj[emotion.name].colors[emotion.color.name] = colorCount;
                obj[emotion.name].radius[emotion.radius] = radiusCount;
                obj[emotion.name].motion[emotion.motion.name] = motionCount;
                // var obj = {
                //     'colors' : {
                //         emotion.color.name : colorCount
                //     },
                //     'radius' : {
                //         emotion.radius : radiusCount
                //     },
                //     'motion' : {
                //         emotion.motion.name : motionCount
                //     }
                // };

                console.log(obj);

                emotionsRef.update(obj);
            },
        };
    })
    .factory('motions', function() {
        var motions = ['bounce', 'wobble', 'tada', 'rubberBand', 'jello'];

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
            current: function() {
                var emotion = {
                    "name": this.random(),
                    "hue": 180,
                    "radius": 25,
                    "speed": -1,
                    "motion": "bounce",

                };
                return emotion;
            }
        };
    });