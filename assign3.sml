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

fun check_formula patt =
	let
		(*pulls variables out of the statement*)
		fun expand (ATOMIC x, y) = if not(List.exists (fn t => x = t) y) then x::y else y
					| expand (AND (x, z), y) = expand(x,y)@expand(z,y)
					| expand (OR (x,z), y) = expand(x,y)@expand(z,y)
					| expand (NOT x, y) = expand(x,y)@y;
		(*removes all occurences of g from list*)
		fun delete g nil = nil
			| delete g (t::q) = if g = t then delete g q else t::(delete g q);
		(*removes duplicates in a list*)
		fun remDups nil = nil
			| remDups (a::b) = (a::(remDups(delete a b)));
		(*evaluates each of the expanded list*)
		fun checkAll (nil, x, y) = 
				if x = 0 andalso not(y = 0)
					then "contradiction"
				else
					if not(x = 0) andalso y = 0
						then "tautology"
					else "neither"
			| checkAll (n::ns, x, y) = if eval(patt, n) then checkAll(ns, x + 1, y) else checkAll(ns, x, y + 1);
	in
		checkAll(power_set(remDups(expand(patt, []))), 0, 0)
	end;