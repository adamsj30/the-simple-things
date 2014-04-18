%%
\s*\n\s*  {/* ignore */}
"("       { return '('; }
")"       { return ')'; }
"^"|"λ"   { return 'LAMBDA'; }
"."\s?    { return '.'; }
[a-zA-Z][a-zA-Z0-9]*  { return 'VAR'; }
\s+       { return 'SEP'; }
<<EOF>>   { return 'EOF'; }
