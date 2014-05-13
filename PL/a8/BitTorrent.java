
import XtangoAnimation.*;
import java.awt.*;
import jcsp.lang.*;
import jcsp.util.*;
import java.util.*;
import java.io.*;
import java.lang.*;

// The class where public static void main lives.  You need do nothing
// here -- all your work will be in the re-implementation of the
// BTLeech CSProcess
class BitTorrent
{
    private static XtangoAnimator xa = null;
    private static TheAnimator ta = null;

    private static char data_stores[] [] = null;
    public static long transfer_count[] [] = null;
    public static int total_transfer;
    public static int num_leeches;
    public static String seed_data = null;
    public static long start;
    public static int seed_delay;
    public static int leech_delay;
    public static int gen_delay;
    public static int animate_sleep_time = 0;
    public static int total_animate_sleep_time = 0;

    public static final float char_horiz_offset = 0.024f;
    public static final float char_vert_offset = 0.033f;
    public static final float rect_horiz_offset = 0.024f;
    public static final float rect_vert_offset = 0.033f;
    public static final float rect_width = 0.021f;
    public static final float rect_height = 0.031f;
    

    public BitTorrent () { }



    public static void main(String[] args) throws java.io.IOException
    {  
        seed_data = null;
        num_leeches = 0;

        if (args.length == 0 || args.length == 1) 
            System.out.println("Usage:  java BitTorrent shared-string num-leeches seed_delay leech_delay gen_delay");
        else {
            seed_data = args[0];
            num_leeches = (new Integer(args[1])).intValue();
            seed_delay = (new Integer(args[2])).intValue();
            leech_delay = (new Integer(args[3])).intValue();
            gen_delay = (new Integer(args[4])).intValue();
        }
        
        start = System.currentTimeMillis();
        data_stores = new char [num_leeches + 1] [seed_data.length()];
        transfer_count = new long [num_leeches + 1] [seed_data.length()];
        for (int j = 0; j < seed_data.length(); j++) data_stores[0][j] = seed_data.charAt(j);
        String leech_data = new String ("");
        for (int i = 0; i < seed_data.length(); i++) leech_data = leech_data.concat("?");
        for (int i = 1; i <= num_leeches; i++)
            for (int j = 0; j < seed_data.length(); j++)
                data_stores[i][j] = leech_data.charAt(j);



        XtangoAnimator xa = new XtangoAnimator();        // animation...
        xa.begin();
        xa.coords(-0.1f, -0.1f, 1.1f, 1.1f);
        xa.bg(Color.black);

        for (int i = 0; i < data_stores.length; i++) {
            for (int j = 0; j < data_stores[i].length; j++) {
                float color_gradient = ((float)(data_stores.length - 1 - i)) / ((float)(data_stores.length - 1)); // i = 0 => gradient is 1
                xa.rectangle("R_"+i+"_"+j, -0.01f + (((float) j) * rect_horiz_offset),
                             0.98f - (((float) i) * rect_vert_offset),
                             rect_width, rect_height,
                             new Color(color_gradient, 0.0f, (1.0f - color_gradient)),
                             XtangoAnimator.SOLID);
                xa.text("T_"+i+"_"+j, 0.0f + (((float) j) * char_horiz_offset), 1.0f - (((float) i) * char_vert_offset), true, Color.white,
                        new String(data_stores[i],j,1));
            }
        }

        Channel messages[] = new Channel[num_leeches + 1];
        for (int i = 0; i < messages.length; i++) {
            messages[i] = new Any2OneChannel( new Buffer(200) );
        }

        ta = new TheAnimator(data_stores, xa);

        CSProcess Procs[] = new CSProcess[num_leeches + 1];
        Procs[0] = new BTSeed(0, messages);
        for (int i = 1; i < Procs.length; i++) {
            Procs[i] = new BTLeech(i, messages, ta);
        }
        
        
        Parallel algo = new Parallel(Procs);
        algo.run();

        xa.end();
        // ...animation
        System.exit(0);
    }
}
   
/*  Documentation for TheAnimator class:

// **********************************************************
// The animate_transfer method *MUST* be called after you've
// received a data packet (that is, a character in our simulation)
// from the seed or from a quasi-seed.  Do *not* call it when you,
// in the role of an emergent quasi-seed, send a data packet to a
// leech.  The parameters are:

// source -- the ID of the processor this data packet came from

// dest -- this will be your integer id

// char_pos -- the position of the data packet (that is,
// character) you received
public synchronized void animate_transfer(int source, int dest, int char_pos)

// **********************************************************
// Return the length of the string simulating the packets of data
public int length () 

// **********************************************************
// Return the number of leeches in the simulation
public int num_leeches () 

// **********************************************************
// Return the character at the designated row and column of the
// simulation.  Note that row 0 is that of the seed and rows 1
// ... num_leeches belong to the respective leeches.  A question
// mark '?' at a position indicates that the leech in that row
// does not yet have that character.  You will need to call on
// this function as you plan your load balancing.
public char get (int row, int col) 

*/

class TheAnimator {

    char data_stores [] [];
    XtangoAnimator xa;
    BitTorrent my_master;

    public TheAnimator(char data_stores [] [], XtangoAnimator xa) {
        this.data_stores = data_stores;
        this.xa = xa;
    }

    // The animate_transfer method *MUST* be called after you've
    // received a data packet (that is, a character in our simulation)
    // from the seed or from a quasi-seed.  Do *not* call it when you,
    // in the role of an emergent quasi-seed, send a data packet to a
    // leech.  The parameters are:

    // source -- the ID of the processor this data packet came from

    // dest -- this will be your integer id

    // char_pos -- the position of the data packet (that is,
    // character) you received
    public  void animate_transfer(int source, int dest, int char_pos)
    {

        int [] sum = new int [data_stores.length];
        //              animate_transfer (m.from, my_id, m.char_pos);

        float color_gradient = ((float)(data_stores.length - 1 - source)) / ((float)(data_stores.length - 1)); 
        xa.rectangle("Temprect_"+source+"_"+dest+"_"+char_pos, -0.01f + (((float) char_pos) * BitTorrent.rect_horiz_offset),
                     0.98f - (((float) source) * BitTorrent.rect_vert_offset),
                     BitTorrent.rect_width, BitTorrent.rect_height,
                     new Color(color_gradient, 0.0f, (1.0f - color_gradient)),
                     XtangoAnimator.SOLID);
        xa.moveToAsync("Temprect_"+source+"_"+dest+"_"+char_pos,"R_"+dest+"_"+char_pos);
        //xa.swapIds("Temprect_"+source+"_"+dest+"_"+char_pos,"R_"+dest+"_"+char_pos);
        xa.delete("T_"+dest+"_"+char_pos);
        xa.text("T_"+dest+"_"+char_pos, 0.0f + (((float) char_pos) * BitTorrent.char_horiz_offset),
                1.0f - (((float) dest) * BitTorrent.char_vert_offset), true, Color.white,
                new String(data_stores[source],char_pos,1));
	synchronized (this) {	// Here we don't sync the sleep below because that really slows it down
	    data_stores[dest][char_pos] = data_stores[source][char_pos]; // New tonight
	    BitTorrent.transfer_count[source][char_pos]++;
	    BitTorrent.total_transfer++;

	    if (BitTorrent.total_transfer % 10 == 0) {
		System.out.println(" *********************** ");
		for (int i = 0; i < data_stores.length; i++) {
		    sum[i] = 0;
		    for (int j = 0; j < data_stores[i].length; j++) {
			sum[i] += BitTorrent.transfer_count[i][j];
			System.out.print(" " + BitTorrent.transfer_count[i][j]);
		    }
		    System.out.println(" " + sum[i]);
		}
		System.out.println("Running for " + (System.currentTimeMillis() - BitTorrent.start) + " milliseconds.");
		System.out.println("Total animated sleep time " + BitTorrent.total_animate_sleep_time + " milliseconds.");
	    }
        boolean leech_delay_kick = false;
        for (int j = 1; j < data_stores.length; j++) {
            leech_delay_kick = leech_delay_kick || sum[j] > 0.2 * data_stores.length * data_stores[j].length;
        }
	// But the sleep penalty is accumulated in synch'ed form
        if (BitTorrent.gen_delay != 0) {
	    BitTorrent.animate_sleep_time = ((int) (Math.random() * BitTorrent.gen_delay * (leech_delay_kick ? BitTorrent.leech_delay + 1 : 1 ) ));
	    BitTorrent.total_animate_sleep_time += BitTorrent.animate_sleep_time;
	}
	} // end of sync'ed block
        if (BitTorrent.gen_delay != 0) {
            try {
                Thread.sleep(BitTorrent.animate_sleep_time);
		//                Thread.sleep((int) (Math.random() * BitTorrent.gen_delay * (leech_delay_kick ? BitTorrent.leech_delay + 1 : 1 ) ));
                //              Thread.sleep((int) (Math.random() * 400));
                //Thread.sleep((int) (Math.random() * 4));
            } catch (InterruptedException e) {
                System.err.println("interrupted out of sleep");
            }
        }
    }

    // Return the length of the string simulating the packets of data
    public int length () {
        return data_stores[0].length;
    }

    // Return the number of leeches in the simulation
    public int num_leeches () {
        return BitTorrent.num_leeches;
    }

    // Return the character at the designated row and column of the
    // simulation.  Note that row 0 is that of the seed and rows 1
    // ... num_leeches belong to the respective leeches.  A question
    // mark '?' at a position indicates that the leech in that row
    // does not yet have that character.  You will need to call on
    // this function as you plan your load balancing.
    public char get (int row, int col) {
        return data_stores [row] [col];
    }
}

// Use this simple class to pass messages between the seed, leeches,
// and leeches who are turning into quasi-seeds.
class Message {

    public boolean request;     // true if a request for data, false
                                // if a response to a previous request
    public int from;            // integer id of who this message is from
    public int char_pos;        // the position in the data_stores
                                // array of the character desired (if
                                // request) or returned (if response)

    public Message(boolean request, int from, int char_pos)
    {
        this.request = request;
        this.from = from;
        this.char_pos = char_pos;
    }

}

   
// The seed process never changes what it does - just sends out data
// to fill requests from leeches.  Be forewarned -- there is an
// escalating sleep interval in here.  Hence the more the seed gets
// called, the slower it goes.
class BTSeed implements CSProcess
{
    int my_id;
    Channel messages[];
    //     char data_stores [] [];
    //     XtangoAnimator xa;
    //     BitTorrent my_master;
    int my_tfr_count;
      
    public BTSeed(int id, Channel messages[])
    {
        my_id = id;
        this.messages = messages;
        //      this.data_stores = data_stores;
        //      this.xa = xa;
        my_tfr_count = 0;
    }

      
    public void run()
    {
        ChannelOutput out_chan;
        ChannelInput in_chan;
        in_chan = messages[0];
        while (true) {
            Message m = (Message) in_chan.read();
            out_chan = messages[m.from];
            out_chan.write( new Message(false, 0, m.char_pos) );
            my_tfr_count++;
            if (BitTorrent.seed_delay != 0) {
                try {
                    Thread.sleep((int) (my_tfr_count * BitTorrent.seed_delay));
                    //Thread.sleep((int) (my_tfr_count));
                } catch (InterruptedException e) {
                    System.err.println("interrupted out of sleep");
                }
            }
        }
    }
}
   
