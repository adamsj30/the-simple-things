// Provide a parameter-less generator function that can be called to
// compute the ith member of the sequence
function Sequence(generator) {
    this.thunk = generator;
    this.mapper = function (x) { return x; };
    this.origionalThunk = generator;
    this.filterer = function (x) { return true; };

    var a = [];

    // Call when we want the first n in the sequence
    this.take = function (n) {
        for (i = a.length; a.length <= n; i++) {
            var temp = this.mapper(this.thunk());
            if(this.filterer(temp))
                a.push(temp);
        }
        this.thunk = generator;
        return a.slice(0,n);
    };

    // Problem 1
    this.map = function (n) {
        this.mapper = n;
        return this;
    };

    //Problem 3 (Filter function)
    this.filter = function(n){
        this.filterer = n;
        a = [];
        return this;
    };
};

a = new Sequence( function() { return Math.random(); } );

ints_from1 = function() {
    var x = 1;
    return function() {
    	var temp = x;
    	x = x + 1;
    	return temp;
    };
};

ints_from = function(start) {
    return function() {
        var s = start;
        return function() {
            var temp = s;
            s = s + 1;
            return temp;
        };
    };
};

// Problem 6
interleave = function(seq1, seq2){
    seq = function(){
        var length = 0;
        return function(){
            if(length % 2 === 0){
                length++;
                return seq1.thunk();
            } else {
                length++;
                return seq2.thunk();
            }
        }
    };
    return new Sequence(seq()); 
};

// Problem 4
iterates_from = function(start, f){
    return function() {
        var x = start;
        return function() {
            var old = x;
            x = f(x);
            return old;
        };
    };
};

// Problem 5
hailstone5 = new Sequence( iterates_from(5, function (x) { if(x % 2 === 0){ return x / 2; } else{ return (3*x)+ 1; } } )() );
hailstone11 = new Sequence( iterates_from(11, function (x) { if(x % 2 === 0){ return x / 2; } else{ return (3*x)+ 1; } } )() );

fib = function() {
    var x = 1;
    var y = 1;
    return function() {
    	var prev = x;
    	x = y;
    	y += prev;
    	return prev;
    };
};

b = new Sequence( fib() );
//c = b.map(function (x) {return x + 1;});

x = new Sequence( ints_from1() );


z = new Sequence( (ints_from(5))() );
