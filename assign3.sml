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

fun dynamic_checked_add (Int(x),Int(y)) = Int(x+y)
	| dynamic_checked_add (Real(x), Real(y)) = Real(x+y)
	| dynamic_checked_add (_,_) = raise RunTimeTypeError;

fun dynamic_checked_and (Bool(x),Bool(y)) = Bool(x andalso y)
	| dynamic_checked_and (_,_) = raise RunTimeTypeError;

fun dynamic_checked_concatenate (String(x), String(y)) = String(x ^ y)
	| dynamic_checked_concatenate (_,_) = raise RunTimeTypeError;

(*-------------3-------------*)

fun power_set_helper (a, nil) = nil
	| power_set_helper (a, x::lst) = (a::x)::power_set_helper(a,lst);

(*-------------4-------------*)

fun power_set nil = [nil]
	| power_set (x::lst) = (power_set lst)@power_set_helper(x,power_set lst);

(*-------------5-------------*)

datatype FORMULA =
	ATOMIC of string
	| AND of FORMULA * FORMULA
	| OR of FORMULA * FORMULA
	| NOT of FORMULA;

fun eval (ATOMIC x, y) = if List.exists (fn t => x = t) y then true else false
	| eval (AND (x, z), y) = eval(x,y) andalso eval(z,y)
	| eval (OR (x,z), y) = eval(x,y) orelse eval(z,y)
	| eval (NOT x, y) = not(eval(x,y));

(*-------------6-------------*)

fun check_formula form =
	let
		val choices = power_set 
	in
		body
	end