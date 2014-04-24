using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Schedule_Simulator
{
    public partial class Form2 : Form
    {
        String[] title_list = {"First Come First Serve", "Shortest Job First (Non-Preemptive)", "Shortest Job First (Preemptive)", "Round Robin", "Feedback"};
        int[] start_times;
        int[][] cpu_data;
        int[][] io_data;
        public Form2(int[] start_times, int[][] cpu_data, int[][] io_data)
        {
            this.start_times = start_times;
            this.cpu_data = cpu_data;
            this.io_data = io_data;
            InitializeComponent();
        }

        public void drawEvent(int id)
        {
            Simulation sim = new Simulation(start_times, cpu_data, io_data);
            List<LinkedList<int[]>> data = sim.simulate(id);
            LinkedList<int[]> cpu_times = data.ElementAt(0);
            LinkedList<int[]> io_times = data.ElementAt(1);
            if (id != 5)
            {
                // set size of outer container
                Microsoft.VisualBasic.PowerPacks.ShapeContainer canvas = new Microsoft.VisualBasic.PowerPacks.ShapeContainer();
                Microsoft.VisualBasic.PowerPacks.RectangleShape container = new Microsoft.VisualBasic.PowerPacks.RectangleShape();
                container.Location = new Point(14, 49);
                container.Size = new Size(943, 182);
                container.Visible = true;
                container.Parent = canvas;
                canvas.Parent = this;

                // set title of the simulation being ran
                Label title = new Label();
                title.Text = title_list[id];
                title.Font = new Font("Microsoft Sans Serif", 20);
                title.Location = new Point(320, 62);
                title.Visible = true;
                title.Size = new Size(441, 31);
                this.Controls.Add(title);

                // empty cpu line and label
                Microsoft.VisualBasic.PowerPacks.RectangleShape cpu = new Microsoft.VisualBasic.PowerPacks.RectangleShape();
                cpu.Location = new Point(85, 111);
                cpu.Size = new Size(850, 23);
                Label cpu_label = new Label();
                cpu_label.Text = "CPU";
                cpu_label.Location = new Point(35, 116);
                
                this.Controls.Add(cpu_label);
                cpu.Parent = canvas;
                
                // empty I/O line and label
                Microsoft.VisualBasic.PowerPacks.RectangleShape io = new Microsoft.VisualBasic.PowerPacks.RectangleShape();
                io.Location = new Point(85, 177);
                io.Size = new Size(850, 23);
                Label io_label = new Label();
                io_label.Text = "I/O";
                io_label.Location = new Point(35, 183);
                
                this.Controls.Add(io_label);
                io.Parent = canvas;

                int cpu_multiplier = 850 / cpu_times.ElementAt(cpu_times.Count - 1)[2];
                for (int i = 0; i < cpu_times.Count; i++)
                {
                    Microsoft.VisualBasic.PowerPacks.RectangleShape cpu_time_slot = new Microsoft.VisualBasic.PowerPacks.RectangleShape();
                    cpu_time_slot.Location = new Point(85 + ((cpu_times.ElementAt(i)[1]) * cpu_multiplier), 111);
                    cpu_time_slot.Size = new Size(cpu_multiplier*(cpu_times.ElementAt(i)[2]-cpu_times.ElementAt(i)[1]), 23);
                    cpu_time_slot.BackStyle = Microsoft.VisualBasic.PowerPacks.BackStyle.Opaque;
                    switch (cpu_times.ElementAt(i)[0] % 5)
                    {
                        case 0:
                            cpu_time_slot.BackColor = Color.Blue;
                            break;
                        case 1:
                            cpu_time_slot.BackColor = Color.Red;
                            break;
                        case 2:
                            cpu_time_slot.BackColor = Color.Green;
                            break;
                        case 3:
                            cpu_time_slot.BackColor = Color.Yellow;
                            break;
                        case 4:
                            cpu_time_slot.BackColor = Color.Orange;
                            break;
                    }
                    cpu_time_slot.Parent = canvas;

                    Label time_at = new Label();
                    time_at.Text = cpu_times.ElementAt(i)[1].ToString();
                    time_at.Location = new Point(80 + ((cpu_times.ElementAt(i)[1]) * cpu_multiplier), 95);
                    this.Controls.Add(time_at);
                    time_at.Size = new Size(19, 13);

                    Label time_at2 = new Label();
                    time_at2.Text = cpu_times.ElementAt(i)[2].ToString();
                    time_at2.Location = new Point(78 + ((cpu_times.ElementAt(i)[2]) * cpu_multiplier), 137);
                    this.Controls.Add(time_at2);
                    time_at2.Size = new Size(19, 13);

                }

                for (int i = 0; i < io_times.Count; i++)
                {
                    Microsoft.VisualBasic.PowerPacks.RectangleShape io_time_slot = new Microsoft.VisualBasic.PowerPacks.RectangleShape();
                    io_time_slot.Location = new Point(85 + ((io_times.ElementAt(i)[1]) * cpu_multiplier), 177);
                    io_time_slot.Size = new Size(cpu_multiplier * (io_times.ElementAt(i)[2] - io_times.ElementAt(i)[1]), 23);
                    io_time_slot.BackStyle = Microsoft.VisualBasic.PowerPacks.BackStyle.Opaque;
                    switch (io_times.ElementAt(i)[0] % 5)
                    {
                        case 0:
                            io_time_slot.BackColor = Color.Blue;
                            break;
                        case 1:
                            io_time_slot.BackColor = Color.Red;
                            break;
                        case 2:
                            io_time_slot.BackColor = Color.Green;
                            break;
                        case 3:
                            io_time_slot.BackColor = Color.Yellow;
                            break;
                        case 4:
                            io_time_slot.BackColor = Color.Orange;
                            break;
                    }
                    io_time_slot.Parent = canvas;

                    Label time_at = new Label();
                    time_at.Text = cpu_times.ElementAt(i)[1].ToString();
                    time_at.Location = new Point(80 + ((io_times.ElementAt(i)[1]) * cpu_multiplier), 161);
                    this.Controls.Add(time_at);
                    time_at.Size = new Size(19, 13);

                    Label time_at2 = new Label();
                    time_at2.Text = cpu_times.ElementAt(i)[2].ToString();
                    time_at2.Location = new Point(78 + ((io_times.ElementAt(i)[2]) * cpu_multiplier), 206);
                    this.Controls.Add(time_at2);
                    time_at2.Size = new Size(19, 13);
                }
                io_label.SendToBack();
                cpu_label.SendToBack();
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            drawEvent(0);
        }
    }
}
