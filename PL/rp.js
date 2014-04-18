var flipflop = function(list){
	if(isNull(list)){
		return [];
	} else {
		return cons(cons(car(cdr(car(list))),cons(car(car(list)),[])), flipflop(cdr(list)));
	}
}

var flippyfloppy = function(list){
	return underscore.map(list, function(x) { return cons(car(cdr(x)),cons(car(x),[])); } );
}