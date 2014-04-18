datatype 'ingredient pizza =
    Bottom
    | Topping of ('ingredient * ('ingredient pizza));

datatype fish =
    Anchovy
    | Shark
    | Tuna;

val my_pizza = Topping(Tuna, Topping(Shark, Topping(Anchovy, Bottom)));

fun rem_anchovy Bottom = Bottom
    | rem_anchovy (Topping(Anchovy,p)) = rem_anchovy(p)
    | rem_anchovy (Topping(t,p)) = Topping(t, rem_anchovy(p));

rem_anchovy my_pizza;

(* This doesn't work because of associativity. You would need an additional set of parens *)
rem_anchovy Topping(Tuna, Topping(Shark, Topping(Anchovy, Bottom)));

rem_ingred (Anchovy, my_pizza);


datatype 'data tree =
   Empty |
   Node of 'data tree * 'data * 'data tree;

fun flatten_tree Empty = []
  | flatten_tree (Node(left,root,right)) = (flatten_tree left) @ root @ (flatten_tree right) ;

(* - flatten_tree (Node (Node (Node (Empty, [3, 7, 9], Empty), [12, 5], Empty), [99, 1, 56, 30], Node ( (Node (Empty, [78, 21], Empty), [9, 3, 1], Empty) ) ) );
val it = [3,7,9,12,5,99,1,56,30,78,21,9,3,1] : int list *)

  (* make_bst elts lt --
       construct a BST for the elements in the list
       elts.  The parameter lt is the "less-than" 
       comparison function by which the BST is ordered.
   *)

  fun make_bst nil lt = Empty
  |   make_bst (pivot::rest) lt =
        let
            (*
              This helper function splits a list into two parts: those
              elements less than pivot and those elements not.
              We return this as a pair of lists.
            *)
            fun split(nil) = (nil,nil)
              |   split(x::xs) =
                  let
                     val (below, above) = split(xs) (* Recursive call *)
                  in
                     if lt(x,pivot) then (x::below, above)
                                    else (below, x::above)
                  end;                  (* End of helper split *)

          val (below, above) = split(rest) (* Call helper *)
        in
          Node(make_bst below lt, pivot, make_bst above lt)
        end;

val test_tree = 
  Node
    (Node (Empty,1,Node (Empty,2,Empty)),4,
     Node (Node (Empty,6,Empty),9,Node (Empty,20,Node (Empty,67,Empty))));



  (*
    search_bst t lt e --
      returns true iff BST t contains element e.
      The parameter lt is the "less-than" comparison
      function by which the BST is ordered.
  *)
  fun search_bst Empty lt e = false
  |   search_bst (Node(left,v,right)) lt e =
        e=v
        orelse lt(e,v) andalso search_bst left lt e
        orelse search_bst right lt e;



flatten_tree (Node (Node (Node (Empty, [3, 7, 9], Empty), [12, 5], Empty), 
             [99, 1, 56, 30], 
             Node ( (Node (Empty, [78, 21], Empty), [9, 3, 1], Empty) ) ) );

make_bst [4, 1, 9, 6, 20, 2, 67] (op <);

val test_tree =
  Node
    (Node (Empty,1,Node (Empty,2,Empty)),4,
     Node (Node (Empty,6,Empty),9,Node (Empty,20,Node (Empty,67,Empty))));
search_bst test_tree (op <) 67;
search_bst test_tree (op <) 76;
