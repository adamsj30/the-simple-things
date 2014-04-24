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
    public partial class Form1 : Form
    {
        int rowCount = 0;
        int timeCount = 1;
        public Form1()
        {
            InitializeComponent();
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            
        }

        private void button1_Click(object sender, EventArgs e)
        {
            dataGridView1.Rows.Add(1);
            //dataGridView1.DataError = "Something";
            dataGridView1[0, rowCount].Value = ("Process " + (rowCount+1));
            for (int i = 0; i < (timeCount * 2); i++)
            {
                dataGridView1[i, rowCount].ValueType = typeof(int);
                //dataGridView1[i, rowCount].ErrorText = "Must be integer";
            }
            
            rowCount++;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            dataGridView1.Columns.Add("io_time_" + (timeCount-1), "I/O Time");
            dataGridView1.Columns.Add("cpu_time_" + timeCount, "CPU Time");
            timeCount++;
        }

        private void button3_Click(object sender, EventArgs e)
        {
            Random random = new Random();
            for (int i = 0; i < rowCount; i++)
            {
                for (int j = 1; j < ((timeCount * 2) + 1); j++)
                {
                    dataGridView1[j,i].Value = random.Next(19) + 1;
                }
            }
        }

        private void button4_Click(object sender, EventArgs e)
        {
            for (int i = dataGridView1.Rows.Count - 1; i >= 0; i--)
            {
                dataGridView1.Rows.RemoveAt(i);
                rowCount--;
            }
            for (int j = dataGridView1.Columns.Count - 1; j > 2; j--)
            {
                dataGridView1.Columns.RemoveAt(j);
            }
            timeCount = 1;
        }

        private void button5_Click(object sender, EventArgs e)
        {
            // Get arrays from the tables
            int[] start_times = new int[rowCount];
            for (int i = 0; i < rowCount; i++)
            {
                start_times[i] = Convert.ToInt32(dataGridView1[1, i].Value.ToString());
            }
            int[][] cpu_data = new int[rowCount][];
            for (int i = 0; i < rowCount; i++)
            {
                cpu_data[i] = new int[timeCount];
                for (int j = 2; j < dataGridView1.Columns.Count; j += 2)
                {
                    cpu_data[i][(j / 2) - 1] = Convert.ToInt32(dataGridView1.Rows[i].Cells[j].Value);
                }
            }
            int[][] io_data = new int[rowCount][];
            for (int i = 0; i < rowCount; i++)
            {
                io_data[i] = new int[timeCount - 1];
                for (int j = 3; j < dataGridView1.Columns.Count; j += 2)
                {
                    io_data[i][((j - 1) / 2) - 1] = Convert.ToInt32(dataGridView1.Rows[i].Cells[j].Value);
                }
            }
            
            // Create second form and display it
            Form2 displayForm = new Form2(start_times, cpu_data, io_data);
            displayForm.Visible = true;
            this.Visible = false;
        }
    }
}
