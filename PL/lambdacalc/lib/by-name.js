// Evaluates lambda calculus expressions
// (using normal-order strategy)

var name = require.resolve('./lambdacalc/parser');
delete require.cache[name];

var parser = require("./lambdacalc/parser");

var us = require("C:/Users/Josh/Desktop/PL/underscore/underscore-min");

function evaluate (exp) {
    return beta(exp, true);
}

function free_in (exp) {
    switch(exp[0]) {
    case 'VarExpr':
	return [exp];
    case 'LambdaExpr':
	return us.reject(free_in(exp[2]),
			 function(x) { return x[1] == exp[1]; }
			);
    case 'ApplyExpr':
	return us.union(free_in(exp[1]), free_in(exp[2]));
    default:
	console.log(exp);
        throw "Invalid expression.";
    }
}

// alpha-convert
// exp is a LambdaExp, replace its param with one that does not occur elsewhere
function alpha_convert (exp) {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var new_letter = exp[1]+alphabet[us.random(0,25)];
    var new_var = ['VarExpr', new_letter ];
    return ['LambdaExpr', new_letter, sub(exp[2], exp[1], new_var) ]; 
}

// substitute
function sub (exp, name, value) {
    switch(exp[0]) {
    case 'VarExpr':
        return name === exp[1] ? value : exp;
    case 'LambdaExpr':
        // only reduce if var is not bound by fun's param name
	// otherwise we must rename the fun's param name so as to not capture free
        return name === exp[1] ? exp :
	    (us.contains(us.uniq(us.flatten(free_in(value))), exp[1]) ?
	     sub(alpha_convert(exp), name, value) :
	     ["LambdaExpr", exp[1], sub(exp[2], name, value)]);
    case 'ApplyExpr':
        return ["ApplyExpr", sub(exp[1], name, value), sub(exp[2], name, value)];
    }
}

// call-by-name
function beta (exp, reduce_abstractions) {
    switch(exp[0]) {
    case 'LambdaExpr':
	return reduce_abstractions ? ["LambdaExpr", exp[1], beta(exp[2],true)] : exp;
    case 'ApplyExpr':
	var test = beta(exp[1],false);
        switch (test[0]) {
        case 'LambdaExpr':
	    var temp = sub(test[2], // fun body
                           test[1], // param name
                           exp[2]); // param (unevaluated)
            return beta(temp, reduce_abstractions); 
 	case 'VarExpr':
            return ["ApplyExpr", beta(exp[1],true), beta(exp[2],true)];

	default:
            return ["ApplyExpr", exp[1], beta(exp[2],true) ];
        }
    case 'VarExpr':
	return exp;
    default:
	console.log(exp);
        throw "Invalid expression.";
    }
}

function prettyPrint (ast) {
    switch (ast[0]) {
    case 'VarExpr':
        return ast[1];
    case 'LambdaExpr':
        return '^'+ast[1]+'.'+prettyPrint(ast[2]);
    case 'ApplyExpr':
        return '('+prettyPrint(ast[1])+' '+prettyPrint(ast[2])+')';
    }
}

// evluates and returns string representation of result
function eval_and_prettify (str) {
    str = str.replace(/^\s+|\s+$/g, '');
    return prettyPrint(evaluate(parser.parse(str)));
};

// returns AST
function parse_and_prettify (str) {
    str = str.replace(/^\s+|\s+$/g, '');
    return require('util').puts(require('util').inspect(parser.parse(str), false ,20, true));
};
