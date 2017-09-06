/** adaptation.utils.js
 * @fileoverview Utilities for the adaptation experiment.
 */

/**
 * @namespace
 */
var AdaptationUtils = {
  /** Sample trials from a set of trials.
   *
   * @param {Array<object>} trials - An array of trials to cample from.
   * @param {Number} sample_size - The number of trials to sample.
   * @returns {Array<object>}
   */
  sampleTrials: function(trials, sample_size) {
    return jsPsych.randomization.sample(trials, sample_size, true);
  },

  /** Calculate the most ambiguous scale point for a given stimulus.
   *
   * @param {String} stimulus - Name of the stimulus to check.
   * @returns {Number}
   */
  calculateAmbiguousPoint: function(stimulus) {
    lr = new LogReg(5, 1);
    lr.init([1,2,3,4,5]);

    var trials = jsPsych.data.getLastTimelineData();

    _.each(trials, function(trial) {
      try {
        lr.addObs(trial.scalepos - 1, trial.has_prop);
      }
      catch (e) {
        xint = 3;
        return;
      }
    });

    lr.fit();

    var xint = lr.xint();
    if(xint == null || isNaN(xint)) {
      xint = 3;
    }

    var best = 10000;
    var ambiguous_point = -1;
    for (var j=0; j<6; j++) {
      var dif = Math.abs(xint-j);
      if (dif < best) {
          best = dif;
          ambiguous_point = j;
      }
    }

    return ambiguous_point;
  },

  /** Adjust the ambiguous point as needed.
   *
   * @param {number} ambiguous_point - The original ambiguous point.
   */
  tweakAmbiguousPoint: function(ambiguous_point) {
    if(ambiguous_point <= 1)
      return 2;
    if(ambiguous_point >= 5)
      return 4;
    return ambiguous_point;
  },

  /** Add the subject's ambiguous point and tweaked ambiguous point to jsPsych's data.
   *
   * @param {String} stim_name - The name of the stimulus.
   * @param {Number} ambiguous_point - The base ambiguous point for this stimulus.
   */
  addAmbiguousPointToData: function(stim_name, ambiguous_point) {
    var ambig_prop = {};
    var tweaked_ambiguous_point = AdaptationUtils.tweakAmbiguousPoint(ambiguous_point);

    ambig_prop[stim_name + 'CorrectedAmbiguousPoint'] = tweaked_ambiguous_point;
    ambig_prop[stim_name + 'OriginalAmbiguousPoint'] = ambiguous_point;

    jsPsych.data.addProperties(ambig_prop);
  },

  /**
    * Calculate the scale position to use in an exposure trial.
    * @param {String} condition - The experimental condition.
    * @param {String} subcondition - The experimental subcondition.
    * @param {String} stimulus - The name of the stimulus.
    * @returns {Array<Object>}
  */
  calculateExposureScalepos: function(condition, subcondition, stimulus) {
    if(condition === 'ambiguous') {
      return jsPsych.data.getLastTrialData()[stimulus + 'CorrectedAmbiguousPoint'];
    }

    if(condition === 'prototypical' && subcondition == 'neg') {
      return 1;
    }

    return 5;
  },

  /**
    * Adjust the ambiguous point a given amount.
    * @param {Number} ambiguous_point - The ambiguous point.
    * @param {Number} scale_adjustment - The amount to adjust the ambiguous point by.
    * @returns {Array<Object>}
  */
  adjustAmbiguousPoint: function(ambiguous_point, scale_adjustment) {
    if(ambiguous_point + scale_adjustment > 1 && ambiguous_point + scale_adjustment < 5)
      return ambiguous_point + scale_adjustment;
    else if(ambiguous_point + scale_adjustment <= 1)
      return 2;

    return 4;
  }
}
