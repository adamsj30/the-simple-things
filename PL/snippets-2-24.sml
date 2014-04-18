(* DATATYPE STUFF STARTS HERE *)


    (*----------------------------------------*)
    datatype pizza =  Cheese |
                      Sausage |
                      Mushroom |
                      Anchovy;
    (*----------------------------------------*)


    (*-------A function to compute pizza price-------*)
    fun price Cheese = 7.95
      | price Sausage = 9.95
      | price Mushroom = 8.95
      | price Anchovy = 12.95;
    (*----------------------------------------*)
    (*----------------------------------------*)
    val my_pizza = Mushroom;
    price my_pizza;
    (*----------------------------------------*)


    (*----------------------------------------*)
    datatype shape =
         Point |
         Circle of (real) | (* Radius *)
         Rectangle of (real * real); (* height and width *)
    (*----------------------------------------*)


    (*----------------------------------------*)
    val smallCircle = Circle(2.5);
    val bigRectangle = Rectangle(57.25,93.75);
    (*----------------------------------------*)

    (*----------------------------------------*)
    fun area Point = 0.0
      | area (Circle(r)) = 3.14 * r * r
      | area (Rectangle(h,w)) = h * w;
    (*----------------------------------------*)
    (*----------------------------------------*)
    area smallCircle;
    area bigRectangle;
    (*----------------------------------------*)

    (*----------------------------------------*)
    datatype shape =
         Point |
         Circle of (real) | (* Radius *)
         Rectangle of (real * real); (* height and width *)
    (*----------------------------------------*)
    (*----------------------------------------*)
    val smallCircle = Circle(2.5);
    val bigRectangle = Rectangle(57.25,93.75);
    (*----------------------------------------*)

    (*----------------------------------------*)
    fun area s =
      case s of
         Point => 0.0
         | Circle(r) => 3.14 * r * r
         | Rectangle(h,w) => h * w;
    (*----------------------------------------*)
    (*----------------------------------------*)
    area smallCircle;
    area bigRectangle;
    (*----------------------------------------*)


    (*----------------------------------------*)
    datatype pizza =  Cheese |
                      Sausage |
                      Mushroom |
                      Anchovy;
    (*----------------------------------------*)


    (*----------------------------------------*)
    datatype ('key, 'info) TABLE =
        Table of ('key * 'info) list;
    (*----------------------------------------*)


    (*----------------------------------------*)
    val an_empty_table = Table [];

    (* Area codes keyed by city name *)
    val area_codes = Table [("San Francisco", 415),
                            ("Los Angeles", 213),
                            ("Oshkosh", 920),
                            ("Palo Alto", 415),
                            ("Palm Springs", 619)];

    (* Flavor ratings keyed by pizza type*)
    val flavor_ratings = Table [(Cheese, "Ordinary"),
                                (Sausage, "Ugh!"),
                                (Mushroom, "The Best"),
                                (Anchovy, "Interesting")];
    (*------------------------------------------------*)



    (*----------------------------------------*)
    exception not_found;

    fun lookup theKey (Table []) = raise not_found
      | lookup theKey (Table ((key,data)::rest)) =
                      if theKey = key then
                          data
                      else
                          lookup theKey (Table rest);
    (*----------------------------------------*)

    (*----------------------------------------*)
    lookup "San Francisco" area_codes;
    (* lookup Senior class_size;*)
    lookup "Moscow" area_codes;
    (*----------------------------------------*)

