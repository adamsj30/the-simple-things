// The BTLeech class you have to write for Assignment 8

// javac -classpath jcspclasses.jar:phwclasses.jar:XtangoAnimation.jar:. BitTorrent.java BTLeech.java

// java -classpath jcspclasses.jar:phwclasses.jar:XtangoAnimation.jar:. BitTorrent antidisestablishmentarianism 16 5 0 400

// The command line parameters can be adjusted to exercise your
// solution (as I will).  They represent the string to be shared, the
// number of leeches, a seed delay factor, a leech delay factor, and a
// general delay factor.

import XtangoAnimation.*;
import java.awt.*;
import jcsp.lang.*;
import jcsp.util.*;
import java.util.*;
import java.io.*;
import java.lang.*;

// Leeches at the moment are pure leeches, never turning into
// quasi-seeds.  In the assignment, you need to help out the "pure
// seed", that is, Processor 0, by turning leeches into quasi-seeds as
// they acquire data.  Leeches should then evenly distribute their
// requests to the pure seed and to other quasi-seeds who have the
// data they want.
class BTLeech implements CSProcess
{
    int my_id;
    Channel messages[];
    TheAnimator my_animator;

    // When a leech is constructed, it receives its integer ID (the
    // "processor number"), an array of Any2One channels, and the
    // animator.  This leech receives Messages from other Processors
    // on the channel with its ID number.  It can send Messages to
    // others processors by writing them to the channel identified by
    // that Processor's ID.  Note that, since a leech also receives
    // the animator, it can call methods in its animator.

    public BTLeech(int id, Channel messages[], TheAnimator ta)
    {
        my_id = id;
        this.messages = messages;
        this.my_animator = ta;
    }   

      
    public void run()
    {
        ChannelOutput out_chan;
        ChannelInput in_chan;

        in_chan = messages[my_id];
        int i = 0;
        while(i < my_animator.length()){
            int actual_num = (my_id-1) % my_animator.length();
            if(i == actual_num){
                out_chan = messages[0];
            } else {
                out_chan = messages[my_id + 1];
            }
            out_chan.write(new Message(true, my_id, i));

            Message m = (Message) in_chan.read();
            if(m.request){
                if(my_animator.get(my_id, m.char_pos) == '?'){
                    out_chan = messages[my_id];
                    out_chan.write(new Message(true, m.from, m.char_pos));
                } else {
                    out_chan = messages[m.from];
                    out_chan.write(new Message(false, my_id, m.char_pos));
                    i++;
                }
            } else {
                my_animator.animate_transfer(m.from, my_id, m.char_pos);
                i++;
            }
        }

        // for(int i = 0; i < my_animator.length(); i++){
        //     out_chan = messages[my_id-1];
        //     out_chan.write(new Message(true, my_id, i));
        //     Message m = (Message) in_chan.read();
        //     if(m.request){
        //         out_chan = messages[m.from];
        //         out_chan.write(new Message(false, my_id, m.char_pos));
        //     } else {
        //         my_animator.animate_transfer(m.from, my_id-1, m.char_pos);
        //     }
        // }
    }
}
   
