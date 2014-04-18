var car = function(list) {             
    return list[0];                 
};                                 
var cdr = function(list) {             
    return underscore.rest(list);
};                                 
var cons = function(atom, list) {      
    var tmp = underscore.toArray(list); 
    tmp.splice(0, 0, atom);         
    return tmp;		     
};                                 


var isZero = function(number){
    return number === 0;
};
var isNull = function(list) {
    return underscore.isEmpty(list) || underscore.isNull(list);
};

var isEq = function(o1, o2) {
    return o1 === o2;	       // The true scheme eq only works on atoms
//    return underscore.isEqual(o1,o2);
};

