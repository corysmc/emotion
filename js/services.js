/* global Firebase : true */
var firebaseUrl = "https://envudu.firebaseio.com/";
angular.module('emotion.services', [])
    .factory('firebase', function($firebase) {
        var ref = new Firebase(firebaseUrl);
        var user = ref.getAuth();
        var envelopesRef = ref.child('users').child(user.uid).child('envelopes');
        var envelopes = $firebase(envelopesRef).$asArray();

        return {
            all: function() {
                return envelopes;
            },
            remove: function(envelopeID) {
                envelopesRef.child(envelopeID).remove();
            },
            get: function(id) {
                return envelopes.filter(function(obj) {
                    if (obj.id === id) {
                        return obj;
                    }
                })[0];
            },
            update: function(envelope) {
                console.log('update envelope: ', envelope);
                var rollover = false;
                if (envelope.rollover) {
                    rollover = envelope.rollovercat.name;
                }
                envelopesRef.child(envelope.$id).update({
                    "name": envelope.name,
                    "budget": envelope.budget,
                    "color": envelope.color,
                    "icon": envelope.icon,
                    "rollover": rollover,
                    "available": envelope.available,
                });
            },
            create: function(envelope) {
                var rollover = false;
                if (envelope.rollover) {
                    rollover = envelope.rollovercat.name;
                }
                if (envelope.type === "spending") {
                    envelopesRef.push({
                        "type": envelope.type,
                        "name": envelope.name,
                        "weeklytransfer": envelope.weeklytransfer,
                        "budget": envelope.budget,
                        "period": envelope.period,
                        "color": envelope.color,
                        "icon": envelope.icon,
                        "rollover": rollover,
                        "available": 0
                    });
                }
                if (envelope.type === 'savings') {
                    envelopesRef.push({
                        "type": envelope.type,
                        "name": envelope.name,
                        "weeklytransfer": envelope.weeklytransfer,
                        "goal": envelope.goal,
                        "date": new Date(envelope.date).getTime(),
                        "color": envelope.color,
                        "icon": envelope.icon,
                        "rollover": rollover,
                        "available": 0
                    });
                }
            }
        };
    });