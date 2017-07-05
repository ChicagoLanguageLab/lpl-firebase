// production-utils.js

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
		return Math.floor(Math.random() * 3);

	return targetId = Math.floor(Math.random() * 2);
}

function initProductionTrials() {
	var params = getAllUrlParams();

	// questions holds HTML-formated strings; targets stores chosen target for description
	var questions = [];
	var targets = [];

	// Keep track of how many of each contrast/nocontrast condition has been added to the experiment
	var quotas = {
	  'Test': {
	    'c': {
	      'max_target': 2,
	      'cur_target': 0,
	      'max_competitor': 2,
	      'cur_competitor': 0,
	      'max_contrastDistractor': 2,
	      'cur_contrastDistractor': 0
	    },
	    'nc': {
	      'max_target': 2,
	      'cur_target': 0,
	      'max_competitor': 2,
	      'cur_competitor': 0
	    }
	  },
	  'Color': {
	    'c': {
	      'max_target': 1,
	      'cur_target': 0,
	      'max_competitor': 1,
	      'cur_competitor': 0,
	      'max_contrastDistractor': 1,
	      'cur_contrastDistractor': 0
	    },
	    'nc': {
	      'max_target': 1,
	      'cur_target': 0,
	      'max_competitor': 1,
	      'cur_competitor': 0
	    }
	  }
	}
	
	var timeline = _.chain(params)
		.omit('workerId')
		.map(function(value, key, list) {
			var i = key.replace('q', '');

			// Get trial to use from URL params
			var item = value;
			item = (item == undefined ? "1" : item);

			var condition = randomCondition();
			var targetId = randomTarget(condition);
			
			var trialType = trials[item + condition]['type'];

			if(trialType == 'Test' || trialType == 'Color') {

				while(quotas[trialType][condition]['cur_' + targetTypes[targetId]] == quotas[trialType][condition]['max_' + targetTypes[targetId]]) {
			    
					if(quotas[trialType]['c']['cur_target'] == quotas[trialType]['c']['max_target'] &&
						quotas[trialType]['c']['cur_competitor'] == quotas[trialType]['c']['max_competitor'] && 
						quotas[trialType]['c']['cur_contrastDistractor'] == quotas[trialType]['c']['max_contrastDistractor'] &&
						quotas[trialType]['nc']['cur_target'] == quotas[trialType]['nc']['max_target'] &&
						quotas[trialType]['nc']['cur_competitor'] == quotas[trialType]['nc']['max_competitor']) {

						console.log("ERROR: Quotas are full! Current item: " + i);
						break;
				    }

				    condition = randomCondition();
				    targetId = randomTarget(condition);
				}

			    quotas[trialType][condition]['cur_' + targetTypes[targetId]] += 1;
			}

			// Get the objects for the trial and randomize them
			var objects = [trials[item + condition]['target'], trials[item + condition]['competitor'], trials[item + condition]['contrastDistractor'], trials[item + condition]['distractor']];
			var shuffledObjects = jsPsych.randomization.shuffle(objects);

			// Need to find position of the target so we can point to it
			var pos = 0;
			for(var j = 0; j < objects.length; j++) {
				if(shuffledObjects[j] == objects[targetId])
					pos = j;
			}

			// Make question
			var question = '<p><b>' + i + '.</b></p><table><tr><td><img width="150" src="../static/images/production/' + shuffledObjects[0] + '" /></td><td></td><td><img width="150" src="../static/images/production/' + shuffledObjects[1] + '" /></td></tr><tr><td></td><td><img width="150" src="../static/images/production/' + arrows[pos] + '" /></td><td></td></tr><tr><td><img width="150" src="../static/images/production/' + shuffledObjects[2] + '" /></td><td></td><td><img width="150" src="../static/images/production/' + shuffledObjects[3] + '" /></td></tr></table><br/><p>"Click on the..."</p>'
			//console.log(trialType);
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