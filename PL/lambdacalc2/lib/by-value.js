// Evaluates lambda calculus expressions
// (using call-by-value stategy)

var parser = require("./lambdacalc/parser");

var us = require("/shared/naps/cs331/underscore/underscore-min");
// var us = require("underscore");

function evaluate (exp) {
    return beta(exp);
}

// Return a list of vars that are free in exp
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
	// otherwise we must rename the fun's param name so as to not capture free var
        return name === exp[1] ? exp :
	    (us.contains(us.uniq(us.flatten(free_in(value))), exp[1]) ?
	     sub(alpha_convert(exp), name, value) :
	     ["LambdaExpr", exp[1], sub(exp[2], name, value)]);
    case 'ApplyExpr':
        // substutute recursively
        return ["ApplyExpr", sub(exp[1], name, value), sub(exp[2], name, value)];
    }
}

// call-by-value
function beta (exp) {
    switch(exp[0]) {
    case 'LambdaExpr':
	return ["LambdaExpr", exp[1], beta(exp[2])];
    case 'ApplyExpr':
        switch (exp[1][0]) {
        case 'LambdaExpr':
	    var temp = sub(exp[1][2], // fun body
                           exp[1][1], // param name
                           beta(exp[2])); // param (evaluated)
            return beta(temp); 
 	case 'VarExpr':
            return ["ApplyExpr", exp[1], beta(exp[2])];
	default:
            // find value of first expression
            return beta(["ApplyExpr", beta(exp[1]), exp[2]]);
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
