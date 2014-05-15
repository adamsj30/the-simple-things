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
    int hasValue[];

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

        hasValue = new int[my_animator.length()];
        for(int i = 0; i < hasValue.length; i++){
            hasValue[i] = 0;
        }
    } 

      
    public void run()
    {
        ChannelOutput out_chan;
        ChannelInput in_chan;

        in_chan = messages[my_id];
        int i = 0;
        boolean done = false;
        while(true){
            // if your my_id is 0 only send responses
            if(my_id == 0){
                Message m = (Message) in_chan.read();
                out_chan = messages[m.from];
                out_chan.write(new Message(false, my_id, m.char_pos));
            } else { 
                if(!done){
                    for(int j = 0; j < hasValue.length; j++){
                        if(hasValue[j] == 0){
                            int actual_num = (my_id - 1) % my_animator.length();
                            if(j == actual_num){
                                out_chan = messages[0];
                                out_chan.write(new Message(true, my_id, j));
                            }
                        }
                    }
                    done = true;
                }
                Message m = (Message) in_chan.read();
                if(m != null && !m.request){
                    if(my_animator.get(my_id, m.char_pos) == '?'){
                        hasValue[m.char_pos] = 1;
                        my_animator.animate_transfer(m.from, my_id, m.char_pos);
                    }
                    //if(my_id < my_animator.length()+1){
                        int actual_num = (my_id - 1) % my_animator.length();
                        for(int t = 1; t < my_animator.num_leeches()+1; t++){
                            int actual_t = (t - 2 + my_animator.length()) % my_animator.length();
                            if(actual_num == actual_t){
                                //System.out.println(my_id + " " + my_animator.get(my_id, m.char_pos) + " " + t);
                                out_chan = messages[t];
                                out_chan.write(new Message(false, my_id, m.char_pos));
                            }
                        }
                    //}
                    
                }
            }





            // if(!done){
            //     for(int j = 0; j < hasValue.length; j++){
            //         if(hasValue[j] == 0){
            //             int actual_num = (my_id - 1) % my_animator.length();
            //             if(j == actual_num){
            //                 out_chan = messages[0];
            //             } else {
            //                 out_chan = messages[my_id - 1];
            //             }
            //             out_chan.write(new Message(true, my_id, j));
            //         }
            //     }
            //     done = true;
            // }
            
            // int f = 0;
            // //while(f < 10){
            //     Message m = (Message) in_chan.read();
            //     if(m.request){
            //         if(my_animator.get(my_id, m.char_pos) == '?'){
            //             //out_chan = messages[my_id];
            //             //out_chan.write(new Message(true, m.from, m.char_pos));
            //         } else {
            //             out_chan = messages[m.from];
            //             out_chan.write(new Message(false, my_id, m.char_pos));
            //         }
            //     } else {
            //         //System.out.println(my_id + " " + m.from);
            //         hasValue[m.char_pos] = 1;
            //         my_animator.animate_transfer(m.from, my_id, m.char_pos);
            //         i++;
            //     }
            //     f++;
            //     //m = (Message) in_chan.read();
            // //}
        }
    }
}
   
