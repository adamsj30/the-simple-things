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

    /*
        -------------DOCUMENTATION------------
        Joshua Adams
        Assignment 8


        The way the algorithm works is if the char its grabbing is on the diagon (id num is the mod of the length of the string)
        then it grabs from the seed. Otherewise if it is below the diagonal, it gets its value from the leech directly above it.
        if it is above the diagonal, it grabs from the leech directly below it. The odd case is that the last leech grabs directly
        from the seed as well, because I was having problems with it looping all the way through to the last element.

        I made an array hasValue[] that acts as a bit array that keeps track if you have the value you need alreaedy, or if you have
        still need the value. THe index of each element in that array is the index of the characters in the string

        I also made a boolean done that checks to see if all the values along the diagonal have their requests already sent, this way
        it removes unnecessary for looping, thus saving time.

        The code does have problems sometimes. In the foo example, it will work the majority of the time, but sometimes it will end up
        failing out and will leave it as a question mark, but in general it works and works more efficiently than the class file
        that was given.
    */

      
    public void run()
    {
        ChannelOutput out_chan;
        ChannelInput in_chan;

        in_chan = messages[my_id];
        boolean done = false;

        while(true){
            if(!done){
                for(int j = 0; j < hasValue.length; j++){
                    if(hasValue[j] == 0){
                        int actual_num = (my_id - 1) % my_animator.length();
                        if(j % my_animator.num_leeches() == actual_num || my_animator.num_leeches() == my_id){
                            out_chan = messages[0];
                            out_chan.write(new Message(true, my_id, j));
                        }
                    }
                }
                done = true;
            }
            Message m = (Message) in_chan.read();
            if(m != null && !m.request){
                // animate the transfer
                if(hasValue[m.char_pos] == 0){
                    hasValue[m.char_pos] = 1;
                    my_animator.animate_transfer(m.from, my_id, m.char_pos);
                }
                // send your value to your neighbors
                int actual_num = (my_id - 1) % my_animator.length();
                if(actual_num > m.char_pos % my_animator.num_leeches()){
                    out_chan = messages[(my_id + 1) % my_animator.num_leeches()];
                    out_chan.write(new Message(false, my_id, m.char_pos));
                } else if(actual_num < m.char_pos % my_animator.num_leeches()){
                    out_chan = messages[(my_id - 1)];
                    out_chan.write(new Message(false, my_id, m.char_pos));
                } else {
                    out_chan = messages[(my_id + 1) % my_animator.num_leeches()];
                    out_chan.write(new Message(false, my_id, m.char_pos));
                    out_chan = messages[(my_id - 1)];
                    out_chan.write(new Message(false, my_id, m.char_pos));
                }
            }
        }
    }
}
   
