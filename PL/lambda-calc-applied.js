// Evaluates applied lambda calculus expressions
// on the SECD machine

// Note -- the next two lines should insure that the parser is
// uncached each time you load this file
var name = require.resolve('./lambdacalc/lambdacalc');
delete require.cache[name];

var parser = require("./lambdacalc/lambdacalc");

//var us = require("underscore");

// Some test runs

// evaluate(parser.parse("((^x y.(+ x y) 3) 4)"))
// evaluate(parser.parse("((^x y.(- x y) 3) 4)"))

// Display these two vars after call to evaluate to see compiled code
// and run log
var compiled_code;
var run_log = [];

function evaluate (exp) {
    var ast = lex_depth_expr(exp); // Parsed AST converted to lexical address form
    var code = compile_secd(ast);
    compiled_code =  print_compile(code);
    return run_secd(code);
}

///////////////////// SECD Compiler /////////////////////////////

// A constant to represent each operation we will see on the front of
// the control
var SECD_LDC=0, SECD_LV=1, SECD_LDF=2, SECD_ADD=3, SECD_AP=4, SECD_RET=5, SECD_MUL=6, SECD_SUB=7, SECD_QUO=8; SECD_MOD=9; SECD_POW=10; SECD_IF=11;

function compile_secd(ast){
    var c = [];
    switch(ast[0]){
        
    case 'NumberConst': 
        c.push(ast[1]); 
        c.push(SECD_LDC); 
        break;
        
    case 'AddPrim': 
        c.push(SECD_ADD);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        break;
        
    case 'SubPrim': 
        c.push(SECD_SUB);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        break;
        
    case 'MultPrim': 
        c.push(SECD_MUL);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        break;
        
    case 'QuoPrim': 
        c.push(SECD_QUO);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        break;

    case 'ModPrim': 
        c.push(SECD_MOD);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        break;

    case 'PowPrim': 
        c.push(SECD_POW);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        break;

    case 'IfPrim': 
        c.push(SECD_IF);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        c = c.concat(compile_secd(ast[3]));
        break;
        
    case 'LambdaExpr':
        c.push( [SECD_RET].concat( compile_secd(ast[1]) ) );
        c.push(SECD_LDF);
        break;

    case 'ApplyExpr':
        c.push(SECD_AP);
        c = c.concat(compile_secd(ast[1]));
        c = c.concat(compile_secd(ast[2]));
        break;
        
    case 'VarWithLexDepth':
        c.push( ast[1] );
        c.push(SECD_LV);
        break;
        
    }    
    return c;
}

// To pretty-print the compiled code
function print_compile(c){
    var str ="";
    for(var i=c.length-1;i>=0;--i){
        switch( c[i] ){

        case SECD_LDC:
            str = str + "(LDC::"+c[--i]+")";
            break;

        case SECD_ADD:
            str = str + "ADD";
            break;

        case SECD_MUL:
            str = str + "MUL";
            break;

        case SECD_SUB:
            str = str + "SUB";
            break;

        case SECD_QUO:
            str = str + "QUO";
            break;

        case SECD_MOD:
            str = str + "MOD";
            break;

        case SECD_POW:
            str = str + "POW";
            break;

        case SECD_IF:
            str = str + "IF";
            break;

        case SECD_LV:
            str = str + "(LV::"+c[--i]+")";
            break;

        case SECD_LDF:
            str = str + "LDF::["+print_compile( c[--i] )+"]";
            break;

        case SECD_AP:
            str = str + "AP";
            break;
            
        case SECD_RET:
            str = str + "RET";
            break;
        }
        if( (i-1)>=0 )
            str = str + "::";
    }
    return str;
}


function print_stack(s){
    var str = "";
    for( var i = s.length - 1;i >= 0; --i){
        if( i !== s.length - 1 )
            str +=",";
        
        if( typeof(s[i]) != "object" )
            str += s[i];
        else
            str += "["+print_compile(s[i].c)+" "+s[i].e+"]";
    }

    return str;
}

function print_env(s){
    var str = "";
    for( var i=0;i<s.length; ++i){
        if( i !== 0 )
            str +=",";
        
        if( typeof(s[i]) != "object" )
            str += s[i];
        else
            str += "["+print_compile(s[i].c)+" "+s[i].e+"]";
    }
    return str;
}

function print_dump(s){
    var str = "";
    for( var i = s.length - 1;i >= 0; --i){
        if( i !== s.length - 1 )
            str +=",";

        var d = s[i];
        str += "[s: "+ print_stack(d.s) +", e: "+print_env(d.e)+", c: "+print_compile(d.c)+"]";
    }
    return str;
}

/////////////////////////////////////////////////////////////////

////////////////////////  Execute the SECD code /////////////////


function run_secd(code) {

    run_log = [ { s : "top -> bottom",
                  e : "index 0 -> last index",
                  c : "first instr -> last",
                  d : "top -> bottom" } ];
    var s = [];
    var e = [];
    var c = code;
    var d = [];
    
    while( c.length !== 0 ){
        
        // In the run log display the state of the machine in JSON format
        run_log.push( { s : print_stack(s) , 
                        e : print_env(e) , 
                        c : print_compile(c) , 
                        d : print_dump(d) } );
        
        switch( c.pop() ){

        case SECD_LDC:
            s.push( c.pop() );
            break;

        case SECD_ADD:
            s.push( s.pop() + s.pop() );
            break;

        case SECD_SUB:
            s.push( s.pop() - s.pop() );
            break;

        case SECD_MUL:
            s.push( s.pop() * s.pop() );
            break;

        case SECD_QUO:
            s.push( s.pop() / s.pop() );
            break;

        case SECD_MOD:
            s.push( s.pop() % s.pop() );
            break;

        case SECD_POW:
            s.push( Math.pow(s.pop(),s.pop()) );
            break;

        case SECD_IF:
            if(s.pop() > 0){
                var v = s.pop();
            } else {
                s.pop();
                var v = s.pop();
            }
            s.push(v);
            break;

        case SECD_LV:
            s.push( e[c.pop()] ); // Lexical address on the control indexes into the environment
            break;

        case SECD_LDF:
            s.push( { e : e.slice() , c : c.pop() } ); // Closure with environment e and function code
            // from control.  slice is used to create a copy 
            // of the environment instead of a reference to it
            break;

        case SECD_AP:
            var tmp_fun = s.pop();
            var v_arg = s.pop();
            d.push( { s : s , e : e , c : c } ); // Push current s, e, c to the dump
            s = [];
            e = tmp_fun.e;      // Access the environment in the closure
            e.unshift( v_arg ); // Add the value of the function's arg to the first index of that environment
            c = tmp_fun.c;      // The function definition in the closure becomes the control
            break;
            
        case SECD_RET:
            var v = s.pop();
            var tmp = d.pop();
            s = tmp.s;
            s.push(v);
            e = tmp.e;
            c = tmp.c;
            break;
        }
    }
    
    run_log.push( { s : print_stack(s) , 
                    e : print_env(e) , 
                    c : print_compile(c) , 
                    d : print_dump(d) } );

    
    return s.pop();
}




////////////////////////////////////////////////////////////////


////////////////// Convert to lexical address form //////////////

function lex_depth_expr(ast) {
    var vars = [];
    return lex_aux(ast, vars);
}

function lex_aux(ast, vars_in_scope) {
    switch(ast[0]) {
    case 'VarExpr':
        return ['VarWithLexDepth', vars_in_scope.indexOf(ast[1])];
    case 'LambdaExpr':  
        var temp = ['LambdaExpr', lex_aux(ast[2], [ast[1]].concat(vars_in_scope))];
        return temp;
    case 'ApplyExpr':
        return ['ApplyExpr', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope)];
    case 'AddPrim':
        return ['AddPrim', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope)];
    case 'SubPrim':
        return ['SubPrim', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope)];
    case 'MultPrim':
        return ['MultPrim', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope)];
    case 'QuoPrim':
        return ['QuoPrim', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope)];
    case 'ModPrim':
        return ['ModPrim', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope)];
    case 'PowPrim':
        return ['PowPrim', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope)];
    case 'IfPrim':
        return ['IfPrim', lex_aux(ast[1], vars_in_scope), lex_aux(ast[2], vars_in_scope), lex_aux(ast[3], vars_in_scope)];
    case 'NumberConst':
        return ['NumberConst', ast[1]];
    default:
        console.log(exp);
        throw "Invalid expression.";
    }
}

///////////////////////////////////////////////////////////////////

////////////////// Additional Utilities //////////////////////////

// Display a JS nested array structure in tree-like fashion
function prettify_general (str){
    return require('util').puts(require('util').inspect(str, false ,20, true));
}
