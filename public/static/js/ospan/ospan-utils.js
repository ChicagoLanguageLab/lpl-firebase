// ospan-utils.js

function initInstructions(instructions, choices) {
  if(typeof(instructions) == "object") {
    var timeline = [];

    for(i = 0; i < instructions.length; i++) {
      timeline.push({text: instructions[i]});
    }

    return ({
      type: "text",
      choices: choices,
      timeline: timeline
    });
  }

  return ({
    type: "text",
    text: instructions,
    choices: choices
  });
}

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

      console.log(totalMathResponseData);
      console.log(totalMathProblemData);

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
        dataRef.set({
          total_math_problems: totalMathProblemData.length,
          total_math_wrong: totalMathProblemData.length - totalMathResponseSum,
          total_math_accuracy_errors: _.filter(totalMathResponseData, function(obj){return obj.correct == 0}).length,
          total_math_speed_errors: totalMathProblemData.length - totalMathResponseData.length,
          total_strings: letterData.length,
          total_letters: totalLetters,
          total_strings_correct: allOrNothingSum,
          total_letters_correct: correctLetterSum
        });
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
  
  if(count == 1) {
    opt2sign = parseInt(sign + opt2, 10);
  }
  else if(count > 1) {
    opt2sign += 3;
    opt2 = Math.abs(opt2sign).toString();
    if(opt2sign > 0) {
      sign = "+";
    }
  }
  
  var problem = opt1 + " " + sign + " " + opt2;
  var trueAnswer = eval(problem);

  if(trueAnswer < 0 || opt2 == 0) {
    return initMathProblem1(count, opt1, sign, opt2, correct, opt2sign);
  }
  else if(trueAnswer >= 0) {
    if(correct == "TRUE") {
      return ({
        problem: problem,
        answer: trueAnswer,
        correct: correct
      });
    }
    else {
      var rands = jsPsych.randomization.shuffle(mathRand);
      var rand = rands.pop();
      return initMathProblem2(0, opt1, sign, opt2, rand, opt2sign, trueAnswer);
    }
  }
}

function initMathProblem2(count, opt1, sign, opt2, rand, opt2sign, trueAnswer) {
  count++;

  if(count > 1) {
    rand += 2;
  }

  var problem = opt1 + " " + sign + " " + opt2;
  var answer = eval(problem) + rand;
  
  if(answer >= 0 && answer != trueAnswer) {
    return ({
      problem: problem,
      answer: answer,
      correct: "FALSE"
    })
  }
  else {
    return initMathProblem2(count, opt1, sign, opt2, rand, opt2sign);
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
    timeline.push({timeline: [{timeline: inner_timeline}, makeFeedback(type)]});
  }
  
  return ({ timeline: timeline });
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
    console.log("Set response timeout!");
  }

  var timeline = [{
      type: 'ospan-math-stim',
      data: {
        ospan_type: type
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

function makeMathProblems(type) {
  var timeline = [];
  for(var i = 0; i < pracMathProblems.length; i++) {
    timeline.push(makeMathProblem(pracMathProblems[i], pracMathAnswers[i], pracMathCorrect[i], type));
  }
  return ({
    timeline: timeline,
    data: {
      ospan_type: type
    },
    on_finish: function(data) {
      if(data.ospan_type == "MathPractice") {
       
        var practiceData = jsPsych.data.getTrialsOfType("ospan-math-stim");
        var sum = _.reduce(practiceData, function(memo, obj) { return memo + obj.rt; }, 0);
        
        averageResponseTime = sum / practiceData.length;
        console.log("Time limit for timed math: " + averageResponseTime);
      }
    }
  });
}

function makeOspanTrials(sizes, type) {
  var timeline = [];
  
  switch (type) {
    case "LetterPractice":
      timeline.push(makeLetterStimuli(sizes, type)); 
      break;
    case "MathPractice":
      timeline.push(makeMathProblems(type));
      break;
    case "Experiment":
    case "BothPractice":
      timeline.push(makeLetterStimuli(sizes, type));
  }

  return ({
    timeline: timeline
  });
}