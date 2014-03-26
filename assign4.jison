/* Simple expressions, allowing JISON to control precedence */
/* lexical grammar */


%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"%"                   return '%'
"="                   return '='
"("                   return '('
")"                   return ')'
[a-zA-Z][a-zA-Z0-9]*  return 'ID'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

%start expressions

%% /* language grammar */

expressions
    : assign EOF
        { return $1; }
    ;

assign
    : exp
        {$$ = $1;}
    | ID '=' assign
        {$$ = ['=', $1, $3];}
    ;
exp
    : term
        {$$ = $1;}
    | exp '+' term
        {$$ = ['+', $1, $3];}
    | exp '-' term
        {$$ = ['-', $1, $3];}
    ;

term
    : power
        {$$ = $1;}
    | power '*' term
        {$$ = ['*', $1, $3];}
    | power '/' term
        {$$ = ['/', $1, $3];}
    | power '%' term
        {$$ = ['%', $1, $3];}
    ;

power
    : factor
        {$$ = $1;}
    | factor '^' power
        {$$ = ['^', $1, $3];}
    ;

factor
    : ID
        {$$ = yytext;}
    | NUMBER
        {$$ = Number(yytext);}
    | '(' exp ')'
        {$$ = $2;}
    ;
