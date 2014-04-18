(*-----------INTEGER BASIC TYPE-------------*)
    10;
    10 - 5;
    1 + 2 * 3;
    10 + ~5;   (* "~" is used for negation *)
    120 div 6; (* Integer division *)
    13 mod 3;
    abs(~3);
    (*----------------------------------------*)


    (*-----------REAL BASIC TYPE-----------*)
    3.14;
    3.14 * 2.0;
    12.0 / 4.3;
    10 * 0.5;
    (*----------------------------------------*)

    (*---------BOOL BASIC TYPE------------*)
    true;
    false;
    7 = 3;
    (5 >= 2) orelse (6 <= 7);
    (2 = 3) andalso (3 < 5 div 0);
    not (2 = 2);
    (*----------------------------------------*)

    (*---------BASIC TYPE STRING------------*)
    "hello";
    "aardvark" < "zebra";
    size "aardvark";
    "aardvark" ^ "zebra";
    (*----------------------------------------*)

(* TUPLES *)
    (*----------------------------------------*)
    (3,"three",3.0);
    (1<2, "one is less than two");
    ((1,2),"nested tuples");
    (*----------------------------------------*)

(* FUNCTIONS *)
    (*-----------------------------------------*)
    fun increment x = x + 1;
    (*----------------------------------------*)


    (*----------------------------------------*)
    increment 2;
    (*----------------------------------------*)

    (*----------------------------------------*)
    fun square x = x * x;
    (*----------------------------------------*)

    (*----------------------------------------*)
    fun isEven n = if (n mod 2) = 0 then
                       true
                   else
                       false;
    (*----------------------------------------*)


    (*----------------------------------------*)
    isEven 10;
    isEven 11;
    isEven;
    (*----------------------------------------*)

    (*----------------------------------------*)
    fun broken n = if n = 0 then
                       true   
                   else
                       "doomed"; 
    (*----------------------------------------*)


(* LISTS *)

    (*----------------------------------------*)
    nil;
    [];
    (*----------------------------------------*)

    (*----------------------------------------*)
    [1,2,3];
    ["this", "is", "a", "list", "of", "strings"];
    [[1,2], [], [3,4,5]];
    [(1.0,"one"), (2.0, "two"), (3.0, "three")];
    (*----------------------------------------*)

    (*----------------------------------------*)
    [1,2,3,"oops -- not an integer",4,5];
    [[1,2],3,[4,5]];
    (*----------------------------------------*)

    (*----------------------------------------*)
    1::[2,3,4];
    (*----------------------------------------*)

    (*----------------------------------------*)
    "wow"::[];
    (*----------------------------------------*)

    (*----------------------------------------*)
    [1,2,3]:: ??? ;
    (*----------------------------------------*)


    (*----------------------------------------*)
    [(1,1),(2,2)]::[ [(3,3),(4,4)], [(5,5)] ];
    (*----------------------------------------*)

    (*----------------------------------------*)
    [1,2]::[3,4];
    (*----------------------------------------*)

    (*----------------------------------------*)
    [1,2]@[3,4];
    (*----------------------------------------*)

    (*----------------------------------------*)
    val theList = ["first", "second", "third"];
    hd;
    hd theList;
    (*----------------------------------------*)
    (*----------------------------------------*)
    tl;
    tl theList;
    (*----------------------------------------*)
    (*----------------------------------------*)
    hd [];
    tl [];
    (*----------------------------------------*)

    (*----------------------------------------*)
    fun sum aList = if aList = [] then
                        0
                    else
                        hd aList + sum (tl aList);
    (*----------------------------------------*)
    (*----------------------------------------*)
    sum [];
    sum [10,20,30];
    sum [2,46,18,21,9,0,~12];
    (*----------------------------------------*)


    (*---------***** PARAMETERS *****----------*)
    (* Two function that caclulate x raised to the y power.  What's
    the difference between them?  Hint: All ML functions are functions
    of one argument! *)
    
    (*----------------------------------------*)
    fun power2 (x,y) = if y = 0 then
                       1
                    else
                       x * power2(x,y-1);
    (*----------------------------------------*)


    fun power1 x y = if y = 0 then
			1
		    else
			x * (power1 x (y-1));
    (*----------------------------------------*)

    (*----------------------------------------*)
    power1;
    power1 2 3;
    power1 2;
    val two_to_the = it;
    two_to_the;
    two_to_the 3;
    two_to_the 4;
    (*----------------------------------------*)


    fun sum [] = 0
      | sum aList = hd aList + sum (tl aList);


    fun sum [] = 0
      | sum (x::xs) = x + sum xs;

    fun roots (a,b,c) =
        ( (~b + Real.Math.sqrt(b*b - 4.0*a*c))/(2.0*a),
          (~b - Real.Math.sqrt(b*b - 4.0*a*c))/(2.0*a));


    (*----------------------------------------*)

    fun roots (a,b,c) = 
    let
        val rad = Real.Math.sqrt(b*b - 4.0*a*c)
        val den = 2.0 * a
    in
        ( (~b+rad)/den, (~b-rad)/den )
    end;


(* NAMELESS FUNCTIONS *)
    fun member x nil = false
      | member x (h::t) = x=h orelse member x t;

    fun censor badwords aList =
        map (fn x => if (member x badwords) then "%*&^#!" else x)
            aList;
    (*----------------------------------------*)
    censor ["Vikings", "Bears"]
            ["Giants", "Vikings", "Bears", "Lions"];

(*fn is actually a function-building expression.  Because of it, 
  fun as we've been using it is really syntactic sugar.*)

    (*----------------------------------------*)
    fun censor_word1 (badwords, x) =
        if (member x badwords) then
            "%*&^#!"
        else
            x;
    (*----------------------------------------*)
    val censor_word2 = fn (badwords, x) =>
        if (member x badwords) then
            "%*&^#!"
        else
            x;
    (*----------------------------------------*)

(*So why won't this work in ML when it did in JavaScript?*)

    val factorial = fn 0 => 1 
                    | n => n * factorial (n-1);
