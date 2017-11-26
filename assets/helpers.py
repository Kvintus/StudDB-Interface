import icu
from operator import itemgetter

def sortIt(arrayToSort, key):
    """ Sorts an array """

    collator = icu.Collator.createInstance(icu.Locale('sk_SK.UTF-8'))

    #Using if beacause you cannot pass an argument into the funtion 
    if key == 'id':
        return arrayToSort.sort(key=itemgetter('id'))
    elif key == 'name':
        return arrayToSort.sort(key=lambda x: collator.getSortKey(x['name']))
    elif key == 'surname':
        return arrayToSort.sort(key=lambda x: collator.getSortKey(x['surname']))
    else:
        return -1
