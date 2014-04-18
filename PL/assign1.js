
var duple = function(n,x){
	if(isEq(n,1)){
		return cons(x,[]);
	} else {
		return cons(x,duple(sub1(n),x));
	}
}

var reverse = function(list){
	return reverse_helper(list,[]);
}

var reverse_helper = function(list,newlist){
	if(isNull(list)){
		return newlist;
	} else {
		return reverse_helper(cdr(list),cons(car(list),newlist));
	}
}

var flatten = function(list){
	return flatten_helper(list,[]);
}

var flatten_helper = function(list,newlist){
	if(isNull(list)){
		return newlist;
	} else if(isList(car(list))){
		return flatten_helper(flatten_helper(car(list),newlist),flatten_helper(cdr(list),newlist));
	} else {
		return cons(car(list),flatten_helper(cdr(list),newlist));
	}
}

var down = function(l){
	if(isNull(l)){
		return [];
	} else if(isList(car(l))){
		return cons(cons(car(l),[]),down(cdr(l)));
	} else {
		return cons(cons(car(l),[]),down(cdr(l)));
	}
}


///////////////////////////////////////
var up = function(l){
    return up_helper(l,[]);
}

var up_helper = function(l,nl){
    if(isNull(l)){
        return nl;
    } else if(isList(car(l))){
        return cons(up_helper(car(l),nl),up_helper(cdr(l),nl));
    } else {
        return cons(car(l),up_helper(cdr(l),nl));
    }
}
/////////////////////////////////////////
var tree_test = [14, [7, [], [12, [], []]],
[26, [20, [17, [], []],
[] ],
[31, [], []]]];

var path = function(n,bst){
	return path_helper(n,bst,[]);
}

var path_helper = function(n,bst,nl){
	if(isNull(bst)){
		return ['number not in list'];
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

//require("util").inspect(up([[1,2],[3,4]]), false, 10)
//require("util").inspect(up([[1,[2]],3]), false, 10)
//require("util").inspect(down([1, [2, [3]],4]), false, 10)