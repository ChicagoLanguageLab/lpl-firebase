var productionInstructions = ['<p>This experiment consists of two tasks.</p><p>In one task, you will be asked to briefly describe a series of images. This task takes about 10 minutes to complete.</p><p>In the other task, you will be solving math problems while remembering sequences of letters. This task takes about 15 minutes to complete.</p><p>Press <strong>space</strong> to continue.</p>', '<p>First, you will do the image-description task.</p><p>In this task, you will see sets of four images. One image out of the four will have an arrow pointing to it. Your job is to describe the object indicted by the arrow as if you are instructing someone else to click on the image.</p><p>When describing the image, imagine that you are working with a partner who is located in another room. This partner can see the same images you see, but cannot see the arrow. Your goal is to get this partner to select the same image that the arrow points to.</p><p>Press <strong>space</strong> to continue.</p>', '<p>For example, consider the following set of images:</p><table style="margin-left: auto; margin-right: auto;"><tr><td><img width="150" src="../static/images/production/snowman1.jpg" /></td><td></td><td><img width="150" src="../static/images/production/flag2.jpg" /></td></tr><tr><td></td><td><img width="150" src="../static/images/production/bl_arrow.png"/></td><td></td></tr><tr><td><img width="150" src="../static/images/production/freshorange.jpg" /></td><td></td><td><img width="150" src="../static/images/production/freshstrawberry.jpg" /></td></tr></table><p>Now, imagine that there is another person involved in the experiment. They see the same set of images, but without the arrow:</p><table style="margin-left: auto; margin-right: auto;"><tr><td><img width="150" src="../static/images/production/snowman1.jpg" /></td><td></td><td><img width="150" src="../static/images/production/flag2.jpg" /></td></tr><tr><td><img width="150" src="../static/images/production/freshorange.jpg" /></td><td></td><td><img width="150" src="../static/images/production/freshstrawberry.jpg" /></td></tr></table><p>In order to get this person to click on the image that the arrow points to, what would you say?</p><p>Press <strong>space</strong> to continue.', '<p>Your instructions to your imaginary partner will all be of the form, "Click on the _________," where it is your job to fill in the blank. Please keep in mind that this partner cannot see the arrow and that you want them to be able to choose the correct image based on your description.</p><p>Press <strong>space</strong> when you are ready to begin.</p>'];

var productionEndInstructions = ['<p>You have finished the first task!</p><p>Press <strong>space</strong> to continue to the second task.</p>'];

// Define possible targets
var targetTypes = ['target', 'competitor', 'contrastDistractor'];

// Store list of arrow images
var arrows = ['tl_arrow.png', 'tr_arrow.png', 'bl_arrow.png', 'br_arrow.png'];

trials = {
    '1c': {
        'type': 'Color',
        'target': 'blue_F1.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'straightrod5.jpg',
        'contrastDistractor': 'bluelipstick.jpg'
    },
    '1nc': {
        'type': 'Color',
        'target': 'blue_F1.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'straightrod5.jpg',
        'contrastDistractor': 'straightrod1.jpg'
    },
    '2c': {
        'type': 'Color',
        'target': 'blue_F3.jpg',
        'competitor': 'yellow_T1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'whitenotepad.jpg'
    },
    '2nc': {
        'type': 'Color',
        'target': 'blue_F3.jpg',
        'competitor': 'yellow_T1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'glittery_F1.jpg'
    },
    '3c': {
        'type': 'Color',
        'target': 'blue_T1.jpg',
        'competitor': 'blue_T3.jpg',
        'distractor': 'wooden_F1.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '3nc': {
        'type': 'Color',
        'target': 'blue_T1.jpg',
        'competitor': 'blue_T3.jpg',
        'distractor': 'wooden_F1.jpg',
        'contrastDistractor': 'chips5.jpg'
    },
    '4c': {
        'type': 'Color',
        'target': 'blue_T2.jpg',
        'competitor': 'blue_T1.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '4nc': {
        'type': 'Color',
        'target': 'blue_T2.jpg',
        'competitor': 'blue_T1.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'candle5.jpg'
    },
    '5c': {
        'type': 'Color',
        'target': 'blue_T3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'chips5.jpg',
        'contrastDistractor': 'redbucket.jpg'
    },
    '5nc': {
        'type': 'Color',
        'target': 'blue_T3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'chips5.jpg',
        'contrastDistractor': 'bw_stripe_fish5.jpg'
    },
    '6c': {
        'type': 'Color',
        'target': 'broken_T1.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'greencast.jpg'
    },
    '6nc': {
        'type': 'Color',
        'target': 'broken_T1.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '7c': {
        'type': 'Color',
        'target': 'plastic_T1.jpg',
        'competitor': 'red_T3.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'plastic_T2.jpg'
    },
    '7nc': {
        'type': 'Color',
        'target': 'plastic_T1.jpg',
        'competitor': 'red_T3.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'boat5.jpg'
    },
    '8c': {
        'type': 'Color',
        'target': 'plastic_T2.jpg',
        'competitor': 'broken_T1.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'plastic_T1.jpg'
    },
    '8nc': {
        'type': 'Color',
        'target': 'plastic_T2.jpg',
        'competitor': 'broken_T1.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'chips5.jpg'
    },
    '9c': {
        'type': 'Color',
        'target': 'red_F1.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': 'thick4.jpg',
        'contrastDistractor': 'freshapple.jpg'
    },
    '9nc': {
        'type': 'Color',
        'target': 'red_F1.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': 'thick4.jpg',
        'contrastDistractor': 'beer5.jpg'
    },
    '10c': {
        'type': 'Color',
        'target': 'red_F2.jpg',
        'competitor': 'yellow_T2.jpg',
        'distractor': 'table2.jpg',
        'contrastDistractor': 'yellow_F3.jpg'
    },
    '10nc': {
        'type': 'Color',
        'target': 'red_F2.jpg',
        'competitor': 'yellow_T2.jpg',
        'distractor': 'table2.jpg',
        'contrastDistractor': 'browneggs.jpg'
    },
    '11c': {
        'type': 'Color',
        'target': 'red_F3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'yellow_F1.jpg'
    },
    '11nc': {
        'type': 'Color',
        'target': 'red_F3.jpg',
        'competitor': 'blue_T2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'yellow_F1.jpg'
    },
    '12c': {
        'type': 'Color',
        'target': 'red_T2.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'red_F2.jpg'
    },
    '12nc': {
        'type': 'Color',
        'target': 'red_T2.jpg',
        'competitor': 'yellow_F1.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '13c': {
        'type': 'Color',
        'target': 'red_T3.jpg',
        'competitor': 'plastic_T1.jpg',
        'distractor': 'plastic_T2.jpg',
        'contrastDistractor': 'red_F3.jpg'
    },
    '13nc': {
        'type': 'Color',
        'target': 'red_T3.jpg',
        'competitor': 'plastic_T1.jpg',
        'distractor': 'plastic_T2.jpg',
        'contrastDistractor': 'knife1.jpg'
    },
    '14c': {
        'type': 'Color',
        'target': 'redbook.jpg',
        'competitor': 'red_T2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'bluebook.jpg'
    },
    '14nc': {
        'type': 'Color',
        'target': 'redbook.jpg',
        'competitor': 'red_T2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'freshbanana.jpg'
    },
    '15c': {
        'type': 'Color',
        'target': 'yellow_F1.jpg',
        'competitor': 'blue_F1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'yellow_T1.jpg'
    },
    '15nc': {
        'type': 'Color',
        'target': 'yellow_F1.jpg',
        'competitor': 'blue_F1.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'curvedbridge1.jpg'
    },
    '16c': {
        'type': 'Color',
        'target': 'yellow_F2.jpg',
        'competitor': 'heels2.jpg',
        'distractor': 'smalldog.jpg',
        'contrastDistractor': 'yellow_T1.jpg'
    },
    '16nc': {
        'type': 'Color',
        'target': 'yellow_F2.jpg',
        'competitor': 'heels2.jpg',
        'distractor': 'smalldog.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '17c': {
        'type': 'Color',
        'target': 'yellow_F3.jpg',
        'competitor': 'red_F1.jpg',
        'distractor': 'thick3.jpg',
        'contrastDistractor': 'red_T2.jpg'
    },
    '17nc': {
        'type': 'Color',
        'target': 'yellow_F3.jpg',
        'competitor': 'red_F1.jpg',
        'distractor': 'thick3.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '18c': {
        'type': 'Color',
        'target': 'yellow_T1.jpg',
        'competitor': 'blue_F3.jpg',
        'distractor': 'bentnail1.jpg',
        'contrastDistractor': 'red_T3.jpg'
    },
    '18nc': {
        'type': 'Color',
        'target': 'yellow_T1.jpg',
        'competitor': 'blue_F3.jpg',
        'distractor': 'bentnail1.jpg',
        'contrastDistractor': 'blue_T2.jpg'
    },
    '19c': {
        'type': 'Color',
        'target': 'yellow_T2.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'red_F3.jpg'
    },
    '19nc': {
        'type': 'Color',
        'target': 'yellow_T2.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'chips2.jpg'
    },
    '20c': {
        'type': 'Color',
        'target': 'yellow_T3.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': 'thick4.jpg',
        'contrastDistractor': 'blackumbrella.jpg'
    },
    '20nc': {
        'type': 'Color',
        'target': 'yellow_T3.jpg',
        'competitor': 'red_F2.jpg',
        'distractor': 'thick4.jpg',
        'contrastDistractor': 'garagedoor5.jpg'
    },
    '21c': {
        'type': 'Filler',
        'target': 'broken_T2.jpg',
        'competitor': 'brokenprinter.jpg',
        'distractor': 'squash3.jpg',
        'contrastDistractor': 'intactplate.jpg'
    },
    '21nc': {
        'type': 'Filler',
        'target': 'broken_T2.jpg',
        'competitor': 'brokenprinter.jpg',
        'distractor': 'squash3.jpg',
        'contrastDistractor': 'happy_F2.jpg'
    },
    '22c': {
        'type': 'Filler',
        'target': 'broken_T3.jpg',
        'competitor': 'broken_T2.jpg',
        'distractor': 'bentnail3.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '22nc': {
        'type': 'Filler',
        'target': 'broken_T3.jpg',
        'competitor': 'broken_T2.jpg',
        'distractor': 'bentnail3.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '23c': {
        'type': 'Filler',
        'target': 'brokencomputer.jpg',
        'competitor': 'broken_T3.jpg',
        'distractor': 'shirt4.jpg',
        'contrastDistractor': 'functioningcomputer.jpg'
    },
    '23nc': {
        'type': 'Filler',
        'target': 'brokencomputer.jpg',
        'competitor': 'broken_T3.jpg',
        'distractor': 'shirt4.jpg',
        'contrastDistractor': 'heels1.jpg'
    },
    '24c': {
        'type': 'Filler',
        'target': 'dentedcar.jpg',
        'competitor': 'dentedtrashcan.jpg',
        'distractor': 'blue_T2.jpg',
        'contrastDistractor': 'yellow_F3.jpg'
    },
    '24nc': {
        'type': 'Filler',
        'target': 'dentedcar.jpg',
        'competitor': 'dentedtrashcan.jpg',
        'distractor': 'blue_T2.jpg',
        'contrastDistractor': 'palm5.jpg'
    },
    '25c': {
        'type': 'Filler',
        'target': 'dentedtin.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish1.jpg',
        'contrastDistractor': 'tin.jpg'
    },
    '25nc': {
        'type': 'Filler',
        'target': 'dentedtin.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish1.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '26c': {
        'type': 'Filler',
        'target': 'dentedtrashcan.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish4.jpg',
        'contrastDistractor': 'trashcan.jpg'
    },
    '26nc': {
        'type': 'Filler',
        'target': 'dentedtrashcan.jpg',
        'competitor': 'dentedcar.jpg',
        'distractor': 'bw_stripe_fish4.jpg',
        'contrastDistractor': 'realhorse.jpg'
    },
    '27c': {
        'type': 'Filler',
        'target': 'freshapple.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack1.jpg',
        'contrastDistractor': 'rottenapple.jpg'
    },
    '27nc': {
        'type': 'Filler',
        'target': 'freshapple.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack1.jpg',
        'contrastDistractor': 'garagedoor3.jpg'
    },
    '28c': {
        'type': 'Filler',
        'target': 'freshorange.jpg',
        'competitor': 'freshstrawberry.jpg',
        'distractor': 'chips1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '28nc': {
        'type': 'Filler',
        'target': 'freshorange.jpg',
        'competitor': 'freshstrawberry.jpg',
        'distractor': 'chips1.jpg',
        'contrastDistractor': 'functioningprinter.jpg'
    },
    '29c': {
        'type': 'Filler',
        'target': 'freshstrawberry.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '29nc': {
        'type': 'Filler',
        'target': 'freshstrawberry.jpg',
        'competitor': 'freshbanana.jpg',
        'distractor': 'stack2.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '30c': {
        'type': 'Filler',
        'target': 'glittery_T2.jpg',
        'competitor': 'glitteryskull.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'heels1.jpg'
    },
    '30nc': {
        'type': 'Filler',
        'target': 'glittery_T2.jpg',
        'competitor': 'glitteryskull.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'straightrod2.jpg'
    },
    '31c': {
        'type': 'Filler',
        'target': 'glittery_T3.jpg',
        'competitor': 'glittery_T2.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'browneggs.jpg'
    },
    '31nc': {
        'type': 'Filler',
        'target': 'glittery_T3.jpg',
        'competitor': 'glittery_T2.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'thick4.jpg'
    },
    '32c': {
        'type': 'Filler',
        'target': 'glitteryskull.jpg',
        'competitor': 'glittery_T3.jpg',
        'distractor': 'marker1.jpg',
        'contrastDistractor': 'skull.jpg'
    },
    '32nc': {
        'type': 'Filler',
        'target': 'glitteryskull.jpg',
        'competitor': 'glittery_T3.jpg',
        'distractor': 'marker1.jpg',
        'contrastDistractor': 'snowman4.jpg'
    },
    '33c': {
        'type': 'Filler',
        'target': 'happy_F1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'cable5.jpg',
        'contrastDistractor': 'happy_T1.jpg'
    },
    '33nc': {
        'type': 'Filler',
        'target': 'happy_F1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'cable5.jpg',
        'contrastDistractor': 'glittery_T3.jpg'
    },
    '34c': {
        'type': 'Filler',
        'target': 'happy_F2.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'bridge5.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '34nc': {
        'type': 'Filler',
        'target': 'happy_F2.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'bridge5.jpg',
        'contrastDistractor': 'garagedoor3.jpg'
    },
    '35c': {
        'type': 'Filler',
        'target': 'happy_F3.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'happybaby.jpg'
    },
    '35nc': {
        'type': 'Filler',
        'target': 'happy_F3.jpg',
        'competitor': 'happy_F1.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'curvedbridge5.jpg'
    },
    '36c': {
        'type': 'Filler',
        'target': 'happy_T1.jpg',
        'competitor': 'happy_T3.jpg',
        'distractor': 'boat1.jpg',
        'contrastDistractor': 'happy_F1.jpg'
    },
    '36nc': {
        'type': 'Filler',
        'target': 'happy_T1.jpg',
        'competitor': 'happy_T3.jpg',
        'distractor': 'boat1.jpg',
        'contrastDistractor': 'boat5.jpg'
    },
    '37c': {
        'type': 'Filler',
        'target': 'happy_T2.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'palm2.jpg',
        'contrastDistractor': 'angryman.jpg'
    },
    '37nc': {
        'type': 'Filler',
        'target': 'happy_T2.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'palm2.jpg',
        'contrastDistractor': 'boat3.jpg'
    },
    '38c': {
        'type': 'Filler',
        'target': 'happy_T3.jpg',
        'competitor': 'happy_T2.jpg',
        'distractor': 'blue_F2.jpg',
        'contrastDistractor': 'saddog.jpg'
    },
    '38nc': {
        'type': 'Filler',
        'target': 'happy_T3.jpg',
        'competitor': 'happy_T2.jpg',
        'distractor': 'blue_F2.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '39c': {
        'type': 'Filler',
        'target': 'plastic_T1.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': 'squash5.jpg',
        'contrastDistractor': 'woodencup.jpg'
    },
    '39nc': {
        'type': 'Filler',
        'target': 'plastic_T1.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': 'squash5.jpg',
        'contrastDistractor': 'saddog.jpg'
    },
    '40c': {
        'type': 'Filler',
        'target': 'plastic_T3.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'realhorse.jpg'
    },
    '40nc': {
        'type': 'Filler',
        'target': 'plastic_T3.jpg',
        'competitor': 'plastic_T2.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'marker3.jpg'
    },
    '41c': {
        'type': 'Filler',
        'target': 'plasticknife.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': 'trash2.jpg',
        'contrastDistractor': 'knife2.jpg'
    },
    '41nc': {
        'type': 'Filler',
        'target': 'plasticknife.jpg',
        'competitor': 'plastic_T3.jpg',
        'distractor': 'trash2.jpg',
        'contrastDistractor': 'intactplate.jpg'
    },
    '42c': {
        'type': 'Filler',
        'target': 'rottenapple.jpg',
        'competitor': 'rottenstrawberry.jpg',
        'distractor': 'bridge2.jpg',
        'contrastDistractor': 'freshapple.jpg'
    },
    '42nc': {
        'type': 'Filler',
        'target': 'rottenapple.jpg',
        'competitor': 'rottenstrawberry.jpg',
        'distractor': 'bridge2.jpg',
        'contrastDistractor': 'basketball1.jpg'
    },
    '43c': {
        'type': 'Filler',
        'target': 'rottenbanana.jpg',
        'competitor': 'rottenorange.jpg',
        'distractor': 'yellow_T3.jpg',
        'contrastDistractor': 'freshbanana.jpg'
    },
    '43nc': {
        'type': 'Filler',
        'target': 'rottenbanana.jpg',
        'competitor': 'rottenorange.jpg',
        'distractor': 'yellow_T3.jpg',
        'contrastDistractor': 'angryman.jpg'
    },
    '44c': {
        'type': 'Filler',
        'target': 'rottenorange.jpg',
        'competitor': 'rottenapple.jpg',
        'distractor': 'heels1.jpg',
        'contrastDistractor': 'freshorange.jpg'
    },
    '44nc': {
        'type': 'Filler',
        'target': 'rottenorange.jpg',
        'competitor': 'rottenapple.jpg',
        'distractor': 'heels1.jpg',
        'contrastDistractor': 'browneggs.jpg'
    },
    '45c': {
        'type': 'Filler',
        'target': 'wooden_F1.jpg',
        'competitor': 'stonebowl.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'wooden_F2.jpg'
    },
    '45nc': {
        'type': 'Filler',
        'target': 'wooden_F1.jpg',
        'competitor': 'stonebowl.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'trash3.jpg'
    },
    '46c': {
        'type': 'Filler',
        'target': 'wooden_F2.jpg',
        'competitor': 'wooden_F3.jpg',
        'distractor': 'sofa4.jpg',
        'contrastDistractor': 'wooden_F1.jpg'
    },
    '46nc': {
        'type': 'Filler',
        'target': 'wooden_F2.jpg',
        'competitor': 'wooden_F3.jpg',
        'distractor': 'sofa4.jpg',
        'contrastDistractor': 'shoe3.jpg'
    },
    '47c': {
        'type': 'Filler',
        'target': 'wooden_F3.jpg',
        'competitor': 'wooden_F2.jpg',
        'distractor': 'glittery_F2.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '47nc': {
        'type': 'Filler',
        'target': 'wooden_F3.jpg',
        'competitor': 'wooden_F2.jpg',
        'distractor': 'glittery_F2.jpg',
        'contrastDistractor': 'knife5.jpg'
    },
    '48c': {
        'type': 'Filler',
        'target': 'wooden_T1.jpg',
        'competitor': 'wooden_T3.jpg',
        'distractor': 'beer4.jpg',
        'contrastDistractor': 'stonebowl.jpg'
    },
    '48nc': {
        'type': 'Filler',
        'target': 'wooden_T1.jpg',
        'competitor': 'wooden_T3.jpg',
        'distractor': 'beer4.jpg',
        'contrastDistractor': 'redbucket.jpg'
    },
    '49c': {
        'type': 'Filler',
        'target': 'wooden_T2.jpg',
        'competitor': 'wooden_T1.jpg',
        'distractor': 'knife4.jpg',
        'contrastDistractor': 'red_T2.jpg'
    },
    '49nc': {
        'type': 'Filler',
        'target': 'wooden_T2.jpg',
        'competitor': 'wooden_T1.jpg',
        'distractor': 'knife4.jpg',
        'contrastDistractor': 'shirt1.jpg'
    },
    '50c': {
        'type': 'Filler',
        'target': 'wooden_T3.jpg',
        'competitor': 'wooden_T2.jpg',
        'distractor': 'straightrod2.jpg',
        'contrastDistractor': 'metaldoor.jpg'
    },
    '50nc': {
        'type': 'Filler',
        'target': 'wooden_T3.jpg',
        'competitor': 'wooden_T2.jpg',
        'distractor': 'straightrod2.jpg',
        'contrastDistractor': 'red_T3.jpg'
    },
    '51c': {
        'type': 'NoAdj',
        'target': 'table1.jpg',
        'competitor': 'palm5.jpg',
        'distractor': 'thick1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '51nc': {
        'type': 'NoAdj',
        'target': 'table1.jpg',
        'competitor': 'palm5.jpg',
        'distractor': 'thick1.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '52c': {
        'type': 'NoAdj',
        'target': 'thick1.jpg',
        'competitor': 'chips1.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'dog.jpg'
    },
    '52nc': {
        'type': 'NoAdj',
        'target': 'thick1.jpg',
        'competitor': 'chips1.jpg',
        'distractor': 'bw_stripe_fish5.jpg',
        'contrastDistractor': 'squash2.jpg'
    },
    '53c': {
        'type': 'NoAdj',
        'target': 'trash1.jpg',
        'competitor': 'candle1.jpg',
        'distractor': 'straightrod1.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '53nc': {
        'type': 'NoAdj',
        'target': 'trash1.jpg',
        'competitor': 'candle1.jpg',
        'distractor': 'straightrod1.jpg',
        'contrastDistractor': 'bentnail5.jpg'
    },
    '54c': {
        'type': 'NoAdj',
        'target': 'beer1.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'freshbanana.jpg'
    },
    '54nc': {
        'type': 'NoAdj',
        'target': 'beer1.jpg',
        'competitor': 'happy_T1.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'redornament.jpg'
    },
    '55c': {
        'type': 'NoAdj',
        'target': 'bentnail1.jpg',
        'competitor': 'shirt2.jpg',
        'distractor': 'happy_F1.jpg',
        'contrastDistractor': 'shirt5.jpg'
    },
    '55nc': {
        'type': 'NoAdj',
        'target': 'bentnail1.jpg',
        'competitor': 'shirt2.jpg',
        'distractor': 'happy_F1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '56c': {
        'type': 'NoAdj',
        'target': 'blue_F1.jpg',
        'competitor': 'ladybug2.jpg',
        'distractor': 'yellow_T1.jpg',
        'contrastDistractor': 'basketball1.jpg'
    },
    '56nc': {
        'type': 'NoAdj',
        'target': 'blue_F1.jpg',
        'competitor': 'ladybug2.jpg',
        'distractor': 'yellow_T1.jpg',
        'contrastDistractor': 'happywoman.jpg'
    },
    '57c': {
        'type': 'NoAdj',
        'target': 'blue_F2.jpg',
        'competitor': 'squash3.jpg',
        'distractor': 'wooden_T1.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '57nc': {
        'type': 'NoAdj',
        'target': 'blue_F2.jpg',
        'competitor': 'squash3.jpg',
        'distractor': 'wooden_T1.jpg',
        'contrastDistractor': 'ladybug2.jpg'
    },
    '58c': {
        'type': 'NoAdj',
        'target': 'blue_F3.jpg',
        'competitor': 'snowman1.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': 'heels2.jpg'
    },
    '58nc': {
        'type': 'NoAdj',
        'target': 'blue_F3.jpg',
        'competitor': 'snowman1.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '59c': {
        'type': 'NoAdj',
        'target': 'blue_T1.jpg',
        'competitor': 'chips5.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '59nc': {
        'type': 'NoAdj',
        'target': 'blue_T1.jpg',
        'competitor': 'chips5.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'marker2.jpg'
    },
    '60c': {
        'type': 'NoAdj',
        'target': 'blue_T2.jpg',
        'competitor': 'trash3.jpg',
        'distractor': 'wooden_T3.jpg',
        'contrastDistractor': 'brokenprinter.jpg'
    },
    '60nc': {
        'type': 'NoAdj',
        'target': 'blue_T2.jpg',
        'competitor': 'trash3.jpg',
        'distractor': 'wooden_T3.jpg',
        'contrastDistractor': 'papercup.jpg'
    },
    '61c': {
        'type': 'NoAdj',
        'target': 'blue_T3.jpg',
        'competitor': 'boat2.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'knife2.jpg'
    },
    '61nc': {
        'type': 'NoAdj',
        'target': 'blue_T3.jpg',
        'competitor': 'boat2.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '62c': {
        'type': 'NoAdj',
        'target': 'boat1.jpg',
        'competitor': 'bridge2.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'whitenotepad.jpg'
    },
    '62nc': {
        'type': 'NoAdj',
        'target': 'boat1.jpg',
        'competitor': 'bridge2.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'stack5.jpg'
    },
    '63c': {
        'type': 'NoAdj',
        'target': 'bridge1.jpg',
        'competitor': 'shirt4.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'candle4.jpg'
    },
    '63nc': {
        'type': 'NoAdj',
        'target': 'bridge1.jpg',
        'competitor': 'shirt4.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'shoe2.jpg'
    },
    '64c': {
        'type': 'NoAdj',
        'target': 'broken_F1.jpg',
        'competitor': 'thick1.jpg',
        'distractor': 'shoe2.jpg',
        'contrastDistractor': 'ladybug2.jpg'
    },
    '64nc': {
        'type': 'NoAdj',
        'target': 'broken_F1.jpg',
        'competitor': 'thick1.jpg',
        'distractor': 'shoe2.jpg',
        'contrastDistractor': 'pillow1.jpg'
    },
    '65c': {
        'type': 'NoAdj',
        'target': 'broken_F2.jpg',
        'competitor': 'yellow_F2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'palm3.jpg'
    },
    '65nc': {
        'type': 'NoAdj',
        'target': 'broken_F2.jpg',
        'competitor': 'yellow_F2.jpg',
        'distractor': 'glittery_T1.jpg',
        'contrastDistractor': 'realhorse.jpg'
    },
    '66c': {
        'type': 'NoAdj',
        'target': 'broken_T1.jpg',
        'competitor': 'straightrod4.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '66nc': {
        'type': 'NoAdj',
        'target': 'broken_T1.jpg',
        'competitor': 'straightrod4.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'rottenapple.jpg'
    },
    '67c': {
        'type': 'NoAdj',
        'target': 'cable1.jpg',
        'competitor': 'thick2.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': 'blackumbrella.jpg'
    },
    '67nc': {
        'type': 'NoAdj',
        'target': 'cable1.jpg',
        'competitor': 'thick2.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': 'trash1.jpg'
    },
    '68c': {
        'type': 'NoAdj',
        'target': 'candle1.jpg',
        'competitor': 'sofa4.jpg',
        'distractor': 'straightrod4.jpg',
        'contrastDistractor': 'squash5.jpg'
    },
    '68nc': {
        'type': 'NoAdj',
        'target': 'candle1.jpg',
        'competitor': 'sofa4.jpg',
        'distractor': 'straightrod4.jpg',
        'contrastDistractor': 'table3.jpg'
    },
    '69c': {
        'type': 'NoAdj',
        'target': 'chips1.jpg',
        'competitor': 'glittery_F2.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'pillow3.jpg'
    },
    '69nc': {
        'type': 'NoAdj',
        'target': 'chips1.jpg',
        'competitor': 'glittery_F2.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'shirt2.jpg'
    },
    '70c': {
        'type': 'NoAdj',
        'target': 'curvedbridge1.jpg',
        'competitor': 'broken_F3.jpg',
        'distractor': 'glittery_F3.jpg',
        'contrastDistractor': 'snowman1.jpg'
    },
    '70nc': {
        'type': 'NoAdj',
        'target': 'curvedbridge1.jpg',
        'competitor': 'broken_F3.jpg',
        'distractor': 'glittery_F3.jpg',
        'contrastDistractor': 'garagedoor2.jpg'
    },
    '71c': {
        'type': 'NoAdj',
        'target': 'garagedoor5.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': 'trash1.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '71nc': {
        'type': 'NoAdj',
        'target': 'garagedoor5.jpg',
        'competitor': 'yellow_F3.jpg',
        'distractor': 'trash1.jpg',
        'contrastDistractor': 'shirt2.jpg'
    },
    '72c': {
        'type': 'NoAdj',
        'target': 'glittery_T2.jpg',
        'competitor': 'bw_stripe_fish5.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'plasticknife.jpg'
    },
    '72nc': {
        'type': 'NoAdj',
        'target': 'glittery_T2.jpg',
        'competitor': 'bw_stripe_fish5.jpg',
        'distractor': 'candle2.jpg',
        'contrastDistractor': 'redbook.jpg'
    },
    '73c': {
        'type': 'NoAdj',
        'target': 'marker1.jpg',
        'competitor': 'snowman2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'brokencomputer.jpg'
    },
    '73nc': {
        'type': 'NoAdj',
        'target': 'marker1.jpg',
        'competitor': 'snowman2.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'bw_stripe_fish3.jpg'
    },
    '74c': {
        'type': 'NoAdj',
        'target': 'palm1.jpg',
        'competitor': 'table4.jpg',
        'distractor': 'thick3.jpg',
        'contrastDistractor': 'red_T2.jpg'
    },
    '74nc': {
        'type': 'NoAdj',
        'target': 'palm1.jpg',
        'competitor': 'table4.jpg',
        'distractor': 'thick3.jpg',
        'contrastDistractor': 'bridge2.jpg'
    },
    '75c': {
        'type': 'NoAdj',
        'target': 'shoe1.jpg',
        'competitor': 'ladybug3.jpg',
        'distractor': 'broken_T3.jpg',
        'contrastDistractor': 'trash2.jpg'
    },
    '75nc': {
        'type': 'NoAdj',
        'target': 'shoe1.jpg',
        'competitor': 'ladybug3.jpg',
        'distractor': 'broken_T3.jpg',
        'contrastDistractor': 'plasticknife.jpg'
    },
    '76c': {
        'type': 'NoAdj',
        'target': 'snowman1.jpg',
        'competitor': 'marker3.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '76nc': {
        'type': 'NoAdj',
        'target': 'snowman1.jpg',
        'competitor': 'marker3.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'stonebowl.jpg'
    },
    '77c': {
        'type': 'NoAdj',
        'target': 'sofa1.jpg',
        'competitor': 'bridge1.jpg',
        'distractor': 'ladybug3.jpg',
        'contrastDistractor': 'broken_T3.jpg'
    },
    '77nc': {
        'type': 'NoAdj',
        'target': 'sofa1.jpg',
        'competitor': 'bridge1.jpg',
        'distractor': 'ladybug3.jpg',
        'contrastDistractor': 'plastic_T3.jpg'
    },
    '78c': {
        'type': 'NoAdj',
        'target': 'squash1.jpg',
        'competitor': 'palm4.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'wooden_F3.jpg'
    },
    '78nc': {
        'type': 'NoAdj',
        'target': 'squash1.jpg',
        'competitor': 'palm4.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'metaldoor.jpg'
    },
    '79c': {
        'type': 'NoAdj',
        'target': 'stack1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'shoe3.jpg'
    },
    '79nc': {
        'type': 'NoAdj',
        'target': 'stack1.jpg',
        'competitor': 'happy_F2.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'whitenotepad.jpg'
    },
    '80c': {
        'type': 'NoAdj',
        'target': 'straightrod1.jpg',
        'competitor': 'cable2.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'stack5.jpg'
    },
    '80nc': {
        'type': 'NoAdj',
        'target': 'straightrod1.jpg',
        'competitor': 'cable2.jpg',
        'distractor': 'happy_T2.jpg',
        'contrastDistractor': 'red_F1.jpg'
    },
    '81c': {
        'type': 'Test',
        'target': 'thick1.jpg',
        'competitor': 'paintbrush1.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': 'thick4.jpg'
    },
    '81nc': {
        'type': 'Test',
        'target': 'thick1.jpg',
        'competitor': 'paintbrush1.jpg',
        'distractor': 'curvedbridge3.jpg',
        'contrastDistractor': 'ceramicpitcher.jpg'
    },
    '82c': {
        'type': 'Test',
        'target': 'thick5.jpg',
        'competitor': 'marker5.jpg',
        'distractor': 'smalldog.jpg',
        'contrastDistractor': 'thick2.jpg'
    },
    '82nc': {
        'type': 'Test',
        'target': 'thick5.jpg',
        'competitor': 'marker5.jpg',
        'distractor': 'smalldog.jpg',
        'contrastDistractor': 'angryman.jpg'
    },
    '83c': {
        'type': 'Test',
        'target': 'trash1.jpg',
        'competitor': 'beer1.jpg',
        'distractor': 'pillow1.jpg',
        'contrastDistractor': 'trash4.jpg'
    },
    '83nc': {
        'type': 'Test',
        'target': 'trash1.jpg',
        'competitor': 'beer1.jpg',
        'distractor': 'pillow1.jpg',
        'contrastDistractor': 'rottenorange.jpg'
    },
    '84c': {
        'type': 'Test',
        'target': 'trash5.jpg',
        'competitor': 'tub5.jpg',
        'distractor': 'yellow_F3.jpg',
        'contrastDistractor': 'trash2.jpg'
    },
    '84nc': {
        'type': 'Test',
        'target': 'trash5.jpg',
        'competitor': 'tub5.jpg',
        'distractor': 'yellow_F3.jpg',
        'contrastDistractor': 'cable2.jpg'
    },
    '85c': {
        'type': 'Test',
        'target': 'beer1.jpg',
        'competitor': 'tub1.jpg',
        'distractor': 'sofa5.jpg',
        'contrastDistractor': 'beer4.jpg'
    },
    '85nc': {
        'type': 'Test',
        'target': 'beer1.jpg',
        'competitor': 'tub1.jpg',
        'distractor': 'sofa5.jpg',
        'contrastDistractor': 'palm5.jpg'
    },
    '86c': {
        'type': 'Test',
        'target': 'beer5.jpg',
        'competitor': 'trash5.jpg',
        'distractor': 'curvedbridge1.jpg',
        'contrastDistractor': 'beer2.jpg'
    },
    '86nc': {
        'type': 'Test',
        'target': 'beer5.jpg',
        'competitor': 'trash5.jpg',
        'distractor': 'curvedbridge1.jpg',
        'contrastDistractor': 'bentnail3.jpg'
    },
    '87c': {
        'type': 'Test',
        'target': 'bentnail1.jpg',
        'competitor': 'straw1.jpg',
        'distractor': 'snowman5.jpg  ',
        'contrastDistractor': 'bentnail4.jpg'
    },
    '87nc': {
        'type': 'Test',
        'target': 'bentnail1.jpg',
        'competitor': 'straw1.jpg',
        'distractor': 'snowman5.jpg',
        'contrastDistractor': 'waka1.jpg'
    },
    '88c': {
        'type': 'Test',
        'target': 'bentnail5.jpg',
        'competitor': 'straw5.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'bentnail1.jpg'
    },
    '88nc': {
        'type': 'Test',
        'target': 'bentnail5.jpg',
        'competitor': 'straw5.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'intactplate.jpg'
    },
    '89c': {
        'type': 'Test',
        'target': 'boat5.jpg',
        'competitor': 'snowman5.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'powerboat.jpg'
    },
    '89nc': {
        'type': 'Test',
        'target': 'boat5.jpg',
        'competitor': 'snowman5.jpg',
        'distractor': 'shirt2.jpg',
        'contrastDistractor': 'heels2.jpg'
    },
    '90c': {
        'type': 'Test',
        'target': 'bw_stripe_fish5.jpg',
        'competitor': 'flag5.jpg',
        'distractor': 'plastic_F3.jpg',
        'contrastDistractor': 'bw_stripe_fish1.jpg'
    },
    '90nc': {
        'type': 'Test',
        'target': 'bw_stripe_fish5.jpg',
        'competitor': 'flag5.jpg',
        'distractor': 'plastic_F3.jpg',
        'contrastDistractor': 'lightbulb.jpg'
    },
    '91c': {
        'type': 'Test',
        'target': 'cable1.jpg',
        'competitor': 'knife1.jpg',
        'distractor': 'yellow_F1.jpg',
        'contrastDistractor': 'cable5.jpg'
    },
    '91nc': {
        'type': 'Test',
        'target': 'cable1.jpg',
        'competitor': 'knife1.jpg',
        'distractor': 'yellow_F1.jpg',
        'contrastDistractor': 'brokentv.jpg'
    },
    '92c': {
        'type': 'Test',
        'target': 'cable5.jpg',
        'competitor': 'screwdriver5.jpg',
        'distractor': 'shirt1.jpg',
        'contrastDistractor': 'cable1.jpg'
    },
    '92nc': {
        'type': 'Test',
        'target': 'cable5.jpg',
        'competitor': 'screwdriver5.jpg',
        'distractor': 'shirt1.jpg',
        'contrastDistractor': 'freshapple.jpg'
    },
    '93c': {
        'type': 'Test',
        'target': 'candle1.jpg',
        'competitor': 'stack1.jpg',
        'distractor': 'broken_T3.jpg',
        'contrastDistractor': 'candle4.jpg'
    },
    '93nc': {
        'type': 'Test',
        'target': 'candle1.jpg',
        'competitor': 'stack1.jpg',
        'distractor': 'broken_T3.jpg',
        'contrastDistractor': 'blackumbrella.jpg'
    },
    '94c': {
        'type': 'Test',
        'target': 'candle5.jpg',
        'competitor': 'tree5.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'candle2.jpg'
    },
    '94nc': {
        'type': 'Test',
        'target': 'candle5.jpg',
        'competitor': 'tree5.jpg',
        'distractor': 'plastic_F1.jpg',
        'contrastDistractor': 'bluebook.jpg'
    },
    '95c': {
        'type': 'Test',
        'target': 'chips5.jpg',
        'competitor': 'garagedoor5.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'chips1.jpg'
    },
    '95nc': {
        'type': 'Test',
        'target': 'chips5.jpg',
        'competitor': 'garagedoor5.jpg',
        'distractor': 'candle5.jpg',
        'contrastDistractor': 'orangebutterfly.jpg'
    },
    '96c': {
        'type': 'Test',
        'target': 'curvedpipe1.jpg',
        'competitor': 'palm1.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'curvedpipe4.jpg'
    },
    '96nc': {
        'type': 'Test',
        'target': 'curvedpipe1.jpg',
        'competitor': 'palm1.jpg',
        'distractor': 'garagedoor3.jpg',
        'contrastDistractor': 'woodencup.jpg'
    },
    '97c': {
        'type': 'Test',
        'target': 'curvedpipe5.jpg',
        'competitor': 'sword5.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'curvedpipe1.jpg'
    },
    '97nc': {
        'type': 'Test',
        'target': 'curvedpipe5.jpg',
        'competitor': 'sword5.jpg',
        'distractor': 'yellow_T2.jpg',
        'contrastDistractor': 'ladybug3.jpg'
    },
    '98c': {
        'type': 'Test',
        'target': 'garagedoor1.jpg',
        'competitor': 'door1.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': 'garagedoor2.jpg'
    },
    '98nc': {
        'type': 'Test',
        'target': 'garagedoor1.jpg',
        'competitor': 'door1.jpg',
        'distractor': 'boat2.jpg',
        'contrastDistractor': 'stonebowl.jpg'
    },
    '99c': {
        'type': 'Test',
        'target': 'garagedoor5.jpg',
        'competitor': 'gate1_5.jpg',
        'distractor': 'snowman1.jpg',
        'contrastDistractor': 'garagedoor1.jpg'
    },
    '99nc': {
        'type': 'Test',
        'target': 'garagedoor5.jpg',
        'competitor': 'gate1_5.jpg',
        'distractor': 'snowman1.jpg',
        'contrastDistractor': 'happy_F1.jpg'
    },
    '100c': {
        'type': 'Test',
        'target': 'gate1_1.jpg',
        'competitor': 'garagedoor1.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'gate1_4.jpg'
    },
    '100nc': {
        'type': 'Test',
        'target': 'gate1_1.jpg',
        'competitor': 'garagedoor1.jpg',
        'distractor': 'broken_F1.jpg',
        'contrastDistractor': 'blue_F1.jpg'
    },
    '101c': {
        'type': 'Test',
        'target': 'hallway1.jpg',
        'competitor': 'wideroad5.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'hallway3.jpg'
    },
    '101nc': {
        'type': 'Test',
        'target': 'hallway1.jpg',
        'competitor': 'wideroad5.jpg',
        'distractor': 'stack4.jpg',
        'contrastDistractor': 'stack2.jpg'
    },
    '102c': {
        'type': 'Test',
        'target': 'hallway3.jpg',
        'competitor': 'stairs1.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'hallway1.jpg'
    },
    '102nc': {
        'type': 'Test',
        'target': 'hallway3.jpg',
        'competitor': 'stairs1.jpg',
        'distractor': 'red_T1.jpg',
        'contrastDistractor': 'snowman5.jpg'
    },
    '103c': {
        'type': 'Test',
        'target': 'knife1.jpg',
        'competitor': 'screwdriver1.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'knife4.jpg'
    },
    '103nc': {
        'type': 'Test',
        'target': 'knife1.jpg',
        'competitor': 'screwdriver1.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'brokencomputer.jpg'
    },
    '104c': {
        'type': 'Test',
        'target': 'knife5.jpg',
        'competitor': 'cable5.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'knife2.jpg'
    },
    '104nc': {
        'type': 'Test',
        'target': 'knife5.jpg',
        'competitor': 'cable5.jpg',
        'distractor': 'palm5.jpg',
        'contrastDistractor': 'dog.jpg'
    },
    '105c': {
        'type': 'Test',
        'target': 'ladybug5.jpg',
        'competitor': 'tie5.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'ladybug1.jpg'
    },
    '105nc': {
        'type': 'Test',
        'target': 'ladybug5.jpg',
        'competitor': 'tie5.jpg',
        'distractor': 'shoe1.jpg',
        'contrastDistractor': 'greenmug.jpg'
    },
    '106c': {
        'type': 'Test',
        'target': 'marker1.jpg',
        'competitor': 'thick1.jpg',
        'distractor': 'bentnail5.jpg',
        'contrastDistractor': 'marker4.jpg'
    },
    '106nc': {
        'type': 'Test',
        'target': 'marker1.jpg',
        'competitor': 'thick1.jpg',
        'distractor': 'bentnail5.jpg',
        'contrastDistractor': 'brokenviolin.jpg'
    },
    '107c': {
        'type': 'Test',
        'target': 'marker5.jpg',
        'competitor': 'paintbrush5.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'marker2.jpg'
    },
    '107nc': {
        'type': 'Test',
        'target': 'marker5.jpg',
        'competitor': 'paintbrush5.jpg',
        'distractor': 'squash1.jpg',
        'contrastDistractor': 'basketball1.jpg'
    },
    '108c': {
        'type': 'Test',
        'target': 'palm5.jpg',
        'competitor': 'curvedpipe5.jpg',
        'distractor': 'red_F3.jpg',
        'contrastDistractor': 'palm1.jpg'
    },
    '108nc': {
        'type': 'Test',
        'target': 'palm5.jpg',
        'competitor': 'curvedpipe5.jpg',
        'distractor': 'red_F3.jpg',
        'contrastDistractor': 'happy_F1.jpg'
    },
    '109c': {
        'type': 'Test',
        'target': 'pillow1.jpg',
        'competitor': 'shirt1.jpg',
        'distractor': 'brokencomputer.jpg',
        'contrastDistractor': 'pillow4.jpg'
    },
    '109nc': {
        'type': 'Test',
        'target': 'pillow1.jpg',
        'competitor': 'shirt1.jpg',
        'distractor': 'brokencomputer.jpg',
        'contrastDistractor': 'redbook.jpg'
    },
    '110c': {
        'type': 'Test',
        'target': 'pillow5.jpg',
        'competitor': 'ladybug5.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'pillow1.jpg'
    },
    '110nc': {
        'type': 'Test',
        'target': 'pillow5.jpg',
        'competitor': 'ladybug5.jpg',
        'distractor': 'boat3.jpg',
        'contrastDistractor': 'blackumbrella.jpg'
    },
    '111c': {
        'type': 'Test',
        'target': 'shirt1.jpg',
        'competitor': 'pillow1.jpg',
        'distractor': 'curvedpipe1.jpg',
        'contrastDistractor': 'shirt4.jpg'
    },
    '111nc': {
        'type': 'Test',
        'target': 'shirt1.jpg',
        'competitor': 'pillow1.jpg',
        'distractor': 'flag4.jpg',
        'contrastDistractor': 'saddog.jpg'
    },
    '112c': {
        'type': 'Test',
        'target': 'shirt5.jpg',
        'competitor': 'bw_stripe_fish5.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'shirt1.jpg'
    },
    '112nc': {
        'type': 'Test',
        'target': 'shirt5.jpg',
        'competitor': 'bw_stripe_fish5.jpg',
        'distractor': 'blue_T1.jpg',
        'contrastDistractor': 'knife2.jpg'
    },
    '113c': {
        'type': 'Test',
        'target': 'shoe1.jpg',
        'competitor': 'squash1.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'shoe4.jpg'
    },
    '113nc': {
        'type': 'Test',
        'target': 'shoe1.jpg',
        'competitor': 'squash1.jpg',
        'distractor': 'marker4.jpg',
        'contrastDistractor': 'papercup.jpg'
    },
    '114c': {
        'type': 'Test',
        'target': 'shoe5.jpg',
        'competitor': 'squash5.jpg',
        'distractor': 'broken_T2.jpg',
        'contrastDistractor': 'shoe1.jpg'
    },
    '114nc': {
        'type': 'Test',
        'target': 'shoe5.jpg',
        'competitor': 'squash5.jpg',
        'distractor': 'broken_T2.jpg',
        'contrastDistractor': 'garagedoor1.jpg'
    },
    '115c': {
        'type': 'Test',
        'target': 'snowman1.jpg',
        'competitor': 'smalldog.jpg',
        'distractor': 'red_F2.jpg',
        'contrastDistractor': 'snowman4.jpg'
    },
    '115nc': {
        'type': 'Test',
        'target': 'snowman1.jpg',
        'competitor': 'smalldog.jpg',
        'distractor': 'red_F2.jpg',
        'contrastDistractor': 'freshstrawberry.jpg'
    },
    '116c': {
        'type': 'Test',
        'target': 'snowman5.jpg',
        'competitor': 'boat5.jpg',
        'distractor': 'trash3.jpg',
        'contrastDistractor': 'snowman2.jpg'
    },
    '116nc': {
        'type': 'Test',
        'target': 'snowman5.jpg',
        'competitor': 'boat5.jpg',
        'distractor': 'trash3.jpg',
        'contrastDistractor': 'plastic_T3.jpg'
    },
    '117c': {
        'type': 'Test',
        'target': 'squash1.jpg',
        'competitor': 'shoe1.jpg',
        'distractor': 'trash2.jpg',
        'contrastDistractor': 'squash4.jpg'
    },
    '117nc': {
        'type': 'Test',
        'target': 'squash1.jpg',
        'competitor': 'shoe1.jpg',
        'distractor': 'trash2.jpg',
        'contrastDistractor': 'yellow_F3.jpg'
    },
    '118c': {
        'type': 'Test',
        'target': 'squash5.jpg',
        'competitor': 'shoe5.jpg',
        'distractor': 'flag4.jpg',
        'contrastDistractor': 'squash1.jpg'
    },
    '118nc': {
        'type': 'Test',
        'target': 'squash5.jpg',
        'competitor': 'shoe5.jpg',
        'distractor': 'happy_T3.jpg',
        'contrastDistractor': 'heels1.jpg'
    },
    '119c': {
        'type': 'Test',
        'target': 'stack1.jpg',
        'competitor': 'tree1.jpg',
        'distractor': 'bridge4.jpg',
        'contrastDistractor': 'stack4.jpg'
    },
    '119nc': {
        'type': 'Test',
        'target': 'stack1.jpg',
        'competitor': 'tree1.jpg',
        'distractor': 'bridge4.jpg',
        'contrastDistractor': 'happy_T1.jpg'
    },
    '120c': {
        'type': 'Test',
        'target': 'stack5.jpg',
        'competitor': 'candle5.jpg',
        'distractor': 'pillow5.jpg',
        'contrastDistractor': 'stack2.jpg'
    },
    '120nc': {
        'type': 'Test',
        'target': 'stack5.jpg',
        'competitor': 'candle5.jpg',
        'distractor': 'pillow5.jpg',
        'contrastDistractor': 'stack2.jpg'
    },
    '121c': {
        'type': 'Test',
        'target': 'straightrod5.jpg',
        'competitor': 'bentnail5.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'straightrod1.jpg'
    },
    '121nc': {
        'type': 'Test',
        'target': 'straightrod5.jpg',
        'competitor': 'bentnail5.jpg',
        'distractor': 'marker2.jpg',
        'contrastDistractor': 'palm3.jpg'
    },
    '122c': {
        'type': 'Test',
        'target': 'wideroad1.jpg',
        'competitor': 'hallway3.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'wideroad4.jpg'
    },
    '122nc': {
        'type': 'Test',
        'target': 'wideroad1.jpg',
        'competitor': 'hallway3.jpg',
        'distractor': 'bw_stripe_fish3.jpg',
        'contrastDistractor': 'rottenstrawberry.jpg'
    },
    '123c': {
        'type': 'Test',
        'target': 'wideroad5.jpg',
        'competitor': 'stairs5.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'wideroad2.jpg'
    },
    '123nc': {
        'type': 'Test',
        'target': 'wideroad5.jpg',
        'competitor': 'stairs5.jpg',
        'distractor': 'yellow_F2.jpg',
        'contrastDistractor': 'chips3.jpg'
    },
    '124c': {
        'type': 'Test',
        'target': 'smalldog.jpg',
        'competitor': 'snowman1.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'bigdog.jpg'
    },
    '124nc': {
        'type': 'Test',
        'target': 'smalldog.jpg',
        'competitor': 'snowman1.jpg',
        'distractor': 'glittery_T2.jpg',
        'contrastDistractor': 'freshorange.jpg'
    }
}
