(*-------------1-------------*)

datatype 'ingredient pizza =
    Bottom
    | Topping of ('ingredient * ('ingredient pizza));

datatype fish =
    Anchovy
    | Shark
    | Tuna;

val my_pizza = Topping(Tuna, Topping(Shark, Topping(Anchovy, Bottom)));

fun rem_ingredient top Bottom = Bottom
	| rem_ingredient top (Topping(pt,zza)) = if top = pt then rem_ingredient top zza else Topping(pt, rem_ingredient top zza);

(*-------------2-------------*)

datatype tagged =
	Int of int
	| Real of real
	| Bool of bool
	| String of string;

exception RunTimeTypeError;

fun dynamic_checked_add (x,y) = 
	case x of
		Int x => 
			(case y of
				Int y => Int (x + y)
				| Real y => raise RunTimeTypeError
				| Bool y => raise RunTimeTypeError
				| String y => raise RunTimeTypeError)
		| Real x => 
			(case y of
				Int y => raise RunTimeTypeError
				| Real y => Real (x + y)
				| Bool y => raise RunTimeTypeError
				| String y => raise RunTimeTypeError)
		| Bool x => raise RunTimeTypeError
		| String x => raise RunTimeTypeError;
		
fun dynamic_checked_and (x,y) =
	case x of
		Int x => raise RunTimeTypeError
		| Real x => raise RunTimeTypeError
		| Bool x =>
			(case y of
				Int y => raise RunTimeTypeError
				| Real y => raise RunTimeTypeError
				| Bool y => Bool (x andalso y)
				| String y => raise RunTimeTypeError)
		| String x => raise RunTimeTypeError;

fun dynamic_checked_concatenate (x,y) =
	case x of
		Int x => raise RunTimeTypeError
		| Real x => raise RunTimeTypeError
		| Bool x => raise RunTimeTypeError
		| String x =>
			(case y of
				Int y => raise RunTimeTypeError
				| Real y => raise RunTimeTypeError
				| Bool y => raise RunTimeTypeError
				| String y => String (x ^ y));

(*-------------3-------------*)

(*fun power_set_helper (a, []) = a::[]
	| power_set_helper (a, x::lst) = (a::x)::power_set_helper (a, lst);*)

(*-------------4-------------*)
(*-------------5-------------*)

datatype FORMULA =
	ATOMIC of string
	| AND of FORMULA * FORMULA
	| OR of FORMULA * FORMULA
	| NOT of FORMULA;

fun eval (ATOMIC x, y) = if List.exists (fn t => x = t) y then (2 = 2) else (2 = 3)
	| eval (AND (x, z), y) = eval(x,y) andalso eval(z,y)
	| eval (OR (x,z), y) = eval(x,y) orelse eval(z,y)
	| eval (NOT x, y) = not(eval(x,y));

(*-------------6-------------*)