assert = require("assert");
assert.strictEqual(eval_and_prettify("(((^x y1 z1.(y1 z1) ^a.a) ^b.b) ^c.c)"),"^c.c","Simple reduction");


// Logical values
var T = "^x y.x";
var F = "^x y.y";
var AND = "^a b.((a b) "+F+")";
var IF = "^p x y.((p x) y)";
var OR = "^p q.((("+IF+" p) "+T+") q)"; 

assert.ok (eval_and_prettify( '(('+AND+' '+T+') '+T+')' ) == eval_and_prettify(T), "AND 2 trues");

assert.ok (eval_and_prettify('(('+AND+' '+T+') '+F+')') == eval_and_prettify(F), "AND T and F");

assert.ok (eval_and_prettify('(('+OR+' '+T+') '+F+')') == eval_and_prettify(T), "OR T and F");

assert.ok (eval_and_prettify('((('+IF+' '+T+') '+"foo"+') '+"bar"+')') === "foo", "IF for TRUE");

assert.ok (eval_and_prettify('((('+IF+' '+F+') '+"foo"+') '+"bar"+')') === "bar", "IF for TRUE");

// Pairs (that is, 2-tuples)
var PAIR = "^x y f.((f x) y)";
var FIRST = "^p.(p "+T+")";
var SECOND = "^p.(p "+F+")";

assert.ok (eval_and_prettify('('+FIRST+' (('+PAIR+' foo) bar))') === "foo", "Testing FIRST OF PAIR");

assert.ok (eval_and_prettify('('+SECOND+' (('+PAIR+' foo) bar))') === "bar", "Testing SECOND OF PAIR");


// Numerical values

var SUCC = "^n f x.(f ((n f) x))";
var ISZERO = "^n.((n ^x."+F+") "+T+")";
var ZERO = "^f x.x";
var ONE = "^f x.(f x)";
var TWO = "^f x.(f (f x))";
var THREE = "^f x.(f (f (f x)))";
var FOUR = "^f x.(f (f (f (f x))))";
var FIVE = "^f x.(f (f (f (f (f x)))))";
var SIX = "^f x.(f (f (f (f (f (f x))))))";
var SEVEN = "^f x.(f (f (f (f (f (f (f x)))))))";
var EIGHT = "^f x.(f (f (f (f (f (f (f (f x))))))))";
var ADD = "^n m f x.((n f) ((m f) x))";
var MULT = "^n m f x.((n (m f)) x)";
var EXPT = "^n m f x.(((m n) f) x)";

var PREF = "^f p.(("+PAIR+" (f ("+FIRST+" p))) ("+FIRST+" p))";
var PRED = "^n f x.("+SECOND+" ((n ("+PREF+" f)) (("+PAIR+" x) x)))";
var SUB = "^m n.((n "+PRED+") m)"; 

assert.ok (eval_and_prettify('(' + ISZERO + ' ' + ZERO + ')') === eval_and_prettify(T), "Is ZERO ZERO?");

assert.ok (eval_and_prettify('(' + ISZERO + ' ' + ONE + ')') === eval_and_prettify(F), "Is ONE ZERO?");

assert.ok (eval_and_prettify('(' + ISZERO + ' ('+PRED+' ' + ONE+')' + ')') === eval_and_prettify(T), "Is ZERO the PRED of ONE?");


assert.ok (eval_and_prettify('(' + SUCC + ' ' + ONE +')') === eval_and_prettify(TWO), "SUCC 1 is 2");

assert.ok (eval_and_prettify('(' + SUCC + ' ' + TWO +')') === eval_and_prettify(THREE), "SUCC 2 is 3");

assert.ok (eval_and_prettify('(' + SUCC + ' ' + FOUR +')') === eval_and_prettify(FIVE), "SUCC 4 is 5");

assert.ok (eval_and_prettify('(' + PRED + ' ' + FOUR +')') === eval_and_prettify(THREE), "PRED 4 is 3");

assert.ok (eval_and_prettify('((' + ADD + ' ' + TWO + ') ' + THREE + ')') === eval_and_prettify(FIVE), "Testing 2 + 3" );

assert.ok (eval_and_prettify('((' + MULT + ' ' + TWO + ') ' + THREE + ')') === eval_and_prettify(SIX), "Testing 2 * 3" );

assert.ok (eval_and_prettify('((' + EXPT + ' ' + TWO + ') ' + THREE + ')') === eval_and_prettify(EIGHT), "Testing 2 ^ 3" );

console.log(eval_and_prettify('((' + SUB + ' ' + FIVE + ') ' + THREE + ')'));

//assert.ok (test_sub === eval_and_prettify(TWO), "Testing 5 - 3 may fail because of alpha-conversion.   The two expressions evaluate to \n     " + test_sub + " \n     "  + eval_and_prettify(TWO) );

// Y combinator
var Y = "^h.(^x.(h (x x)) ^x.(h (x x)))";

// var ADDREC = "^f x y.((("+IF+" ("+ISZERO+" x)) y) ((f ("+PRED+" x)) ("+SUCC+" y)))";
// var test_addrec = "((("+Y+" "+ADDREC+") "+TWO+") "+THREE+")";


// var eval_test_addrec = eval_and_prettify(test_addrec);
// assert.ok (eval_test_addrec === eval_and_prettify(FIVE), "Testing recursive addition of 2 + 3, which evals to " + eval_test_addrec);

// var FACT = "^f x.((("+IF+" ("+ISZERO+" x)) "+ONE+") (("+MULT+" x) (f ("+PRED+" x))))";
// var test_fact = "(("+Y+" "+FACT+") "+THREE+")";
// var eval_test_fact = eval_and_prettify(test_fact);
// assert.ok (eval_test_fact === eval_and_prettify(SIX), "Testing recursive factorial of 3, which evals to " + eval_test_fact);

