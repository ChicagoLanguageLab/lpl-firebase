import urllib

f = open('/Users/Ookami/Documents/_docs/Work/Ming/Adjective Task/Images/imagelinks.txt', 'r')
for line in f.readlines():
	beg = line.find('http')
	end = line.find('jpg') + 3
	if(beg >= 0 and end >= 0):
		url = line[beg:end]
		name_start = url.find('images/') + 7;
		name = url[name_start:]
		urllib.urlretrieve(url, name)
f.close()