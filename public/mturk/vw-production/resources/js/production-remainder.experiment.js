
var version = 'production_remainder';

function addObjectsToTimeline(timeline, list) {
  _.each(list, function(item, index, list) {
    timeline.push(item);
  });
  return timeline;
}

function randomCondition() {
  var coinFlip = Math.floor(Math.random() * 2);
  if(coinFlip == 1) { // If "NoContrast", choose from target and competitor
    return 'nc'
  }
  else { // Else, choose from target, competitor, and contrastDistractor
    return 'c'
  }
}

function randomTarget(condition) {
	if(condition == 'c')
		return 0;

	return targetId = Math.floor(Math.random() * 2);
}

function initProductionTrials() {
	var params = getAllUrlParams();
  var trials;

  if(params.condition === 'tmorec') {
    trials = tmc_trials;
    console.log('List set to tmorec_trials');
  }
  if(params.condition === 'tlessc') {
    trials = tlc_trials;
    console.log('List set to tlessc_trials');
  }
  if(params.condition === 'tequalc') {
    trials = tec_trials;
    console.log('List set to tequalc_trials');
  }

	// questions holds HTML-formated strings; targets stores chosen target for description
	var questions = [];
	var targets = [];

	// Keep track of how many of each contrast/nocontrast condition has been added to the experiment
	var quotas = {
	  'Test': {
	    'c': {
        'max_distractor': 2,
	      'cur_distractor': 0,
	    },
	    'nc': {
        'max_distractor': 2,
	      'cur_distractor': 0,
	      'max_contrastDistractor': 2,
	      'cur_contrastDistractor': 0
	    }
	  },
	  'Color': {
	    'c': {
	      'max_distractor': 1,
	      'cur_distractor': 0,
	    },
	    'nc': {
	      'max_distractor': 1,
	      'cur_distractor': 0,
	      'max_contrastDistractor': 1,
	      'cur_contrastDistractor': 0
	    }
	  }
	}

	var timeline = _.chain(params)
		.omit(['workerId', 'condition'])
		.map(function(value, key, list) {
			var i = key.replace('q', '');

			// Get trial to use from URL params
			var item = value;
			item = (item == undefined ? "1" : item);

			var condition = randomCondition();
			var targetId = randomTarget(condition);

			var trialType = trials[item + condition]['type'];

			if(trialType == 'Test' || trialType == 'Color') {
        var x = 0;
				while(quotas[trialType][condition]['cur_' + targetTypes[targetId]] == quotas[trialType][condition]['max_' + targetTypes[targetId]]) {
          x++;
					if(quotas[trialType]['c']['cur_distractor'] == quotas[trialType]['c']['max_distractor'] &&
						quotas[trialType]['nc']['cur_distractor'] == quotas[trialType]['nc']['max_distractor'] &&
						quotas[trialType]['nc']['cur_contrastDistractor'] == quotas[trialType]['nc']['max_contrastDistractor']) {

						console.log("ERROR: Quota is full! Current item: " + i);
						break;
				    }

            if(x > 20) {
              console.log("ERROR: Exceeded threshold.");
              break;
            }

				    condition = randomCondition();
				    targetId = randomTarget(condition);
				}

			    quotas[trialType][condition]['cur_' + targetTypes[targetId]] += 1;
			}

			// Get the objects for the trial and randomize them
			var objects = [trials[item + condition]['distractor'], trials[item + condition]['contrastDistractor'], trials[item + condition]['target'], trials[item + condition]['competitor']];

      console.log('Target image is ' + objects[targetId]);

      var shuffledObjects = jsPsych.randomization.shuffle(objects);

			// Need to find position of the target so we can point to it
			var pos = 0;
			for(var j = 0; j < objects.length; j++) {
				if(shuffledObjects[j] == objects[targetId])
					pos = j;
			}

			// Make question
			var question = '<p><b>' + i + '.</b></p><p><table style="margin: auto;"><tr><td><img src="resources/images/' + shuffledObjects[0] + '" /></td><td></td><td><img src="resources/images/' + shuffledObjects[1] + '" /></td></tr><tr><td></td><td><img src="resources/images/' + arrows[pos] + '" /></td><td></td></tr><tr><td><img src="resources/images/' + shuffledObjects[2] + '" /></td><td></td><td><img src="resources/images/' + shuffledObjects[3] + '" /></td></tr></table></p><br/><p class="text-center">"Click on the..."</p>'

      var trial = {
				type: 'vm-production-response',
				preamble: 'INSTRUCTIONS: Describe the object indicated by the arrow as if you are instructing a partner to click on it. Keep in mind that this partner can only see the images, not the arrow.',
				question: question,
				required: true,
				data: {
					question_number: i,
					item_number: item,
					trial__type: trialType,
					original_item_id: trials[item + condition].originalItemId,
					target_type: targetTypes[targetId],
					target_adjective: trials[item + condition].targetAdjective,
					target_condition: condition,
					target_image: trials[item + condition][targetTypes[targetId]],
					original_target: trials[item + condition].target,
					original_competitor: trials[item + condition].competitor,
					original_contrastDistractor: trials[item + condition].contrastDistractor,
					original_distractor: trials[item + condition].distractor
				},
				rows: 1,
				columns: 40,
				on_finish: function(data){
				}
			}

			//console.log(trial);

			if(i % 10 == 0) {
			   	trial["on_finish"] = function(data){
			    	saveData(jsPsych.data.dataAsCSV(), dataRef);
			    };
			}

			return trial;
		})
		.value();
	return timeline;
}
