// ospan-utils.js

var results;

function makeFeedback(type) {
  return ({
    type: 'single-stim',
    is_html: true,
    timing_response: -1, 
    choices: [' '],
    stimulus: function() { return displayFeedback(type); },
    on_finish: function(data) {
      if(data.ospan_type == "Experiment")
        saveData(jsPsych.data.dataAsCSV(), dataRef); 
    }
  });
}

function displayFeedback(type) {
  var trialData = jsPsych.data.getLastTrialData();
  var timelineData = jsPsych.data.getLastTimelineData();

  var feedback;
  var color;
  var totalPercentString = '';

  if(type == "LetterPractice" || type == "BothPractice" || type == "Experiment") {
    
    feedback = "<p>You correctly recalled " + trialData.letters_correct + " out of " + trialData.total_letters + " letters.</p>";

    color = 'style="color: black"';

    if(type == "BothPractice" || type == "Experiment") {

      // Data for TOTAL math correctness
      var totalMathResponseData = _.filter(jsPsych.data.getTrialsOfType("ospan-math-response"), function(obj) { return obj.ospan_type == type; });
      var totalMathProblemData = _.filter(jsPsych.data.getTrialsOfType("ospan-math-stim"), function(obj) { return obj.ospan_type == type; });

      // Calculate TOTAL percent correct
      var totalMathResponseSum = _.reduce(totalMathResponseData, function(memo, obj) { return memo + obj.correct; }, 0);
      var totalPercentCorrect = (totalMathResponseSum / totalMathProblemData.length) * 100.0;

      // Data for LOCAL math correctness
      var localMathResponseData = _.filter(timelineData, function(obj) { return obj.trial_type == "ospan-math-response"; });
      var localMathProblemData = _.filter(timelineData, function(obj) { return obj.trial_type == "ospan-math-stim"; });
      
      var localMathResponseSum = _.reduce(localMathResponseData, function(memo, obj) { return memo + obj.correct; }, 0);
      
      var localMathPercentCorrect =  (localMathResponseSum / localMathProblemData.length) * 100.0;
      var localMathPercentString = '<p>You answered ' + localMathResponseSum + ' out of ' + localMathProblemData.length + ' math problems correctly (' + precise_round(localMathPercentCorrect, 2) + '%).</p>';

      if(type == "Experiment") {
        // Calculate letter correctness
        var letterData = _.filter(jsPsych.data.getTrialsOfType("ospan-letter-response"), function(obj) {
          return obj.ospan_type == type;
        });
        
        var allOrNothingSum = _.reduce(letterData, function(memo, obj) { return memo + obj.correct; }, 0);
        var correctLetterSum = _.reduce(letterData, function(memo, obj) { return memo + obj.letters_correct; }, 0);
        var totalLetters = _.reduce(letterData, function(memo, obj) { return memo + obj.total_letters; }, 0);

        // Store totals
        var dataRef = database.ref("ospan" + '/' + workerId);
        results = {
          total_math_problems: totalMathProblemData.length,
          total_math_wrong: totalMathProblemData.length - totalMathResponseSum,
          total_math_accuracy_errors: _.filter(totalMathResponseData, function(obj){return obj.correct == 0}).length,
          total_math_speed_errors: totalMathProblemData.length - totalMathResponseData.length,
          total_strings: letterData.length,
          total_letters: totalLetters,
          total_strings_correct: allOrNothingSum,
          total_letters_correct: correctLetterSum
        }
        dataRef.set(results);
      }

      totalPercentString = '<p style="color:red;">Total math score: ' + precise_round(totalPercentCorrect, 2) + '%</p>';
      feedback += localMathPercentString;
    }
  }

  if(type == "MathPractice") {
    if(trialData.correct) {
      feedback = '<p class="large">Correct</p>';
      color = 'style="color: green"';
    }
    else {
      feedback = '<p class="large">Incorrect</p>';
      color = 'style="color: red"';
    }
  }

  return totalPercentString + '<div class="center-screen center-content"><span ' + color + '>' + feedback + '</span><p class="center-content small">Press space to continue.</p></div>';
}

function makeLetterStimulus(letter) {
  return ({
    type: "ospan-letter-stim",
    is_html: true,
    stimulus: '<div class="center-screen very-large">' + letter + '</div>',
    timing_response: 1000,
    response_ends_trial: false,
    choices: []
  });
}

function initMathProblems(size) {
  var timeline = [];

  var firstOpts = jsPsych.randomization.shuffle(mathOpt1);
  var signs = jsPsych.randomization.shuffle(mathSign);
  var secondOpts = jsPsych.randomization.shuffle(mathOpt2);
  var corrects = jsPsych.randomization.shuffle(mathCorrect);

  for(var i = 0; i < size; i++) {    
    var opt1 = firstOpts.pop();
    var sign = signs.pop();
    var opt2 = secondOpts.pop();
    var correct = corrects.pop();

    timeline.push(initMathProblem1(0, opt1, sign, opt2, correct, 0));
  }
  return timeline;
}

function initMathProblem1(count, opt1, sign, opt2, correct, opt2sign) {
  count++;
  //console.log("InitMathProblem1 Count: " + count);

  if(count == 1) {
    //console.log("Initial values:\n" + "Opt1: " + opt1 + "\nSign: " + sign + "\nOpt2: " + opt2 + "\nCorrect: " + correct);
    
    opt2sign = parseInt(sign + opt2, 10);
    //console.log("Initial opt2sign: " + opt2sign);
  }
  else if(count > 1) {
    opt2sign += 3;
    //console.log("New opt2sign: " + opt2sign);
    
    opt2 = Math.abs(opt2sign).toString();
    //console.log("New opt2: " + opt2);
    
    if(opt2sign > 0) {
      sign = "+";
    }
    //console.log("New sign: " + sign);
  }
  
  var problem = opt1 + " " + sign + " " + opt2;
  //console.log("Problem: " + problem);

  var trueAnswer = eval(problem);
  

  if(trueAnswer < 0 || opt2 == 0) {
    //console.log("Re-running initialization...");
    return initMathProblem1(count, opt1, sign, opt2, correct, opt2sign);
  }
  else if(trueAnswer >= 0) {
    if(correct == "TRUE") {
      //console.log("Correct answer is TRUE; finishing with values:\n Problem: " + problem + "\nAnswer:" + trueAnswer + "\nCorrect: " + correct);
      return ({
        problem: problem,
        answer: trueAnswer,
        correct: correct
      });
    }
    else {
      //console.log("Correct answer is FALSE; continuing.");
      console.log("True answer: " + trueAnswer);
      var rands = jsPsych.randomization.shuffle(mathRand);
      var rand = rands.pop();
      //console.log("Initial rand: " + rand);

      return initMathProblem2(0, opt1, sign, opt2, rand, opt2sign, trueAnswer);
    }
  }
}

function initMathProblem2(count, opt1, sign, opt2, rand, opt2sign, trueAnswer) {
  count++;
  console.log("InitMathProblem2 Count: " + count);

  if(count > 1) {
    rand += 2;
    //console.log("New rand: " + rand);
  }

  var problem = opt1 + " " + sign + " " + opt2;
  //console.log("Problem: " + problem);

  var answer = eval(problem) + rand;
  //console.log("Fake answer: " + answer);

  if(answer >= 0 && answer != trueAnswer) {
    console.log("Answer is 0 or greater and not true; finishing with values:\nProblem: " + problem + "\nFake answer: " + answer + "\nTrue answer: " + trueAnswer);
    return ({
      problem: problem,
      answer: answer,
      correct: "FALSE"
    })
  }
  else {
    //console.log("Answer is less than 0 or true; continuing.");
    return initMathProblem2(count, opt1, sign, opt2, rand, opt2sign, trueAnswer);
  }
}

function makeLetterStimuli(sizes, type) {
  var timeline = []
  var next = 0;
  var problems;
  var shuffledLetters = testLetters;

  for(var i = 0; i < sizes.length; i++) {

    var recallString = "";
    if(type == "BothPractice" || type == "Experiment") {
      problems = initMathProblems(sizes[i]);
      shuffledLetters = jsPsych.randomization.shuffle(testLetters);
      next = 0;
    }

    var inner_timeline = [];

    for(var j = 0; j < sizes[i]; j++) {
      if(type == "BothPractice" || type == "Experiment") {
        var problem = problems[j];
        inner_timeline.push(makeMathProblem(problem.problem, problem.answer, problem.correct, type));
      }

      inner_timeline.push(makeLetterStimulus(shuffledLetters[next]));
      recallString += shuffledLetters[next];
      next += 1;
    }

    inner_timeline.push(makeLetterResponse(sizes[i], type, recallString));
    timeline.push({timeline: inner_timeline});
    timeline.push(makeFeedback(type));
  }
  
  return timeline;
}

function makeLetterResponse(size, type, recallString) {
  return ({
    type: 'ospan-letter-response',
    instructions: 'Select the letters in the order you saw them.',
    nrows: 4,
    ncols: 3,
    letters: letters,
    data: {
      correct_answer: recallString,
      total_letters: recallString.length,
      ospan_type: type,
      size: size
    },
    on_finish: function(data) {
      jsPsych.data.addDataToLastTrial({
          correct: 0
        });

      if(data.response == data.correct_answer) {
        jsPsych.data.addDataToLastTrial({
          correct: 1,
          letters_correct: data.correct_answer.length
        });
      }
      else {
        var lettersCorrect = 0;
        for(var i = 0; i < data.correct_answer.length; i++) {
            if(data.response[i] == data.correct_answer[i])
              lettersCorrect++;
        }

        jsPsych.data.addDataToLastTrial({
          correct: 0,
          letters_correct: lettersCorrect
          
        });
      }
    }
  });
}

function makeMathProblem(problem, answer, correct, type) {
  var timing_response;

  if(type == "MathPractice") {
    timing_response = -1;
  }
  else {
    timing_response = function() {
      return averageResponseTime;
    }
  }

  var timeline = [{
      type: 'ospan-math-stim',
      data: {
        ospan_type: type,
        dislay_answer: answer
      },
      prompt: '<p class="center-content small">Press space when you know the answer.</p>',
      is_html: true,
      timing_response: timing_response,
      choices: [' '],
      stimulus: '<div class="center-screen very-large">' + problem  + '</div>'
    }, { 
      conditional_function: function() {
        var data = jsPsych.data.getLastTrialData();
        if(data.key_press == -1) return false;
        return true;
      },
      timeline: [{
        type: 'ospan-math-response',
        timing_response: -1, 
        number: answer,
        data: {
          number_correct: correct,
          ospan_type: type
        },
        on_finish: function(data) {
          if(data.response == data.number_correct) {
            jsPsych.data.addDataToLastTrial({
              correct: 1
            });
          }
          else {
            jsPsych.data.addDataToLastTrial({
              correct: 0
            });
          }
        }
      }]
    }];
    
    if(type == "MathPractice")
      timeline.push(makeFeedback(type));

  return ({timeline: timeline});
}

var averageResponseTime = -1;

function average(values) {
  return  _.reduce(values, function(memo, obj) { return memo + obj.rt; }, 0) / values.length;
}

function standardDeviation(values) {
  var avg = average(values);
  var squareDiffs = _.map(values, function(value){
    var diff = value.rt - avg;
    var sqr = diff * diff;
    return { rt: sqr };
  });
  return Math.sqrt(average(squareDiffs));
}

function makeMathProblems(type) {
  var timeline = [];
  for(var i = 0; i < pracMathProblems.length; i++) {
    timeline.push({
      timeline: [makeMathProblem(pracMathProblems[i], pracMathAnswers[i], pracMathCorrect[i], type)],
      data: {
      ospan_type: type
      },
      on_finish: function(data) {
        if(data.ospan_type == "MathPractice") {
          
          var practiceData = jsPsych.data.getTrialsOfType("ospan-math-stim");

          var average_rt = average(practiceData);
          var std_deviation = standardDeviation(practiceData);

          averageResponseTime = (2.5 * std_deviation) + average_rt + 500;
        }
      }
    });
  }
  return timeline;
}

function makeOspanTrials(sizes, type) {
  switch (type) {
    case "LetterPractice":
      return makeLetterStimuli(sizes, type); 
      break;
    case "MathPractice":
      return makeMathProblems(type);
      break;
    case "Experiment":
    case "BothPractice":
      return makeLetterStimuli(sizes, type);
  }
}

function addObjectsToTimeline(timeline, list) {
  _.each(list, function(item, index, list) {
    timeline.push(item);
  });
  return timeline;
}