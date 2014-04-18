var make_rn_func = function(x){
	var primed = x;
	//primed = (primed * 9 + 5) % 1024;
	return function(){
		primed = (primed * 9 + 5) % 1024;
		return 'The function seeded with ' + x + ' returns ' + primed;
	};
}

var isPrime = function(num){
	if(num === 1)
		return true;
	else
		return isPrime_helper(num, num - 1);
}

var isPrime_helper = function(num, iter){
	if(iter === 1)
		return true;
	else if((num % iter) === 0)
		return false;
	else
		return isPrime_helper(num, iter - 1);
}

var xeroxPrime = function(l){
	if(isNull(l))
		return [];
	else if(isPrime(car(l)))
		return cons(car(l), cons(car(l), xeroxPrime(cdr(l))));
	else
		return cons(car(l), xeroxPrime(cdr(l)));
}

var xeroxPrime2 = function(l){
	return underscore.reduceRight(l, xeroxPrime2_rr, []);
}

var xeroxPrime2_rr = function(start, num){
	if(isPrime(num))
		return cons(num,cons(num,start));
	else
		return cons(num, start);
}

var evalPoly = function(coef, x){
	return underscore.reduce(cdr(coef), function(r,n){ return r * x + n; }, car(coef));
}

var path = function(n,bst){
	if(underscore.reduce(path_helper(n,bst,[]), function(a, s){ return a + s; }, 0) < 0)
		return n + ' is not in this tree';
	else
		return path_helper(n,bst,[]);
}

var path_helper = function(n,bst,nl){
	if(isNull(bst)){
		return [-55555555];
	} else if(isList(car(bst))){
		return path_helper(n,car(bst),nl);
	} else if(isEq(n,car(bst))){
		return [];
	} else if(isLess(car(bst),n)){
		return cons(1, path_helper(n,cdr(cdr(bst)),nl));
	} else {
		return cons(0, path_helper(n,car(cdr(bst)),nl));
	}
}

var analyze_paths = function(t,f){
    if(analyze_paths_helper(t,f) === 0)
    	return 1;
    else
    	return analyze_paths_helper(t,f);
}

var analyze_paths_helper = function(t,f){
	return underscore.reduce(underscore.map(t,
        function(y){
            return underscore.reduce(path(car(y), cdr(y)), function(x){ return x + 1; }, 0);
        }
    ),f,0);
}

