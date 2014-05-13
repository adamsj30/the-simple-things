import jcsp.lang.CSProcess;
import jcsp.lang.Channel;
import jcsp.lang.ChannelInput;
import jcsp.lang.ChannelOutput;

class BTLeech
  implements CSProcess
{
  int my_id;
  Channel[] messages;
  TheAnimator my_animator;
  int[] my_order;
  int[] my_order_for_char;
  
  public BTLeech(int paramInt, Channel[] paramArrayOfChannel, TheAnimator paramTheAnimator)
  {
    this.my_id = paramInt;
    this.messages = paramArrayOfChannel;
    this.my_animator = paramTheAnimator;
    

    this.my_order = new int[BitTorrent.num_leeches + 1];
    this.my_order_for_char = new int[BitTorrent.seed_data.length()];
    for (int i = 0; i < this.my_order_for_char.length; i++) {
      this.my_order_for_char[i] = i;
    }
    for (i = 0; i < this.my_order_for_char.length; i++)
    {
      int j = (int)(Math.random() * (BitTorrent.seed_data.length() - i)) + i;
      int k = this.my_order_for_char[j];
      this.my_order_for_char[j] = this.my_order_for_char[i];
      this.my_order_for_char[i] = k;
    }
  }
  
  private void shuffle()
  {
    int i = 0;
    for (int j = 0; j < this.my_order.length; j++) {
      this.my_order[j] = j;
    }
    for (j = 0; j < this.my_order.length; j++)
    {
      int k = (int)(Math.random() * (BitTorrent.num_leeches + 1 - j)) + j;
      int m = this.my_order[k];
      this.my_order[k] = this.my_order[j];
      this.my_order[j] = m;
      if (this.my_order[j] == 0) {
        i = j;
      }
    }
    this.my_order[i] = this.my_order[(this.my_order.length - 1)];
    this.my_order[(this.my_order.length - 1)] = 0;
  }
  
  public void run()
  {
    Channel localChannel2 = this.messages[this.my_id];
    int i = 0;
    int j = this.my_order_for_char[i];
    
    int m = 1;
    for (;;)
    {
      Channel localChannel1;
      if ((m != 0) && (i < this.my_animator.length()))
      {
        shuffle();
        for (int k = 0; (k < BitTorrent.num_leeches + 1) && (this.my_animator.get(this.my_order[k], j) == '?'); k++) {}
        localChannel1 = this.messages[this.my_order[k]];
        localChannel1.write(new Message(true, this.my_id, j));
      }
      Message localMessage = (Message)localChannel2.read();
      if (!localMessage.request)
      {
        m = 1;
        
        this.my_animator.animate_transfer(localMessage.from, this.my_id, localMessage.char_pos);
        i++;
        if (i < this.my_animator.length()) {
          j = this.my_order_for_char[i];
        }
      }
      else
      {
        m = 0;
        localChannel1 = this.messages[localMessage.from];
        localChannel1.write(new Message(false, this.my_id, localMessage.char_pos));
      }
    }
  }
}
