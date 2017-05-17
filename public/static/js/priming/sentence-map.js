sentences = {'1a': 'Daniel planned to send his mother a note, but after work he was too tired to.',
			 '1b': 'Daniel planned to send his mother a note, but after work he was too tired.', 
			 '1c': 'Daniel planned to send his mother a note, but after work he was too tired to send her anything.', 
			 '1d': 'Daniel planned to send his mother a note, but after work he slept.', 
			 '1e': 'Daniel planned to send a note to his mother, but after work he was too tired to.', 
			 '1f': 'Daniel planned to send a note to his mother, but after work he was too tired.',
			 '1g': 'Daniel planned to send a note to his mother, but after work he was too tired to send anything to her.',
			 '1h': 'Daniel planned to send a note to his mother, but after work he slept.',
			 '6a': 'Robin said he would lend the gambler some money, but at the local club he wasn\'t allowed to.',
			 '6b': 'Robin said he would lend the gambler some money, but at the local club he wasn\'t allowed.', 
			 '6c': 'Robin said he would lend the gambler some money, but at the local club he wasn\'t allowed to lend him money.', 
			 '6d': 'Robin said he would lend the gambler some money, but at the local club he was frugal.', 
			 '6e': 'Robin said he would lend some money to the gambler, but at the local club he wasn\'t allowed to.', 
			 '6f': 'Robin said he would lend some money to the gambler, but at the local club he wasn\'t allowed.',
			 '6g': 'Robin said he would lend some money to the gambler, but at the local club he wasn\'t allowed to lend money to him.', 
			 '6h': 'Robin said he would lend some money to the gambler, but at the local club he was frugal.',
			 '10a': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he wasn\'t strong enough to.', 
			 '10b': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he wasn\'t strong enough.', 
			 '10c': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he wasn\'t strong enough to throw him anything.',
			 '10d': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he was weak.', 
			 '10e': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he wasn\'t strong enough to.', 
			 '10f': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he wasn\'t strong enough.', 
			 '10g': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he wasn\'t strong enough to throw anything to him.', 
			 '10h': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he was weak.',
			 '15a': 'The county doesn\'t offer its residents these services yet, but next year they will start to.', 
			 '15b': 'The county doesn\'t offer its residents these services yet, but next year they will start.', 
			 '15c': 'The county doesn\'t offer its residents these services yet, but next year they will start to offer them some services.', 
			 '15d': 'The county doesn\'t offer its residents these services yet, but next year they will change.', 
			 '15e': 'The county doesn\'t offer these services to its residents yet, but next year they will start to.', 
			 '15f': 'The county doesn\'t offer these services to its residents yet, but next year they will start.', 
			 '15g': 'The county doesn\'t offer these services to its residents yet, but next year they will start to offer some services to them.', 
			 '15h': 'The county doesn\'t offer these services to its residents yet, but next year they will change.',
			 '17a': 'Suzanne was supposed to show her secretary a memo, but in the end she failed to.', 
			 '17b': 'Suzanne was supposed to show her secretary a memo, but in the end she failed.', 
			 '17c': 'Suzanne was supposed to show her secretary a memo, but in the end she failed to show her the memo.',
			 '17d': 'Suzanne was supposed to show her secretary a memo, but in the end she was busy.', 
			 '17e': 'Suzanne was supposed to show a memo to her secretary, but in the end she failed to.', 
			 '17f': 'Suzanne was supposed to show a memo to her secretary, but in the end she failed.',
			 '17g': 'Suzanne was supposed to show a memo to her secretary, but in the end she failed to show the memo to her.', 
			 '17h': 'Suzanne was supposed to show a memo to her secretary, but in the end she was busy.',
			 '20a': 'The tenant needed to mail his landlord a check, but he didn\'t have enough money to.',
			 '20b': 'The tenant needed to mail his landlord a check, but he didn\'t have enough money.', 
			 '20c': 'The tenant needed to mail his landlord a check, but he didn\'t have enough money to mail him a check.', 
			 '20d': 'The tenant needed to mail his landlord a check, but he was broke.', 
			 '20e': 'The tenant needed to mail a check to his landlord, but he didn\'t have enough money to.', 
			 '20f': 'The tenant needed to mail a check to his landlord, but he didn\'t have enough money.', 
			 '20g': 'The tenant needed to mail a check to his landlord, but he didn\'t have enough money to mail a check to him.', 
			 '20h': 'The tenant needed to mail a check to his landlord, but he was broke.',
			 '21a': 'David was supposed to bring the spy a message, but he did not try to.', 
			 '21b': 'David was supposed to bring the spy a message, but he did not try.', 
			 '21c': 'David was supposed to bring the spy a message, but he did not try to bring him anything.',
			 '21d': 'David was supposed to bring the spy a message, but he was asleep.', 
			 '21e': 'David was supposed to bring a message to the spy, but he did not try to.', 
			 '21f': 'David was supposed to bring a message to the spy, but he did not try.',
			 '21g': 'David was supposed to bring a message to the spy, but he did not try to bring anything to him.',
			 '21h': 'David was supposed to bring a message to the spy, but he was asleep.',
			 '22a': 'John\'s parents were asked to pass him the heavy basket, but they were too weak to.', 
			 '22b': 'John\'s parents were asked to pass him the heavy basket, but they were too weak.', 
			 '22c': 'John\'s parents were asked to pass him the heavy basket, but they were too weak to pass him that basket.', 
			 '22d': 'John\'s parents were asked to pass him the heavy basket, but they were not listening.', 
			 '22e': 'John\'s parents were asked to pass the heavy basket to him, but they were too weak to.', 
			 '22f': 'John\'s parents were asked to pass the heavy basket to him, but they were too weak.', 
			 '22g': 'John\'s parents were asked to pass the heavy basket to him, but they were too weak to pass that basket to him.', 
			 '22h': 'John\'s parents were asked to pass the heavy basket to him, but they were not listening.',
			 '24a': 'Tina was going to hand the honoree the award, but she didn\'t have the courage to.', 
			 '24b': 'Tina was going to hand the honoree the award, but she didn\'t have the courage.', 
			 '24c': 'Tina was going to hand the honoree the award, but she didn\'t have the courage to hand him the award in public.', 
			 '24d': 'Tina was going to hand the honoree the award, but she became nervous.', 
			 '24e': 'Tina was going to hand the award to the honoree, but she didn\'t have the courage to.', 
			 '24f': 'Tina was going to hand the award to the honoree, but she didn\'t have the courage.', 
			 '24g': 'Tina was going to hand the award to the honoree, but she didn\'t have the courage to hand the award to him in public.', 
			 '24h': 'Tina was going to hand the award to the honoree, but she became nervous.',
			 '29a': 'Carl did not want to sell the organization the car, so he did not volunteer to.', 
			 '29b': 'Carl did not want to sell the organization the car, so he did not volunteer.', 
			 '29c': 'Carl did not want to sell the organization the car, so he did not volunteer to sell them his car at all.', 
			 '29d': 'Carl did not want to sell the organization the car, so he was ashamed.', 
			 '29e': 'Carl did not want to sell the car to the organization, so he did not volunteer to.', 
			 '29f': 'Carl did not want to sell the car to the organization, so he did not volunteer.', 
			 '29g': 'Carl did not want to sell the car to the organization, so he did not volunteer to sell his car to them at all.', 
			 '29h': 'Carl did not want to sell the car to the organization, so he was ashamed.'
			};