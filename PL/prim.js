var existy = function(x) { return x != null; };

var truthy = function(x) { return (x !== false) && existy(x); };

var car = function(list) {             
    if (truthy(underscore.first(list))) {
	return underscore.first(list);
    } else {
	throw new Error("Can't get car");
    }
};                                 

var cdr = function(list) {             
    if (truthy(underscore.rest(list))) {
	return underscore.rest(list);
    } else {
	throw new Error("Can't get cdr");
    }
};                                 

var cons = function(atom, list) {      
    var tmp = underscore.toArray(list); 
    if (truthy(underscore(tmp))) {
	tmp.splice(0, 0, atom);         
	return tmp;
    } else {
	throw new Error("Can't cons onto this argument");
    }
};                                 


var isZero = function(number){
    return number === 0;
};

var isNull = function(list) {
    return underscore.isEmpty(list) || underscore.isNull(list);
};

var isLess = function(o1, o2) {
    if (underscore.isNumber(o1) && underscore.isNumber(o2)) {
	return o1 < o2;
    } else {
	throw new Error("isLess only works on numbers");
    }
};

var isGreater = function(o1, o2) {
    if (underscore.isNumber(o1) && underscore.isNumber(o2)) {
	return o1 > o2;
    } else {
	throw new Error("isGreater only works on numbers");
    }
};

var isEq = function(o1, o2) {
    if (underscore.isNumber(o1) && underscore.isNumber(o2)) {
	return o1 === o2;
    } else {
	throw new Error("isEq only works on numbers");
    }
};

var isAtom = function(n) {
    return underscore.isNumber(n);
}

var isList = function(n) {
    return !(underscore.isNumber(n));
}

var add1 = function(n) {
    if (isAtom(n)) {
	return n + 1;
    } else {
	throw new Error("Can't increment this argument");
    }
}

var sub1 = function(n) {
    if (isAtom(n)) {
	return n - 1;
    } else {
	throw new Error("Can't decrement this argument");
    }
}
