var productionInstructions = ['<p>This experiment consists of two tasks.</p><p>In one task, you will be asked to briefly describe a series of images. This task takes about 10 minutes to complete.</p><p>In the other task, you will be solving math problems while remembering sequences of letters. This task takes about 15 minutes to complete.</p><p>Press <strong>space</strong> to continue.</p>', '<p>First, you will do the image-description task.</p><p>In this task, you will see sets of four images. One image out of the four will have an arrow pointing to it. Your job is to describe the object indicted by the arrow as if you are instructing someone else to click on the image.</p><p>When describing the image, imagine that you are working with a partner who is located in another room. This partner can see the same images you see, but cannot see the arrow. Your goal is to get this partner to select the same image that the arrow points to.</p><p>Press <strong>space</strong> to continue.</p>', '<p>For example, consider the following set of images:</p><table style="margin-left: auto; margin-right: auto;"><tr><td><img width="150" src="../static/images/production/snowman1.jpg" /></td><td></td><td><img width="150" src="../static/images/production/flag2.jpg" /></td></tr><tr><td></td><td><img width="150" src="../static/images/production/bl_arrow.png"/></td><td></td></tr><tr><td><img width="150" src="../static/images/production/freshorange.jpg" /></td><td></td><td><img width="150" src="../static/images/production/freshstrawberry.jpg" /></td></tr></table><p>Now, imagine that there is another person involved in the experiment. They see the same set of images, but without the arrow:</p><table style="margin-left: auto; margin-right: auto;"><tr><td><img width="150" src="../static/images/production/snowman1.jpg" /></td><td></td><td><img width="150" src="../static/images/production/flag2.jpg" /></td></tr><tr><td><img width="150" src="../static/images/production/freshorange.jpg" /></td><td></td><td><img width="150" src="../static/images/production/freshstrawberry.jpg" /></td></tr></table><p>In order to get this person to click on the image that the arrow points to, what would you say?</p><p>Press <strong>space</strong> to continue.', '<p>Your instructions to your imaginary partner will all be of the form, "Click on the _________," where it is your job to fill in the blank. Please keep in mind that this partner cannot see the arrow and that you want them to be able to choose the correct image based on your description.</p><p>Press <strong>space</strong> when you are ready to begin.</p>'];

var productionEndInstructions = ['<p>You have finished the first task!</p><p>Press <strong>space</strong> to continue to the second task.</p>'];

// Define possible targets
var targetTypes = ['target', 'competitor', 'contrastDistractor'];

// Store list of arrow images
var arrows = ['tl_arrow.png', 'tr_arrow.png', 'bl_arrow.png', 'br_arrow.png'];

// Current version: TmoreC
trials = {
    '1c': {
        'originalItemId': '1',
        'targetAdjective': 'big',
        'type': 'Color',
        'target': 'snowman5.jpg',
        'competitor': 'boat3.jpg',
        'distractor': 'straw1.jpg',
        'contrastDistractor': 'snowman1.jpg'
    },
    '1nc': {
        'originalItemId': '1',
        'targetAdjective': 'big',
        'type': 'Color',
        'target': 'snowman5.jpg',
        'competitor': 'boat3.jpg',
        'distractor': 'straw1.jpg',
        'contrastDistractor': 'plastic_T3.jpg'
    },
    '2c': {
        'originalItemId': '2',
        'targetAdjective': 'big',
        'type': 'Color',
        'target': 'boat5.jpg',
        'competitor': 'snowman3.jpg',
        'distractor': 'bentnail3.jpg',
        'contrastDistractor': 'boat1.jpg'
    },
    '2nc': {
        'originalItemId': '2',
        'targetAdjective': 'big',
        'type': 'Color',
        'target': 'boat5.jpg',
        'competitor': 'snowman3.jpg',
        'distractor': 'bentnail3.jpg',
        'contrastDistractor': 'heels2.jpg'
    },
    '3c': {
        'originalItemId': '3',
        'targetAdjective': 'small',
        'type': 'Color',
        'target': 'snowman1.jpg',
        'competitor': 'boat2.jpg',
        'distractor': 'red_F2.jpg',
        'contrastDistractor': 'snowman5.jpg'
    },
    '3nc': {
        'originalItemId': '3',
        'targetAdjective': 'small',
        'type': 'Color',
        'target': 'snowman1.jpg',
        'competitor': 'boat2.jpg',
        'distractor': 'red_F2.jpg',
        'contrastDistractor': 'freshstrawberry.jpg'
    },
    '4c': {
        'originalItemId': '4',
        'targetAdjective': 'small',
        'type': 'Color',
        'target': 'boat1.jpg',
        'competitor': 'snowman2.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'boat5.jpg'
    },
    '4nc': {
        'originalItemId': '4',
        'targetAdjective': 'small',
        'type': 'Color',
        'target': 'boat1.jpg',
        'competitor': 'snowman2.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'freshorange.jpg'
    },
    '5c': {
        'originalItemId': '5',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'blue_F1.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'straightrod5.jpg',
        'contrastDistractor': 'bluelipstick.jpg'
    },
    '5nc': {
        'originalItemId': '5',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'blue_F1.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'straightrod5.jpg',
        'contrastDistractor': 'straightrod1.jpg'
    },
    '6c': {
        'originalItemId': '6',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'blue_F3.jpg',
        'competitor': 'yellow_T1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'whitenotepad.jpg'
    },
    '6nc': {
        'originalItemId': '6',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'blue_F3.jpg',
        'competitor': 'yellow_T1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'glittery_F1.jpg'
    },
    '7c': {
        'originalItemId': '7',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'blue_T1.jpg',
        'competitor': 'blue_T3.jpg',
        'distractor': 'wooden_F1.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '7nc': {
        'originalItemId': '7',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'blue_T1.jpg',
        'competitor': 'blue_T3.jpg',
        'distractor': 'wooden_F1.jpg',
        'contrastDistractor': 'chips5.jpg'
    },
    '8c': {
        'originalItemId': '8',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'blue_T2.jpg',
        'competitor': 'blue_T1.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '8nc': {
        'originalItemId': '8',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'blue_T2.jpg',
        'competitor': 'blue_T1.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'candle5.jpg'
    },
    '9c': {
        'originalItemId': '9',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'blue_T3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'chips5.jpg',
        'contrastDistractor': 'redbucket.jpg'
    },
    '9nc': {
        'originalItemId': '9',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'blue_T3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'chips5.jpg',
        'contrastDistractor': 'bw_stripe_fish5.jpg'
    },
    '10c': {
        'originalItemId': '10',
        'targetAdjective': 'green',
        'type': 'Color',
        'target': 'red_F1.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': '#thick4.jpg',
        'contrastDistractor': 'freshapple.jpg'
    },
    '10nc': {
        'originalItemId': '10',
        'targetAdjective': 'green',
        'type': 'Color',
        'target': 'red_F1.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': '#thick4.jpg',
        'contrastDistractor': 'beer5.jpg'
    },
    '11c': {
        'originalItemId': '11',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'red_F2.jpg',
        'competitor': 'yellow_T2.jpg',
        'distractor': '#table2.jpg',
        'contrastDistractor': 'yellow_F3.jpg'
    },
    '11nc': {
        'originalItemId': '11',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'red_F2.jpg',
        'competitor': 'yellow_T2.jpg',
        'distractor': '#table2.jpg',
        'contrastDistractor': 'browneggs.jpg'
    },
    '12c': {
        'originalItemId': '12',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'red_F3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'yellow_F1.jpg'
    },
    '12nc': {
        'originalItemId': '12',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'red_F3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'yellow_F1.jpg'
    },
    '13c': {
        'originalItemId': '13',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'redbook.jpg',
        'competitor': 'red_T2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'bluebook.jpg'
    },
    '13nc': {
        'originalItemId': '13',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'redbook.jpg',
        'competitor': 'red_T2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'freshbanana.jpg'
    },
    '14c': {
        'originalItemId': '14',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'red_T2.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'red_F2.jpg'
    },
    '14nc': {
        'originalItemId': '14',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'red_T2.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '15c': {
        'originalItemId': '15',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'red_T3.jpg',
        'competitor': 'plastic_T1.jpg',
        'distractor': 'plastic_T2.jpg',
        'contrastDistractor': 'red_F3.jpg'
    },
    '15nc': {
        'originalItemId': '15',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'red_T3.jpg',
        'competitor': 'plastic_T1.jpg',
        'distractor': 'plastic_T2.jpg',
        'contrastDistractor': 'knife1.jpg'
    },
    '16c': {
        'originalItemId': '16',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'yellow_F1.jpg',
        'competitor': 'blue_F1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'yellow_T1.jpg'
    },
    '16nc': {
        'originalItemId': '16',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'yellow_F1.jpg',
        'competitor': 'blue_F1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'curvedbridge1.jpg'
    },
    '17c': {
        'originalItemId': '17',
        'targetAdjective': 'pink',
        'type': 'Color',
        'target': 'yellow_F2.jpg',
        'competitor': 'heels2.jpg',
        'distractor': 'boat1.jpg',
        'contrastDistractor': 'yellow_T1.jpg'
    },
    '17nc': {
        'originalItemId': '17',
        'targetAdjective': 'pink',
        'type': 'Color',
        'target': 'yellow_F2.jpg',
        'competitor': 'heels2.jpg',
        'distractor': 'smalldog.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '18c': {
        'originalItemId': '18',
        'targetAdjective': 'green',
        'type': 'Color',
        'target': 'yellow_F3.jpg',
        'competitor': 'red_F1.jpg',
        'distractor': '#thick3.jpg',
        'contrastDistractor': 'red_T2.jpg'
    },
    '18nc': {
        'originalItemId': '18',
        'targetAdjective': 'green',
        'type': 'Color',
        'target': 'yellow_F3.jpg',
        'competitor': 'red_F1.jpg',
        'distractor': '#thick3.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '19c': {
        'originalItemId': '19',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'yellow_T1.jpg',
        'competitor': 'blue_F3.jpg',
        'distractor': 'bentnail1.jpg',
        'contrastDistractor': 'red_T3.jpg'
    },
    '19nc': {
        'originalItemId': '19',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'yellow_T1.jpg',
        'competitor': 'blue_F3.jpg',
        'distractor': 'bentnail1.jpg',
        'contrastDistractor': 'blue_T2.jpg'
    },
    '20c': {
        'originalItemId': '20',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'yellow_T2.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'red_F3.jpg'
    },
    '20nc': {
        'originalItemId': '20',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'yellow_T2.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'chips2.jpg'
    },
    '21c': {
        'originalItemId': '21',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'yellow_T3.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': '#thick4.jpg',
        'contrastDistractor': 'blackumbrella.jpg'
    },
    '21nc': {
        'originalItemId': '21',
        'targetAdjective': 'yellow',
        'type': 'Color',
        'target': 'yellow_T3.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': '#thick4.jpg',
        'contrastDistractor': 'garagedoor1.jpg'
    },
    '22c': {
        'originalItemId': '22',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'plastic_T1.jpg',
        'competitor': 'red_T3.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'plastic_T2.jpg'
    },
    '22nc': {
        'originalItemId': '22',
        'targetAdjective': 'red',
        'type': 'Color',
        'target': 'plastic_T1.jpg',
        'competitor': 'red_T3.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'boat5.jpg'
    },
    '23c': {
        'originalItemId': '23',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'plastic_T2.jpg',
        'competitor': 'broken_T1.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'plastic_T1.jpg'
    },
    '23nc': {
        'originalItemId': '23',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'plastic_T2.jpg',
        'competitor': 'broken_T1.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'chips5.jpg'
    },
    '24c': {
        'originalItemId': '24',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'broken_T1.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'greencast.jpg'
    },
    '24nc': {
        'originalItemId': '24',
        'targetAdjective': 'blue',
        'type': 'Color',
        'target': 'broken_T1.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '25c': {
        'originalItemId': '55',
        'targetAdjective': 'dented',
        'type': 'Filler',
        'target': 'dentedcar.jpg',
        'competitor': 'dentedtrashcan.jpg',
        'distractor': 'blue_T2.jpg',
        'contrastDistractor': 'yellow_F3.jpg'
    },
    '25nc': {
        'originalItemId': '55',
        'targetAdjective': 'dented',
        'type': 'Filler',
        'target': 'dentedcar.jpg',
        'competitor': 'dentedtrashcan.jpg',
        'distractor': 'blue_T2.jpg',
        'contrastDistractor': 'palm5.jpg'
    },
    '26c': {
        'originalItemId': '56',
        'targetAdjective': 'dented',
        'type': 'Filler',
        'target': 'dentedtrashcan.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish4.jpg',
        'contrastDistractor': '#trashcan.jpg'
    },
    '26nc': {
        'originalItemId': '56',
        'targetAdjective': 'dented',
        'type': 'Filler',
        'target': 'dentedtrashcan.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish4.jpg',
        'contrastDistractor': 'realhorse.jpg'
    },
    '27c': {
        'originalItemId': '57',
        'targetAdjective': 'dented',
        'type': 'Filler',
        'target': 'dentedtin.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish1.jpg',
        'contrastDistractor': '#tin.jpg'
    },
    '27nc': {
        'originalItemId': '57',
        'targetAdjective': 'dented',
        'type': 'Filler',
        'target': 'dentedtin.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish1.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '28c': {
        'originalItemId': '58',
        'targetAdjective': 'broken',
        'type': 'Filler',
        'target': 'brokencomputer.jpg',
        'competitor': 'broken_T3.jpg',
        'distractor': 'shirt4.jpg',
        'contrastDistractor': 'functioningcomputer.jpg'
    },
    '28nc': {
        'originalItemId': '58',
        'targetAdjective': 'broken',
        'type': 'Filler',
        'target': 'brokencomputer.jpg',
        'competitor': 'broken_T3.jpg',
        'distractor': 'shirt4.jpg',
        'contrastDistractor': 'heels1.jpg'
    },
    '29c': {
        'originalItemId': '59',
        'targetAdjective': 'broken',
        'type': 'Filler',
        'target': 'broken_T2.jpg',
        'competitor': 'brokenprinter.jpg',
        'distractor': 'squash3.jpg',
        'contrastDistractor': 'intactplate.jpg'
    },
    '29nc': {
        'originalItemId': '59',
        'targetAdjective': 'broken',
        'type': 'Filler',
        'target': 'broken_T2.jpg',
        'competitor': 'brokenprinter.jpg',
        'distractor': 'squash3.jpg',
        'contrastDistractor': 'happy_F2.jpg'
    },
    '30c': {
        'originalItemId': '60',
        'targetAdjective': 'broken',
        'type': 'Filler',
        'target': 'broken_T3.jpg',
        'competitor': 'broken_T2.jpg',
        'distractor': 'bentnail3.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '30nc': {
        'originalItemId': '60',
        'targetAdjective': 'broken',
        'type': 'Filler',
        'target': 'broken_T3.jpg',
        'competitor': 'broken_T2.jpg',
        'distractor': 'bentnail3.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '31c': {
        'originalItemId': '61',
        'targetAdjective': 'glittery',
        'type': 'Filler',
        'target': 'glitteryskull.jpg',
        'competitor': 'glittery_T3.jpg',
        'distractor': 'marker1.jpg',
        'contrastDistractor': 'skull.jpg'
    },
    '31nc': {
        'originalItemId': '61',
        'targetAdjective': 'glittery',
        'type': 'Filler',
        'target': 'glitteryskull.jpg',
        'competitor': 'glittery_T3.jpg',
        'distractor': 'marker1.jpg',
        'contrastDistractor': 'snowman4.jpg'
    },
    '32c': {
        'originalItemId': '62',
        'targetAdjective': 'glittery',
        'type': 'Filler',
        'target': 'glittery_T2.jpg',
        'competitor': 'glitteryskull.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'heels1.jpg'
    },
    '32nc': {
        'originalItemId': '62',
        'targetAdjective': 'glittery',
        'type': 'Filler',
        'target': 'glittery_T2.jpg',
        'competitor': 'glitteryskull.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'straightrod2.jpg'
    },
    '33c': {
        'originalItemId': '63',
        'targetAdjective': 'glittery',
        'type': 'Filler',
        'target': 'glittery_T3.jpg',
        'competitor': 'glittery_T2.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'browneggs.jpg'
    },
    '33nc': {
        'originalItemId': '63',
        'targetAdjective': 'glittery',
        'type': 'Filler',
        'target': 'glittery_T3.jpg',
        'competitor': 'glittery_T2.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': '#thick4.jpg'
    },
    '34c': {
        'originalItemId': '64',
        'targetAdjective': 'happy',
        'type': 'Filler',
        'target': 'happy_T1.jpg',
        'competitor': 'happy_T3.jpg',
        'distractor': 'boat1.jpg',
        'contrastDistractor': 'happy_F1.jpg'
    },
    '34nc': {
        'originalItemId': '64',
        'targetAdjective': 'happy',
        'type': 'Filler',
        'target': 'happy_T1.jpg',
        'competitor': 'happy_T3.jpg',
        'distractor': 'boat1.jpg',
        'contrastDistractor': 'boat5.jpg'
    },
    '35c': {
        'originalItemId': '65',
        'targetAdjective': 'happy',
        'type': 'Filler',
        'target': 'happy_T2.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'palm2.jpg',
        'contrastDistractor': 'angryman.jpg'
    },
    '35nc': {
        'originalItemId': '65',
        'targetAdjective': 'happy',
        'type': 'Filler',
        'target': 'happy_T2.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'palm2.jpg',
        'contrastDistractor': 'boat3.jpg'
    },
    '36c': {
        'originalItemId': '66',
        'targetAdjective': 'happy',
        'type': 'Filler',
        'target': 'happy_T3.jpg',
        'competitor': 'happy_T2.jpg',
        'distractor': 'blue_F2.jpg',
        'contrastDistractor': 'saddog.jpg'
    },
    '36nc': {
        'originalItemId': '66',
        'targetAdjective': 'happy',
        'type': 'Filler',
        'target': 'happy_T3.jpg',
        'competitor': 'happy_T2.jpg',
        'distractor': 'blue_F2.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '37c': {
        'originalItemId': '67',
        'targetAdjective': 'plastic',
        'type': 'Filler',
        'target': 'plastic_T1.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': 'squash5.jpg',
        'contrastDistractor': 'woodencup.jpg'
    },
    '37nc': {
        'originalItemId': '67',
        'targetAdjective': 'plastic',
        'type': 'Filler',
        'target': 'plastic_T1.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': 'squash5.jpg',
        'contrastDistractor': 'saddog.jpg'
    },
    '38c': {
        'originalItemId': '68',
        'targetAdjective': 'plastic',
        'type': 'Filler',
        'target': 'plasticknife.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': '#trash2.jpg',
        'contrastDistractor': 'knife2.jpg'
    },
    '38nc': {
        'originalItemId': '68',
        'targetAdjective': 'plastic',
        'type': 'Filler',
        'target': 'plasticknife.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': '#trash2.jpg',
        'contrastDistractor': 'intactplate.jpg'
    },
    '39c': {
        'originalItemId': '69',
        'targetAdjective': 'plastic',
        'type': 'Filler',
        'target': 'plastic_T3.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'realhorse.jpg'
    },
    '39nc': {
        'originalItemId': '69',
        'targetAdjective': 'plastic',
        'type': 'Filler',
        'target': 'plastic_T3.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'marker3.jpg'
    },
    '40c': {
        'originalItemId': '70',
        'targetAdjective': 'wooden',
        'type': 'Filler',
        'target': 'wooden_T1.jpg',
        'competitor': 'wooden_T3.jpg',
        'distractor': 'beer4.jpg',
        'contrastDistractor': 'stonebowl.jpg'
    },
    '40nc': {
        'originalItemId': '70',
        'targetAdjective': 'wooden',
        'type': 'Filler',
        'target': 'wooden_T1.jpg',
        'competitor': 'wooden_T3.jpg',
        'distractor': 'beer4.jpg',
        'contrastDistractor': 'redbucket.jpg'
    },
    '41c': {
        'originalItemId': '71',
        'targetAdjective': 'wooden',
        'type': 'Filler',
        'target': 'wooden_T2.jpg',
        'competitor': 'wooden_T1.jpg',
        'distractor': 'knife4.jpg',
        'contrastDistractor': 'red_T2.jpg'
    },
    '41nc': {
        'originalItemId': '71',
        'targetAdjective': 'wooden',
        'type': 'Filler',
        'target': 'wooden_T2.jpg',
        'competitor': 'wooden_T1.jpg',
        'distractor': 'knife4.jpg',
        'contrastDistractor': 'shirt1.jpg'
    },
    '42c': {
        'originalItemId': '72',
        'targetAdjective': 'wooden',
        'type': 'Filler',
        'target': 'wooden_T3.jpg',
        'competitor': 'wooden_T2.jpg',
        'distractor': 'straightrod2.jpg',
        'contrastDistractor': 'metaldoor.jpg'
    },
    '42nc': {
        'originalItemId': '72',
        'targetAdjective': 'wooden',
        'type': 'Filler',
        'target': 'wooden_T3.jpg',
        'competitor': 'wooden_T2.jpg',
        'distractor': 'straightrod2.jpg',
        'contrastDistractor': 'red_T3.jpg'
    },
    '43c': {
        'originalItemId': '73',
        'targetAdjective': 'ceramic',
        'type': 'Filler',
        'target': 'wooden_F1.jpg',
        'competitor': 'stonebowl.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'wooden_F2.jpg'
    },
    '43nc': {
        'originalItemId': '73',
        'targetAdjective': 'ceramic',
        'type': 'Filler',
        'target': 'wooden_F1.jpg',
        'competitor': 'stonebowl.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': '#trash3.jpg'
    },
    '44c': {
        'originalItemId': '74',
        'targetAdjective': 'glass',
        'type': 'Filler',
        'target': 'wooden_F2.jpg',
        'competitor': 'wooden_F3.jpg',
        'distractor': 'sofa4.jpg',
        'contrastDistractor': 'wooden_F1.jpg'
    },
    '44nc': {
        'originalItemId': '74',
        'targetAdjective': 'glass',
        'type': 'Filler',
        'target': 'wooden_F2.jpg',
        'competitor': 'wooden_F3.jpg',
        'distractor': 'sofa4.jpg',
        'contrastDistractor': 'shoe3.jpg'
    },
    '45c': {
        'originalItemId': '75',
        'targetAdjective': 'glass',
        'type': 'Filler',
        'target': 'wooden_F3.jpg',
        'competitor': 'wooden_F2.jpg',
        'distractor': 'glittery_F2.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '45nc': {
        'originalItemId': '75',
        'targetAdjective': 'glass',
        'type': 'Filler',
        'target': 'wooden_F3.jpg',
        'competitor': 'wooden_F2.jpg',
        'distractor': 'glittery_F2.jpg',
        'contrastDistractor': 'knife5.jpg'
    },
    '46c': {
        'originalItemId': '76',
        'targetAdjective': 'fresh',
        'type': 'Filler',
        'target': 'freshapple.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack1.jpg',
        'contrastDistractor': 'rottenapple.jpg'
    },
    '46nc': {
        'originalItemId': '76',
        'targetAdjective': 'fresh',
        'type': 'Filler',
        'target': 'freshapple.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack1.jpg',
        'contrastDistractor': 'garagedoor3.jpg'
    },
    '47c': {
        'originalItemId': '77',
        'targetAdjective': 'fresh',
        'type': 'Filler',
        'target': 'freshorange.jpg',
        'competitor': 'freshstrawberry.jpg',
        'distractor': 'chips1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '47nc': {
        'originalItemId': '77',
        'targetAdjective': 'fresh',
        'type': 'Filler',
        'target': 'freshorange.jpg',
        'competitor': 'freshstrawberry.jpg',
        'distractor': 'chips1.jpg',
        'contrastDistractor': 'functioningprinter.jpg'
    },
    '48c': {
        'originalItemId': '78',
        'targetAdjective': 'fresh',
        'type': 'Filler',
        'target': 'freshstrawberry.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '48nc': {
        'originalItemId': '78',
        'targetAdjective': 'fresh',
        'type': 'Filler',
        'target': 'freshstrawberry.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '49c': {
        'originalItemId': '79',
        'targetAdjective': 'rotten',
        'type': 'Filler',
        'target': 'rottenapple.jpg',
        'competitor': 'rottenstrawberry.jpg',
        'distractor': 'hallway2.jpg',
        'contrastDistractor': 'freshapple.jpg'
    },
    '49nc': {
        'originalItemId': '79',
        'targetAdjective': 'rotten',
        'type': 'Filler',
        'target': 'rottenapple.jpg',
        'competitor': 'rottenstrawberry.jpg',
        'distractor': 'bridge2.jpg',
        'contrastDistractor': 'basketball1.jpg'
    },
    '50c': {
        'originalItemId': '79',
        'targetAdjective': 'rotten',
        'type': 'Filler',
        'target': 'rottenorange.jpg',
        'competitor': 'rottenapple.jpg',
        'distractor': 'heels1.jpg',
        'contrastDistractor': 'freshorange.jpg'
    },
    '50nc': {
        'originalItemId': '80',
        'targetAdjective': 'rotten',
        'type': 'Filler',
        'target': 'rottenbanana.jpg',
        'competitor': 'rottenorange.jpg',
        'distractor': 'yellow_T3.jpg',
        'contrastDistractor': 'angryman.jpg'
    },
    '51c': {
        'originalItemId': '79',
        'targetAdjective': 'sad',
        'type': 'Filler',
        'target': 'happy_F3.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'happybaby.jpg'
    },
    '51nc': {
        'originalItemId': '81',
        'targetAdjective': 'rotten',
        'type': 'Filler',
        'target': 'rottenorange.jpg',
        'competitor': 'rottenapple.jpg',
        'distractor': 'heels1.jpg',
        'contrastDistractor': 'browneggs.jpg'
    },
    '52c': {
        'originalItemId': '80',
        'targetAdjective': 'rotten',
        'type': 'Filler',
        'target': 'rottenbanana.jpg',
        'competitor': 'rottenorange.jpg',
        'distractor': 'yellow_T3.jpg',
        'contrastDistractor': 'freshbanana.jpg'
    },
    '52nc': {
        'originalItemId': '82',
        'targetAdjective': 'sad',
        'type': 'Filler',
        'target': 'happy_F3.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'curvedbridge5.jpg'
    },
    '53c': {
        'originalItemId': '82',
        'targetAdjective': 'sad',
        'type': 'Filler',
        'target': 'happy_F1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'cable5.jpg',
        'contrastDistractor': 'happy_T1.jpg'
    },
    '53nc': {
        'originalItemId': '82',
        'targetAdjective': 'sad',
        'type': 'Filler',
        'target': 'happy_F1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'cable5.jpg',
        'contrastDistractor': 'glittery_T3.jpg'
    },
    '54c': {
        'originalItemId': '82',
        'targetAdjective': 'sad',
        'type': 'Filler',
        'target': 'happy_F2.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'bridge5.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '54nc': {
        'originalItemId': '82',
        'targetAdjective': 'sad',
        'type': 'Filler',
        'target': 'happy_F2.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'hallway1.jpg',
        'contrastDistractor': 'garagedoor3.jpg'
    },
    '55c': {
        'originalItemId': '25',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_F1.jpg',
        'competitor': 'ladybug2.jpg',
        'distractor': 'yellow_T1.jpg',
        'contrastDistractor': 'basketball1.jpg'
    },
    '55nc': {
        'originalItemId': '25',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_F1.jpg',
        'competitor': 'ladybug2.jpg',
        'distractor': 'yellow_T1.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '56c': {
        'originalItemId': '26',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_F2.jpg',
        'competitor': 'squash3.jpg',
        'distractor': 'wooden_T1.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '56nc': {
        'originalItemId': '26',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_F2.jpg',
        'competitor': 'squash3.jpg',
        'distractor': 'wooden_T1.jpg',
        'contrastDistractor': 'ladybug2.jpg'
    },
    '57c': {
        'originalItemId': '27',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_F3.jpg',
        'competitor': 'snowman1.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': 'heels2.jpg'
    },
    '57nc': {
        'originalItemId': '27',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_F3.jpg',
        'competitor': 'snowman1.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '58c': {
        'originalItemId': '28',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_T1.jpg',
        'competitor': 'chips5.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '58nc': {
        'originalItemId': '28',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_T1.jpg',
        'competitor': 'chips5.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'marker2.jpg'
    },
    '59c': {
        'originalItemId': '29',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_T2.jpg',
        'competitor': '#trash3.jpg',
        'distractor': 'wooden_T3.jpg',
        'contrastDistractor': 'brokenprinter.jpg'
    },
    '59nc': {
        'originalItemId': '29',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_T2.jpg',
        'competitor': '#trash3.jpg',
        'distractor': 'wooden_T3.jpg',
        'contrastDistractor': 'papercup.jpg'
    },
    '60c': {
        'originalItemId': '30',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_T3.jpg',
        'competitor': 'boat2.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'knife2.jpg'
    },
    '60nc': {
        'originalItemId': '30',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'blue_T3.jpg',
        'competitor': 'boat2.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '61c': {
        'originalItemId': '31',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'broken_F1.jpg',
        'competitor': '#thick1.jpg',
        'distractor': 'shoe2.jpg',
        'contrastDistractor': 'ladybug2.jpg'
    },
    '61nc': {
        'originalItemId': '31',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'broken_F1.jpg',
        'competitor': '#thick1.jpg',
        'distractor': 'shoe2.jpg',
        'contrastDistractor': 'pillow1.jpg'
    },
    '62c': {
        'originalItemId': '32',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'broken_F2.jpg',
        'competitor': 'yellow_F2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'palm3.jpg'
    },
    '62nc': {
        'originalItemId': '32',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'broken_F2.jpg',
        'competitor': 'yellow_F2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'realhorse.jpg'
    },
    '63c': {
        'originalItemId': '33',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'broken_T1.jpg',
        'competitor': 'straightrod4.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '63nc': {
        'originalItemId': '33',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'broken_T1.jpg',
        'competitor': 'straightrod4.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'rottenapple.jpg'
    },
    '64c': {
        'originalItemId': '34',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'glittery_T2.jpg',
        'competitor': 'bw_stripe_fish5.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'plasticknife.jpg'
    },
    '64nc': {
        'originalItemId': '34',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'glittery_T2.jpg',
        'competitor': 'bw_stripe_fish5.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'redbook.jpg'
    },
    '65c': {
        'originalItemId': '35',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'bentnail1.jpg',
        'competitor': 'shirt2.jpg',
        'distractor': 'happy_F1.jpg',
        'contrastDistractor': 'shirt5.jpg'
    },
    '65nc': {
        'originalItemId': '35',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'bentnail1.jpg',
        'competitor': 'shirt2.jpg',
        'distractor': 'happy_F1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '66c': {
        'originalItemId': '36',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'straightrod1.jpg',
        'competitor': 'cable2.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'stack5.jpg'
    },
    '66nc': {
        'originalItemId': '36',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'straightrod1.jpg',
        'competitor': 'cable2.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'red_F1.jpg'
    },
    '67c': {
        'originalItemId': '37',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'shoe1.jpg',
        'competitor': 'ladybug3.jpg',
        'distractor': 'broken_T3.jpg',
        'contrastDistractor': '#trash2.jpg'
    },
    '67nc': {
        'originalItemId': '37',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'shoe1.jpg',
        'competitor': 'ladybug3.jpg',
        'distractor': 'broken_T3.jpg',
        'contrastDistractor': 'plasticknife.jpg'
    },
    '68c': {
        'originalItemId': '38',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'squash1.jpg',
        'competitor': 'palm4.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'wooden_F3.jpg'
    },
    '68nc': {
        'originalItemId': '38',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'squash1.jpg',
        'competitor': 'palm4.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'metaldoor.jpg'
    },
    '69c': {
        'originalItemId': '39',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'curvedbridge1.jpg',
        'competitor': 'broken_F3.jpg',
        'distractor': 'glittery_F3.jpg',
        'contrastDistractor': 'snowman1.jpg'
    },
    '69nc': {
        'originalItemId': '39',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'curvedbridge1.jpg',
        'competitor': 'broken_F3.jpg',
        'distractor': 'glittery_F3.jpg',
        'contrastDistractor': 'garagedoor2.jpg'
    },
    '70c': {
        'originalItemId': '40',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'palm1.jpg',
        'competitor': '#table4.jpg',
        'distractor': '#thick3.jpg',
        'contrastDistractor': 'red_T2.jpg'
    },
    '70nc': {
        'originalItemId': '40',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'palm1.jpg',
        'competitor': '#table4.jpg',
        'distractor': '#thick3.jpg',
        'contrastDistractor': 'hallway2.jpg'
    },
    '71c': {
        'originalItemId': '41',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': '#trash1.jpg',
        'competitor': 'candle1.jpg',
        'distractor': 'straightrod1.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '71nc': {
        'originalItemId': '41',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': '#trash1.jpg',
        'competitor': 'candle1.jpg',
        'distractor': 'straightrod1.jpg',
        'contrastDistractor': 'bentnail5.jpg'
    },
    '72c': {
        'originalItemId': '42',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'beer1.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'freshbanana.jpg'
    },
    '72nc': {
        'originalItemId': '42',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'beer1.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'redornament.jpg'
    },
    '73c': {
        'originalItemId': '43',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'chips1.jpg',
        'competitor': 'glittery_F2.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'pillow3.jpg'
    },
    '73nc': {
        'originalItemId': '43',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'chips1.jpg',
        'competitor': 'glittery_F2.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'shirt2.jpg'
    },
    '74c': {
        'originalItemId': '44',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'garagedoor1.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': '#trash1.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '74nc': {
        'originalItemId': '44',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'garagedoor1.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': '#trash1.jpg',
        'contrastDistractor': 'shirt2.jpg'
    },
    '75c': {
        'originalItemId': '45',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'boat1.jpg',
        'competitor': 'hallway2.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'whitenotepad.jpg'
    },
    '75nc': {
        'originalItemId': '45',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'boat1.jpg',
        'competitor': 'bridge2.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'stack5.jpg'
    },
    '76c': {
        'originalItemId': '46',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'snowman1.jpg',
        'competitor': 'marker3.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '76nc': {
        'originalItemId': '46',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'snowman1.jpg',
        'competitor': 'marker3.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'stonebowl.jpg'
    },
    '77c': {
        'originalItemId': '47',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'cable1.jpg',
        'competitor': '#thick2.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': 'blackumbrella.jpg'
    },
    '77nc': {
        'originalItemId': '47',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'cable1.jpg',
        'competitor': '#thick2.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': '#trash1.jpg'
    },
    '78c': {
        'originalItemId': '48',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': '#table1.jpg',
        'competitor': 'palm5.jpg',
        'distractor': '#thick1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '78nc': {
        'originalItemId': '48',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': '#table1.jpg',
        'competitor': 'palm5.jpg',
        'distractor': '#thick1.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '79c': {
        'originalItemId': '49',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'stack1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'shoe3.jpg'
    },
    '79nc': {
        'originalItemId': '49',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'stack1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'whitenotepad.jpg'
    },
    '80c': {
        'originalItemId': '50',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'candle1.jpg',
        'competitor': 'sofa4.jpg',
        'distractor': 'straightrod4.jpg',
        'contrastDistractor': 'squash5.jpg'
    },
    '80nc': {
        'originalItemId': '50',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'candle1.jpg',
        'competitor': 'sofa4.jpg',
        'distractor': 'straightrod4.jpg',
        'contrastDistractor': '#table3.jpg'
    },
    '81c': {
        'originalItemId': '51',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': '#thick1.jpg',
        'competitor': 'chips1.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'dog.jpg'
    },
    '81nc': {
        'originalItemId': '51',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': '#thick1.jpg',
        'competitor': 'chips1.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'squash2.jpg'
    },
    '82c': {
        'originalItemId': '52',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'marker1.jpg',
        'competitor': 'snowman2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'brokencomputer.jpg'
    },
    '82nc': {
        'originalItemId': '52',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'marker1.jpg',
        'competitor': 'snowman2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'bw_stripe_fish3.jpg'
    },
    '83c': {
        'originalItemId': '53',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'hallway1.jpg',
        'competitor': 'shirt4.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'candle4.jpg'
    },
    '83nc': {
        'originalItemId': '53',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'bridge1.jpg',
        'competitor': 'shirt4.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'shoe2.jpg'
    },
    '84c': {
        'originalItemId': '54',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'sofa1.jpg',
        'competitor': 'bridge1.jpg',
        'distractor': 'ladybug3.jpg',
        'contrastDistractor': 'broken_T3.jpg'
    },
    '84nc': {
        'originalItemId': '54',
        'targetAdjective': 'none',
        'type': 'NoAdj',
        'target': 'sofa1.jpg',
        'competitor': 'hallway1.jpg',
        'distractor': 'ladybug3.jpg',
        'contrastDistractor': 'plastic_T3.jpg'
    },
    '85c': {
        'originalItemId': '1',
        'targetAdjective': 'plain',
        'type': 'Test',
        'target': 'pillow1.jpg',
        'competitor': 'bw_stripe_fish2.jpg',
        'distractor': 'brokencomputer.jpg',
        'contrastDistractor': 'pillow5.jpg'
    },
    '85nc': {
        'originalItemId': '1',
        'targetAdjective': 'plain',
        'type': 'Test',
        'target': 'pillow1.jpg',
        'competitor': 'bw_stripe_fish2.jpg',
        'distractor': 'brokencomputer.jpg',
        'contrastDistractor': 'redbook.jpg'
    },
    '86c': {
        'originalItemId': '2',
        'targetAdjective': 'plain',
        'type': 'Test',
        'target': 'shirt1.jpg',
        'competitor': 'pillow2.jpg',
        'distractor': 'palm4.jpg',
        'contrastDistractor': 'shirt5.jpg'
    },
    '86nc': {
        'originalItemId': '2',
        'targetAdjective': 'plain',
        'type': 'Test',
        'target': 'shirt1.jpg',
        'competitor': 'pillow2.jpg',
        'distractor': 'palm4.jpg',
        'contrastDistractor': 'saddog.jpg'
    },
    '87c': {
        'originalItemId': '3',
        'targetAdjective': 'empty ',
        'type': 'Test',
        'target': '#trash1.jpg',
        'competitor': 'beer2.jpg',
        'distractor': 'pillow1.jpg',
        'contrastDistractor': '#trash5.jpg'
    },
    '87nc': {
        'originalItemId': '3',
        'targetAdjective': 'empty ',
        'type': 'Test',
        'target': '#trash1.jpg',
        'competitor': 'beer2.jpg',
        'distractor': 'pillow1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '88c': {
        'originalItemId': '4',
        'targetAdjective': 'empty ',
        'type': 'Test',
        'target': 'beer1.jpg',
        'competitor': '#theater2.jpg',
        'distractor': 'sofa5.jpg',
        'contrastDistractor': 'beer5.jpg'
    },
    '88nc': {
        'originalItemId': '4',
        'targetAdjective': 'empty ',
        'type': 'Test',
        'target': 'beer1.jpg',
        'competitor': '#theater2.jpg',
        'distractor': 'sofa5.jpg',
        'contrastDistractor': 'palm5.jpg'
    },
    '89c': {
        'originalItemId': '5',
        'targetAdjective': 'full',
        'type': 'Test',
        'target': '#trash5.jpg',
        'competitor': '#theater4.jpg',
        'distractor': 'yellow_F3.jpg',
        'contrastDistractor': '#trash1.jpg'
    },
    '89nc': {
        'originalItemId': '5',
        'targetAdjective': 'full',
        'type': 'Test',
        'target': '#trash5.jpg',
        'competitor': '#theater4.jpg',
        'distractor': 'yellow_F3.jpg',
        'contrastDistractor': 'cable2.jpg'
    },
    '90c': {
        'originalItemId': '6',
        'targetAdjective': 'full',
        'type': 'Test',
        'target': 'beer5.jpg',
        'competitor': '#trash4.jpg',
        'distractor': 'curvedbridge1.jpg',
        'contrastDistractor': 'beer1.jpg'
    },
    '90nc': {
        'originalItemId': '6',
        'targetAdjective': 'full',
        'type': 'Test',
        'target': 'beer5.jpg',
        'competitor': '#trash4.jpg',
        'distractor': 'curvedbridge1.jpg',
        'contrastDistractor': 'bentnail3.jpg'
    },
    '91c': {
        'originalItemId': '7',
        'targetAdjective': 'closed',
        'type': 'Test',
        'target': 'garagedoor1.jpg',
        'competitor': 'door2.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': 'garagedoor5.jpg'
    },
    '91nc': {
        'originalItemId': '7',
        'targetAdjective': 'closed',
        'type': 'Test',
        'target': 'garagedoor1.jpg',
        'competitor': 'door2.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': 'stonebowl.jpg'
    },
    '92c': {
        'originalItemId': '8',
        'targetAdjective': 'closed',
        'type': 'Test',
        'target': 'gate1_1.jpg',
        'competitor': 'garagedoor2.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'gate1_5.jpg'
    },
    '92nc': {
        'originalItemId': '8',
        'targetAdjective': 'closed',
        'type': 'Test',
        'target': 'gate1_1.jpg',
        'competitor': 'garagedoor2.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'blue_F1.jpg'
    },
    '93c': {
        'originalItemId': '9',
        'targetAdjective': 'straight',
        'type': 'Test',
        'target': 'bentnail1.jpg',
        'competitor': 'straw2.jpg',
        'distractor': 'snowman5.jpg',
        'contrastDistractor': 'bentnail5.jpg'
    },
    '93nc': {
        'originalItemId': '9',
        'targetAdjective': 'straight',
        'type': 'Test',
        'target': 'bentnail1.jpg',
        'competitor': 'straw2.jpg',
        'distractor': 'snowman5.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '94c': {
        'originalItemId': '10',
        'targetAdjective': 'straight',
        'type': 'Test',
        'target': 'curvedpipe1.jpg',
        'competitor': 'palm2.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'curvedpipe5.jpg'
    },
    '94nc': {
        'originalItemId': '10',
        'targetAdjective': 'straight',
        'type': 'Test',
        'target': 'curvedpipe1.jpg',
        'competitor': 'palm2.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'woodencup.jpg'
    },
    '95c': {
        'originalItemId': '11',
        'targetAdjective': 'smooth',
        'type': 'Test',
        'target': 'squash1.jpg',
        'competitor': 'shoe2.jpg',
        'distractor': '#trash2.jpg',
        'contrastDistractor': 'squash5.jpg'
    },
    '95nc': {
        'originalItemId': '11',
        'targetAdjective': 'smooth',
        'type': 'Test',
        'target': 'squash1.jpg',
        'competitor': 'shoe2.jpg',
        'distractor': '#trash2.jpg',
        'contrastDistractor': 'yellow_F3.jpg'
    },
    '96c': {
        'originalItemId': '12',
        'targetAdjective': 'smooth',
        'type': 'Test',
        'target': 'shoe1.jpg',
        'competitor': 'squash2.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'shoe5.jpg'
    },
    '96nc': {
        'originalItemId': '12',
        'targetAdjective': 'smooth',
        'type': 'Test',
        'target': 'shoe1.jpg',
        'competitor': 'squash2.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'papercup.jpg'
    },
    '97c': {
        'originalItemId': '13',
        'targetAdjective': 'striped',
        'type': 'Test',
        'target': 'bw_stripe_fish5.jpg',
        'competitor': 'flag2.jpg',
        'distractor': 'plastic_F3.jpg',
        'contrastDistractor': 'bw_stripe_fish1.jpg'
    },
    '97nc': {
        'originalItemId': '13',
        'targetAdjective': 'striped',
        'type': 'Test',
        'target': 'bw_stripe_fish5.jpg',
        'competitor': 'flag2.jpg',
        'distractor': 'plastic_F3.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '98c': {
        'originalItemId': '14',
        'targetAdjective': 'striped',
        'type': 'Test',
        'target': 'shirt5.jpg',
        'competitor': 'bw_stripe_fish2.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'shirt1.jpg'
    },
    '98nc': {
        'originalItemId': '14',
        'targetAdjective': 'striped',
        'type': 'Test',
        'target': 'shirt5.jpg',
        'competitor': 'bw_stripe_fish2.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'knife2.jpg'
    },
    '99c': {
        'originalItemId': '15',
        'targetAdjective': 'spotted',
        'type': 'Test',
        'target': 'ladybug5.jpg',
        'competitor': '#tie2.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'ladybug1.jpg'
    },
    '99nc': {
        'originalItemId': '15',
        'targetAdjective': 'spotted',
        'type': 'Test',
        'target': 'ladybug5.jpg',
        'competitor': '#tie2.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '100c': {
        'originalItemId': '16',
        'targetAdjective': 'spotted',
        'type': 'Test',
        'target': 'pillow5.jpg',
        'competitor': 'ladybug2.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'pillow1.jpg'
    },
    '100nc': {
        'originalItemId': '16',
        'targetAdjective': 'spotted',
        'type': 'Test',
        'target': 'pillow5.jpg',
        'competitor': 'ladybug2.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'blackumbrella.jpg'
    },
    '101c': {
        'originalItemId': '17',
        'targetAdjective': 'open',
        'type': 'Test',
        'target': 'garagedoor5.jpg',
        'competitor': 'gate1_2.jpg',
        'distractor': 'snowman1.jpg',
        'contrastDistractor': 'garagedoor1.jpg'
    },
    '101nc': {
        'originalItemId': '17',
        'targetAdjective': 'open',
        'type': 'Test',
        'target': 'garagedoor5.jpg',
        'competitor': 'gate1_2.jpg',
        'distractor': 'snowman1.jpg',
        'contrastDistractor': 'happy_F1.jpg'
    },
    '102c': {
        'originalItemId': '18',
        'targetAdjective': 'open',
        'type': 'Test',
        'target': 'chips5.jpg',
        'competitor': 'garagedoor2.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'chips1.jpg'
    },
    '102nc': {
        'originalItemId': '18',
        'targetAdjective': 'open',
        'type': 'Test',
        'target': 'chips5.jpg',
        'competitor': 'garagedoor2.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '103c': {
        'originalItemId': '19',
        'targetAdjective': 'bent',
        'type': 'Test',
        'target': 'bentnail5.jpg',
        'competitor': 'straw2.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'bentnail1.jpg'
    },
    '103nc': {
        'originalItemId': '19',
        'targetAdjective': 'bent',
        'type': 'Test',
        'target': 'bentnail5.jpg',
        'competitor': 'straw2.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'intactplate.jpg'
    },
    '104c': {
        'originalItemId': '20',
        'targetAdjective': 'bent',
        'type': 'Test',
        'target': 'straightrod5.jpg',
        'competitor': 'bentnail2.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'straightrod1.jpg'
    },
    '104nc': {
        'originalItemId': '20',
        'targetAdjective': 'bent',
        'type': 'Test',
        'target': 'straightrod5.jpg',
        'competitor': 'bentnail2.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'snowman3.jpg'
    },
    '105c': {
        'originalItemId': '21',
        'targetAdjective': 'curved',
        'type': 'Test',
        'target': 'sword5.jpg',
        'competitor': 'curvedpipe2.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'sword1.jpg'
    },
    '105nc': {
        'originalItemId': '21',
        'targetAdjective': 'curved',
        'type': 'Test',
        'target': 'sword5.jpg',
        'competitor': 'curvedpipe2.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'ladybug3.jpg'
    },
    '106c': {
        'originalItemId': '22',
        'targetAdjective': 'curved',
        'type': 'Test',
        'target': 'palm5.jpg',
        'competitor': 'curvedpipe2.jpg',
        'distractor': 'red_F3.jpg',
        'contrastDistractor': 'palm1.jpg'
    },
    '106nc': {
        'originalItemId': '22',
        'targetAdjective': 'curved',
        'type': 'Test',
        'target': 'palm5.jpg',
        'competitor': 'curvedpipe2.jpg',
        'distractor': 'red_F3.jpg',
        'contrastDistractor': 'happy_F1.jpg'
    },
    '107c': {
        'originalItemId': '25',
        'targetAdjective': 'long ',
        'type': 'Test',
        'target': 'cable5.jpg',
        'competitor': 'knife4.jpg',
        'distractor': 'shirt1.jpg',
        'contrastDistractor': 'cable1.jpg'
    },
    '107nc': {
        'originalItemId': '25',
        'targetAdjective': 'long ',
        'type': 'Test',
        'target': 'cable5.jpg',
        'competitor': 'knife4.jpg',
        'distractor': 'shirt1.jpg',
        'contrastDistractor': 'freshapple.jpg'
    },
    '108c': {
        'originalItemId': '29',
        'targetAdjective': 'tall',
        'type': 'Test',
        'target': 'candle5.jpg',
        'competitor': '#table4.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'candle1.jpg'
    },
    '108nc': {
        'originalItemId': '29',
        'targetAdjective': 'tall',
        'type': 'Test',
        'target': 'candle5.jpg',
        'competitor': '#table4.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'bluebook.jpg'
    },
    '109c': {
        'originalItemId': '30',
        'targetAdjective': 'tall',
        'type': 'Test',
        'target': 'stack5.jpg',
        'competitor': 'candle4.jpg',
        'distractor': 'pillow5.jpg',
        'contrastDistractor': 'stack1.jpg'
    },
    '109nc': {
        'originalItemId': '30',
        'targetAdjective': 'tall',
        'type': 'Test',
        'target': 'stack5.jpg',
        'competitor': 'candle4.jpg',
        'distractor': 'pillow5.jpg',
        'contrastDistractor': 'stack2.jpg'
    },
    '110c': {
        'originalItemId': '32',
        'targetAdjective': 'short ',
        'type': 'Test',
        'target': 'stack1.jpg',
        'competitor': 'knife2.jpg',
        'distractor': 'hallway2.jpg',
        'contrastDistractor': 'stack5.jpg'
    },
    '110nc': {
        'originalItemId': '32',
        'targetAdjective': 'short ',
        'type': 'Test',
        'target': 'stack1.jpg',
        'competitor': 'knife2.jpg',
        'distractor': 'hallway2.jpg',
        'contrastDistractor': 'happy_T1.jpg'
    },
    '111c': {
        'originalItemId': '33',
        'targetAdjective': 'thick',
        'type': 'Test',
        'target': 'marker5.jpg',
        'competitor': 'paintbrush3.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'marker1.jpg'
    },
    '111nc': {
        'originalItemId': '33',
        'targetAdjective': 'thick',
        'type': 'Test',
        'target': 'marker5.jpg',
        'competitor': 'paintbrush3.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'basketball1.jpg'
    },
    '112c': {
        'originalItemId': '34',
        'targetAdjective': 'thick',
        'type': 'Test',
        'target': '#thick5.jpg',
        'competitor': 'marker3.jpg',
        'distractor': 'boat1.jpg',
        'contrastDistractor': '#thick1.jpg'
    },
    '112nc': {
        'originalItemId': '34',
        'targetAdjective': 'thick',
        'type': 'Test',
        'target': '#thick5.jpg',
        'competitor': 'marker3.jpg',
        'distractor': 'boat1.jpg',
        'contrastDistractor': 'angryman.jpg'
    },
    '113c': {
        'originalItemId': '35',
        'targetAdjective': 'thin',
        'type': 'Test',
        'target': 'marker1.jpg',
        'competitor': '#thick2.jpg',
        'distractor': 'bentnail5.jpg',
        'contrastDistractor': 'marker5.jpg'
    },
    '113nc': {
        'originalItemId': '35',
        'targetAdjective': 'thin',
        'type': 'Test',
        'target': 'marker1.jpg',
        'competitor': '#thick2.jpg',
        'distractor': 'bentnail5.jpg',
        'contrastDistractor': 'brokenviolin.jpg'
    },
    '114c': {
        'originalItemId': '36',
        'targetAdjective': 'thin',
        'type': 'Test',
        'target': '#thick1.jpg',
        'competitor': 'paintbrush2.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': '#thick5.jpg'
    },
    '114nc': {
        'originalItemId': '36',
        'targetAdjective': 'thin',
        'type': 'Test',
        'target': '#thick1.jpg',
        'competitor': 'paintbrush2.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '115c': {
        'originalItemId': '37',
        'targetAdjective': 'wide',
        'type': 'Test',
        'target': 'wideroad5.jpg',
        'competitor': 'bridge4.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'wideroad1.jpg'
    },
    '115nc': {
        'originalItemId': '37',
        'targetAdjective': 'wide',
        'type': 'Test',
        'target': 'wideroad5.jpg',
        'competitor': 'bridge4.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'chips3.jpg'
    },
    '116c': {
        'originalItemId': '38',
        'targetAdjective': 'wide',
        'type': 'Test',
        'target': 'bridge5.jpg',
        'competitor': 'sofa5.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'bridge1.jpg'
    },
    '116nc': {
        'originalItemId': '38',
        'targetAdjective': 'wide',
        'type': 'Test',
        'target': 'bridge5.jpg',
        'competitor': 'sofa5.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'stack2.jpg'
    },
    '117c': {
        'originalItemId': '39',
        'targetAdjective': 'narrow',
        'type': 'Test',
        'target': 'wideroad2.jpg',
        'competitor': 'sofa2.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'wideroad5.jpg'
    },
    '117nc': {
        'originalItemId': '39',
        'targetAdjective': 'narrow',
        'type': 'Test',
        'target': 'wideroad2.jpg',
        'competitor': 'sofa2.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '118c': {
        'originalItemId': '40',
        'targetAdjective': 'narrow',
        'type': 'Test',
        'target': 'bridge1.jpg',
        'competitor': 'hallway2.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'bridge5.jpg'
    },
    '118nc': {
        'originalItemId': '40',
        'targetAdjective': 'narrow',
        'type': 'Test',
        'target': 'bridge1.jpg',
        'competitor': 'hallway2.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'snowman5.jpg'
    },
}
