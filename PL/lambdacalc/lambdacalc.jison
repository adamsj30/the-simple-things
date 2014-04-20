%lex
%%
\s*\n\s*  {/* ignore */}
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return 'MUL'
"/"                   return 'QUO'
"-"                   return 'SUB'
"+"                   return 'ADD'
"%"                   return 'MOD'
"pow"                 return 'POW'
"let"                 return 'LET'
"in"                  return 'IN'
"="                   return 'EQ'
"?"                   return 'IF'
"letrec"              return "LETREC"
"("       { return '('; }
")"       { return ')'; }
"^"|"λ"   { return 'LAMBDA'; }
"."\s?    { return '.'; }
[a-zA-Z][a-zA-Z0-9]*  { return 'VAR'; }
\s+       { return 'SEP'; }
<<EOF>>   { return 'EOF'; }

/lex

/* operator associations and precedence */

%right LAMBDA
%left SEP

%start file

%%

file
  : expr EOF
    { return $expr; }
  ;

expr
  : LAMBDA var_list '.' expr
    %{
      var temp = ["LambdaExpr", $var_list.shift(), $expr];
      $var_list.forEach(function (v) {
        temp = ["LambdaExpr", v, temp];
      });
      $$ = temp;
    %}
  | '(' expr SEP expr ')'
    { $$ = ["ApplyExpr", $expr1, $expr2]; }
  | var
    { $$ = ["VarExpr", $var]; }
  | '(' ADD SEP expr SEP expr ')'
        {$$ = ["AddPrim", $expr1, $expr2];}
  | '(' SUB SEP expr SEP expr ')'
        {$$ = ["SubPrim", $expr1, $expr2];}
  | '(' QUO SEP expr SEP expr ')'
        {$$ = ["QuoPrim", $expr1, $expr2];}
  | '(' MUL SEP expr SEP expr ')'
        {$$ = ["MultPrim", $expr1, $expr2];}
  | '(' MOD SEP expr SEP expr ')'
        {$$ = ["ModPrim", $expr1, $expr2];}
  | '(' POW SEP expr SEP expr ')'
        {$$ = ["PowPrim", $expr1, $expr2];}
  | '(' IF SEP expr SEP expr SEP expr ')'
        {$$ = ["IfPrim", $expr1, $expr2, $expr3];}
  | '(' LET SEP var SEP EQ SEP expr SEP IN SEP expr ')'
        {$$ = ["ApplyExpr", ["LambdaExpr", $var, $expr2], $expr1];}
  | '(' LETREC SEP var SEP EQ SEP expr SEP IN SEP expr ')'
        {$$ = ["ApplyExpr", ["LambdaExpr", $var, $expr2], $expr1];}
  | NUMBER
        {$$ = ["NumberConst", Number(yytext)];}
  ;

var_list
  : var_list SEP var
    { $$ = $var_list; $$.unshift($var); }
  | var
    { $$ = [$var]; }
  ;

var
  : VAR
    { $$ = yytext; }
  ;
