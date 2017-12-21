var productionInstructions = [
  `<p>This experiment consists of a single task, which takes about 15 minutes to complete.</p><p>In this task, you will see sets of four images. One image out of the four will have an arrow pointing to it. Your job is to describe the object indicted by the arrow as if you are instructing someone else to click on the image.</p><p>When describing the image, imagine that you are working with a partner who is located in another room. This partner can see the same images you see, but cannot see the arrow. Your goal is to get this partner to select the same image that the arrow points to.</p>`,
  `<p>For example, consider the following set of images:</p><table style="margin-left: auto; margin-right: auto;"><tr><td><img width="150" src="resources/images/snowman1.jpg" /></td><td></td><td><img width="150" src="resources/images/flag2.jpg" /></td></tr><tr><td></td><td><img width="150" src="resources/images/bl_arrow.png"/></td><td></td></tr><tr><td><img width="150" src="resources/images/freshorange.jpg" /></td><td></td><td><img width="150" src="resources/images/freshstrawberry.jpg" /></td></tr></table><p>Now, imagine that there is another person involved in the experiment. They see the same set of images, but without the arrow:</p><table style="margin-left: auto; margin-right: auto;"><tr><td><img width="150" src="resources/images/snowman1.jpg" /></td><td></td><td><img width="150" src="resources/images/flag2.jpg" /></td></tr><tr><td><img width="150" src="resources/images/freshorange.jpg" /></td><td></td><td><img width="150" src="resources/images/freshstrawberry.jpg" /></td></tr></table><p>In order to get this person to click on the image that the arrow points to, what would you say?</p>', '<p>Your instructions to your imaginary partner will all be of the form, "Click on the _________," where it is your job to fill in the blank. Please keep in mind that this partner cannot see the arrow and that you want them to be able to choose the correct image based on your description.</p><p>Click <strong>next</strong> when you are ready to begin.</p>`
];

var threeItemInstructions = ['<p>This experiment consists of a single task, which takes about 15 minutes to complete.</p><p>In this task, you will see sets of four images. One image out of the four will have an arrow pointing to it. Your job is to describe the object indicted by the arrow as if you are instructing someone else to click on the image.</p><p>When describing the image, imagine that you are working with a partner who is located in another room. This partner can see the same images you see, but cannot see the arrow. Your goal is to get this partner to select the same image that the arrow points to.</p>', '<p>For example, consider the following set of images:</p><table style="margin-left: auto; margin-right: auto;"><tr><td></td><td></td><td></td></tr><tr><td><img width="150" src="resources/images/snowman1.jpg" /></td><td><img width="150" src="resources/images/l_arrow.jpg"/></td><td><img width="150" src="resources/images/flag2.jpg" /></td></tr><tr><td></td><td><img width="150" src="resources/images/freshorange.jpg" /></td><td></td></tr></table><p>Now, imagine that there is another person involved in the experiment. They see the same set of images, but without the arrow:</p><table style="margin-left: auto; margin-right: auto;"><tr><td></td><td></td><td></td></tr><tr><td><img width="150" src="resources/images/snowman1.jpg" /></td><td></td><td><img width="150" src="resources/images/flag2.jpg" /></td></tr><tr><td></td><td><img width="150" src="resources/images/freshorange.jpg" /></td><td></td></tr></table><p>In order to get this person to click on the image that the arrow points to, what would you say?</p>', '<p>Your instructions to your imaginary partner will all be of the form, "Click on the _________," where it is your job to fill in the blank. Please keep in mind that this partner cannot see the arrow and that you want them to be able to choose the correct image based on your description.</p><p>Click <strong>next</strong> when you are ready to begin.</p>'];


var productionEndInstructions = ['<p>You have finished the study!</p><p>Press <strong>space</strong> to continue to your study code.</p>'];

// Define possible targets
var targetTypesRemainder = ['distractor', 'contrastDistractor'];
var targetTypes3Item = ['target', 'distractor', 'contrastDistractor'];

// Store list of arrow images
var arrows = ['tl_arrow.png', 'tr_arrow.png', 'bl_arrow.png'];
var three_arrow = ['l_arrow.jpg', 'r_arrow.jpg', 'd_arrow.jpg'];