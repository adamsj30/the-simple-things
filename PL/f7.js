var subst = function(n,o,l){
	if(isNull(l)){
		return [];
	} else if(isEq(o, car(l))){
		return cons(n, cons(o,subst(n, o, cdr(l))));
	} else {
		return cons(car(l), subst(n, o, cdr(l)));
	}
}

var split = function(piv, list){
	return split_helper(piv,list,[],[]);
}

var split_helper = function(piv, list, smalls, bigs){
	if(isNull(list)){
		return cons(smalls, [bigs]);
	} else if(isLess(car(list),piv)){
		return split_helper(piv, cdr(list), cons(car(list), smalls), bigs);
	} else {
		return split_helper(piv, cdr(list), smalls, cons(car(list), bigs));
	}
}

var join = function(l1,l2){
	if(isNull(l1)){
		return l2;
	} else {
		return(cons(car(l1), join(cdr(l1),l2)));
	}
}