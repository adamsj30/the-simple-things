// // Problem 1
// var SUBREC = "^f x y.((("+IF+" ("+ISZERO+" y)) x) ((f ("+PRED+" x)) ("+PRED+" y)))";
// var Y_SUB = "("+Y+" "+SUBREC+")";
// //console.log(eval_and_prettify("(("+Y_SUB+" "+FIVE+") "+THREE+")"));

// // Problem 2
// var LE = "^f x y.((("+IF+" ("+ISZERO+" y)) ("+ISZERO+" x)) ((f ("+PRED+" x)) ("+PRED+" y)))";
// var Y_LE = "("+Y+" "+LE+")";
// //console.log(eval_and_prettify("(("+Y_LE+" "+FIVE+") "+THREE+")"));
// //console.log(eval_and_prettify("(("+Y_LE+" "+THREE+") "+FIVE+")"));

// // Problem 3
// var QUOTIENT = "^f x y.((("+IF+" (("+Y_LE+" y) x)) (("+ADD+" "+ONE+") ((f (("+Y_SUB+" y) x)) x))) "+ZERO+")";
// var Y_QUO = "("+Y+" "+QUOTIENT+")";
// //console.log(eval_and_prettify("(("+Y_QUO+" "+THREE+") "+TWO+")"));

// // Problem 4
var Y_in_JS = function (F) {
    return (function (x) {
        return F(function (y) { return (x(x))(y);});
    })
    (function (x) {
        return F(function (y) { return (x(x))(y);});
    }) ;
} ;

var FactGen = function (fact) {
    return (function(n) {
        return ((n == 0) ? 1 : (n*fact(n-1))) ;
    });
} ;

console.log((Y_in_JS(FactGen))(6));

var GCD_gen = function (F){
    return (function (a){
        return (function (b) {
            return ((b === 0) ? a : (F(b)(a % b)));
        });
    });
};

var Fibonacci = function (fib){
    return (function (a){
        return ((a == 1 || a == 0) ? 1 : (fib(a-1) + fib(a-2)));
    });
};

console.log((Y_in_JS(Fibonacci))(5))
console.log(((Y_in_JS(GCD_gen))(21))(7)) ;
//console.log(((Y_in_JS(GCD_gen))(23))(7)) ;

// Problem 5

// lex_depth_expr receives an abstract syntax tree from our lambda
// calculus interpreter and return the corresponding expression in
// lexical address form
// var lex_depth_expr = function (ast){
//     return lex_depth_helper(ast, []);
// };

// var lex_depth_helper = function (ast, var_in_scope) {
//     switch(ast[0]){
//         case "ApplyExpr":
//             return ["ApplyExpr", lex_depth_helper(ast[1], var_in_scope), lex_depth_helper(ast[2], var_in_scope)];
//             break;
//         case "LambdaExpr":
//             var_in_scope = [ast[1]].concat(var_in_scope);
//             return ["LambdaExpr", lex_depth_helper(ast[2], var_in_scope)];
//             break;
//         case "VarExpr":
//             var i = 0;
//             while(i < var_in_scope.length){
//                 if(var_in_scope[i] === ast[1])
//                     break;
//                 i++;
//             }
//             return ["VarWithLexDepth", i];
//             break;
//     }
// };

// var test5 = lex_depth_expr(parser.parse("(((^x y1 z1.((x y1) z1) ^a.a) ^b.b) ^c.c)"));
// require('util').puts(require('util').inspect(test5, false, 20, true));