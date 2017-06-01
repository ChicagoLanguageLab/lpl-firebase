// data.js

letters = ["F", "H", "J", "K", "L", "N", "P", "Q", "R", "S", "T", "Y"];

testLetters = ["F", "P", "Q", "J", "H", "K", "T","S", "N", "R", "Y", "L"];

pracLetterSize = [2,2,3,3];

pracMathProblems = ["(1*2) + 1 = ?", "(1/1) - 1 = ?", "(7*3) - 3 = ?", "(4*3) + 4 = ?", "(3/3) + 2 = ?", "(2*6) - 4 = ?", "(8*9) - 8 = ?", "(4*5) - 5 = ?", "(4*2) + 6 = ?", "(4/4) + 7 = ?", "(8*2) - 8 = ?", "(2*9) - 9 = ?", "(8/2) + 9 = ?", "(3*8) - 1 = ?", "(6/3) + 1 = ?", "(9/3) - 2 = ?"];

pracMathAnswers = ["3", "2", "18", "16", "1", "6", "64", "11", "14", "12", "2", "9", "7", "23", "3", "7"];

pracMathCorrect = ["TRUE", "FALSE", "TRUE", "TRUE", "FALSE", "FALSE", "TRUE", "FALSE", "TRUE", "FALSE", "FALSE", "TRUE", "FALSE", "TRUE", "TRUE", "FALSE"];

pracBothSetSize = [2,2,2];

startingInstructions = "<p>In this experiment you will try to memorize letters you see on the screen  while you also solve simple math problems.</p><p>In the next few minutes, you will have some practice to get you familiar with how the experiment works.</p>We will begin by practicing the letter part of the experiment.</p><p>Press <strong>space</strong> to begin.</p>";

letterPracticeInstructions = ["<p>For this practice set, letters will appear on the screen one at a time.</p><p>Try to remember each letter in the order presented.</p><p>After 2-3 letters have been shown, you will see a screen listing 12 possible letters. Your job is to select each letter in the order presented. To do this, click on the letters. The letters you select will appear below.</p><p>Press <strong>space</strong> to continue.</p>", "<p>When you have selected all the letters, and they are in the correct order, press the SUBMIT button at the bottom of the screen.</p><p>If you make a mistake, press the CLEAR button to start over.</p><p>If you forget one of the letters, press the BLANK button to mark the spot for the missing letter.</p><p>Remember, it is very important to get the letters in the same order as you see them. If you forget one, use the BLANK button to mark the position.</p><p>When you're ready, press <strong>space</strong> to start the letter practice.</p>"];

mathPracticeInstructions = ['<p>Now you will practice doing the math part of the experiment.</p><p>A math problem will appear on the screen, like this:</p><p class="center-content">(2 * 1) + 1 = ?</p><p>As soon as you see the math problem, you should compute the correct answer. In the above problem, the answer 3 is correct.</p><p>When you know the correct answer, you will press the <strong>space</strong> key.</p><p>Press <strong>space</strong> to continue.', '<p>You will see a number displayed on the next screen.</p><p>If the number on the screen is the correct answer to the math problem, click TRUE. If the number is not the correct answer, click FALSE.</p><p>For example, if you see the problem</p><p class="center-content">(2 * 2) + 1 = ?</p><p>and the number on the following screen is 5, you should click TRUE, because the answer is correct.</p><p>If you see the problem</p><p class="center-content">(2 * 2) + 1 =  ?</p><p>and the number on the next screen is 6, you should click FALSE, because the correct answer is 5, not 6.</p><p>After you press a key, the computer will tell you if you made the right choice.</p><p>Press <strong>space</strong> to continue.', "<p>It is VERY important that you get the math problems correct. It is also important that you try and solve the problems as quickly as you can.</p><p>When you're ready, press <strong>space</strong> to try some practice problems.</p>"];

bothPracticeInstructions = ["<p>Now you will practice doing both parts of the experiment at the same time.</p><p>In the next practice set, you will be given one of the math problems. Once you make your decision about the math problem, a letter will appear on the screen. Try and remember the letter.</p><p>In the previous section where you only solved math problems, the computer computed your average time to solve the problems.</p><p>If you take longer than your average time, the computer will automatically move you onto the next letter part, thus skipping the True or False part and will count that problem as a math error.</p><p>Therefore it is VERY important to solve the problems as quickly and as accurately as possible.</p><p>Press <strong>space</strong> to continue.</p>", "<p>After the letter goes away, another math problem will appear, and then another letter.</p><p>At the end of each set of letters and math problems, a recall screen will appear. Use the mouse to select the letters you just saw. Try your best to get the letters in the correct order.</p><p>It is important to work QUICKLY and ACCURATELY on the math. Make sure you know the answer to the math problem before clicking to the next screen. You will not be told if your answer to the math problem is correct.</p><p>After the recall screen, you will be given feedback about your performance regarding both the number of letters recalled and the percent correct on the math problems.</p><p>Press <strong>space</strong> to continue.", "<p>During the feedback, you will see a number in red in the top right of the screen. This indicates your percent correct for the math problems for the entire experiment.</p><p>It is VERY important for you to keep this at least at 85%. For our purposes, we can only use data where the participant was at least 85% accurate on the math. Therefore, you must perform at least at 85% on the math problems WHILE doing your best to recall as many letters as possible. (Note, however, that scoring below 85% WILL NOT result in a rejection.)</p><p>Press <strong>space</strong> to try some practice problems."];


experimentInstructions = ["<p>That is the end of the practice.</p><p>The real trials will look like the practice trials you just completed. First you will get a math problem to solve, then a letter to remember.</p><p>When you see the recall screen, select the letters in the order presented. If you forget a letter, click the BLANK button to mark where it should go.<p></p>Some of the sets will have more math problems and letters than others.</p><p>It is important that you do your best on both the math problems and the letter recall parts of this experiment.</p><p>Remember on the math you must work as QUICKLY and ACCURATELY as possible. Also, remember to keep your math accuracy at 85% or above.</p><p>Press <strong>space</strong> to begin the experiment."];

finalInstructions = ["Thank you for your participation."];

mathOpt1 = ["(1/1)", "(2/1)", "(2/2)", "(3/1)", "(3/3)", "(4/1)", "(4/2)", "(4/4)", "(5/1)", "(5/5)", "(6/1)", "(6/2)", "(6/3)", "(6/6)", "(7/1)", "(7/7)", "(8/1)", "(8/2)", "(8/4)", "(8/8)", "(9/1)", "(9/3)", "(9/9)", "(1*2)", "(1*3)", "(2*2)", "(1*4)", "(1*5)", "(3*2)", "(2*3)", "(1*6)", "(1*7)", "(4*2)", "(2*4)", "(1*8)", "(3*3)", "(1*9)", "(5*2)", "(2*5)", "(6*2)", "(4*3)", "(3*4)", "(2*6)", "(7*2)", "(2*7)", "(5*3)", "(3*5)", "(8*2)"]

mathDifficulty = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2"];

mathOpt2 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

mathSign = ["+", "+", "+", "+", "+", "+", "+", "+", "+", "-", "-", "-", "-", "-", "-", "-", "-", "-"];

mathCorrect = ["TRUE", "TRUE", "TRUE", "TRUE", "TRUE", "FALSE", "FALSE", "FALSE", "FALSE", "FALSE"];

mathRand = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -2, -3, -4, -5, -6, -7, -8, -9];

testBothSetSize = [3,3,3,4,4,4,5,5,5,6,6,6,7,7,7];
