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
        if(a === 0)
            return 0;
        else
            return ((a === 1 || a === 2) ? 1 : (fib(a-1) + fib(a-2)));
    });
};

console.log((Y_in_JS(Fibonacci))(14))