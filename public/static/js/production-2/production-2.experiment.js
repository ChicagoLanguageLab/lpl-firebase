// production-2.experiment.js
// Defines the experiment object.

/** Construct an instance of the Production2Experiment class.
  * @constructor
  * @param {Object} params - A collection of parameters.
  */
function Production2Experiment(params) {

  var trials = []
  _.each(params.trials, function(trial) {

    var item = trial[0];
    var condition = trial[1];

    var coinflip = Math.floor(Math.random() * 2 + 1);
    var order = coinflip === 1? 'name_first' : 'noun_first';

    var jsp_trial = {
      'type': 'production-response',
      'verb': params.items[item].conditions[condition],
      'data': {
        'item': item,
        'condition': condition,
        'name': params.items[item].name,
        'noun': params.items[item].noun,
        'verb': params.items[item].conditions[condition],
        'order': order
      }
    };

    if(order === 'name_first') {
      jsp_trial.noun1 = jsp_trial.data.name;
      jsp_trial.noun2 = jsp_trial.data.noun;
    }
    else {
      jsp_trial.noun1 = jsp_trial.data.noun;
      jsp_trial.noun2 = jsp_trial.data.name;
    }

    trials.push(jsp_trial);

  });

  this.getTimeline = function() {
    return trials;
  }

  var subjectId = params.subjectId;
  this.getSubjectId = function() {
    return subjectId;
  }

  this.initTimeline = function() {
    var timeline = [];
  }
}
