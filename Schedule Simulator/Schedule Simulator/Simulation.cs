using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Schedule_Simulator
{
    class Simulation
    {
        int[] start_times_main;
        int[][] cpu_data_main;
        int[][] io_data_main;
        const int FCFS = 0;
        const int SJFNP = 1;
        const int SJFP = 2;
        const int RR = 3;
        const int FB = 4;
        const int ALL = 5;

        public Simulation(int[] start_times, int[][] cpu_data, int[][] io_data)
        {
            start_times_main = start_times;
            cpu_data_main = cpu_data;
            io_data_main = io_data;
        }

        public List<LinkedList<int[]>> simulate(int sim_id)
        {
            switch (sim_id)
            {
                case FCFS:
                    return first_come_first_serve();
                default:
                    return first_come_first_serve();
                    /*
                case SJFNP:
                    return shortest_job_first_non_preemptive();
                case SJFP:
                    return shortest_job_first_preemptive();
                case RR:
                    return round_robin();
                case FB:
                    return feedback();
                case ALL:
                    return feedback();*/
            }
        }

        private List<LinkedList<int[]>> first_come_first_serve()
        {
            Queue<int[]> cpu_queue = new Queue<int[]>();
            Queue<int[]> io_queue = new Queue<int[]>();

            // Number of processes for easier refrencing
            int number_of_processes = cpu_data_main.Length;

            int[] cpu_index = new int[number_of_processes];
            int[] io_index = new int[number_of_processes];

            for (int i = 0; i < number_of_processes; i++)
            {
                cpu_index[i] = 0;
                io_index[i] = 0;
            }

            // Set up start times that can be changed
            int[] start_time = new int[number_of_processes];
            for (int i = 0; i < number_of_processes; i++)
            {
                start_time[i] = start_times_main[i];
            }
            
            // Putting wait times and initilizing them to zero (used for calculations)
            int[] wait_times = new int[number_of_processes];
            for (int i = 0; i < number_of_processes; i++)
            {
                wait_times[i] = 0;
            }

            LinkedList<int[]> cpu = new LinkedList<int[]>();
            LinkedList<int[]> io = new LinkedList<int[]>();

            bool[] finished = new bool[number_of_processes];
            for (int i = 0; i < number_of_processes; i++)
            {
                finished[i] = false;
            }

            int current_time = 0;
            bool cpu_free = true;
            bool io_free = true;
            while (true)
            {
                // Check to see if all cpu times are done
                bool isDone = true;
                for (int i = 0; i < number_of_processes; i++)
                {
                    if (finished[i] == false)
                        isDone = false;
                }
                if (isDone == true)
                    break;

                // Adds the processes that start at this time to the CPU queue
                int[] at_this_time = new int[number_of_processes];
                for (int i = 0; i < number_of_processes; i++)
                {
                    if (start_time[i] == current_time)
                        at_this_time[i] = 1;
                    else
                        at_this_time[i] = 0;
                }
                for (int i = 0; i < number_of_processes; i++)
                {
                    if (at_this_time[i] == 1)
                    {
                        int[] temp = { i, cpu_data_main[i][cpu_index[i]] };
                        cpu_queue.Enqueue(temp);
                        cpu_index[i] = cpu_index[i] + 1;
                    }
                }

                // Remove processes from the cpu that are finished
                if ((cpu.Count != 0) && (cpu.ElementAt(cpu.Count-1)[2] == current_time))
                {
                    cpu_free = true;
                    // If the element just finished by the cpu has an io operation, add it to io queue and increment io_index
                    if (cpu_index[cpu.ElementAt(cpu.Count - 1)[0]] < io_data_main[cpu.ElementAt(cpu.Count - 1)[0]].Length)
                    {
                        int[] temp = { cpu.ElementAt(cpu.Count - 1)[0], io_data_main[cpu.ElementAt(cpu.Count - 1)[0]][io_index[cpu.ElementAt(cpu.Count - 1)[0]]] };
                        io_queue.Enqueue(temp);
                        io_index[cpu.ElementAt(cpu.Count - 1)[0]] = io_index[cpu.ElementAt(cpu.Count - 1)[0]] + 1;
                    }
                    else
                    {
                        finished[cpu.ElementAt(cpu.Count - 1)[0]] = true;
                    }
                }

                // Remove processes from the io that are finished
                if ((io.Count != 0) && (io.ElementAt(io.Count - 1)[2] == current_time))
                {
                    io_free = true;
                    // If an element is just finished by the io, then add it back into the cpu queue and increment cpu_index
                    int[] temp = {io.ElementAt(io.Count - 1)[0], cpu_data_main[io.ElementAt(io.Count - 1)[0]][cpu_index[io.ElementAt(io.Count - 1)[0]]]};
                    cpu_queue.Enqueue(temp);
                    cpu_index[io.ElementAt(io.Count - 1)[0]] = cpu_index[io.ElementAt(io.Count - 1)[0]] + 1;
                }

                // If the cpu is free, then add the first element from queue to it
                if (cpu_free)
                {
                    if (cpu_queue.Count != 0)
                    {
                        int[] temp1 = cpu_queue.Dequeue();
                        int[] temp2 = { temp1[0], current_time, current_time + temp1[1] };
                        cpu.AddLast(temp2);
                        cpu_free = false;
                    }
                }

                if (io_free)
                {
                    if (io_queue.Count != 0)
                    {
                        int[] temp1 = io_queue.Dequeue();
                        int[] temp2 = { temp1[0], current_time, current_time + temp1[1] };
                        io.AddLast(temp2);
                        io_free = false;
                    }
                }
                current_time++;
            }

            List<LinkedList<int[]>> return_lists = new List<LinkedList<int[]>>();
            return_lists.Add(cpu);
            return_lists.Add(io);

            return return_lists;
        }

        private List<LinkedList<int[]>> shortest_job_first_non_preemptive()
        {
            return null;
        }

        private List<LinkedList<int[]>> shortest_job_first_preemptive()
        {
            return null;
        }

        private List<LinkedList<int[]>> round_robin()
        {
            return null;
        }

        private List<LinkedList<int[]>> feedback()
        {
            return null;
        }

        // Gets the index of the shorest start time
        private int getFirstArrival(int[] times)
        {
            int index = 0;
            int currentMax = Int32.MaxValue;
            for (int i = 0; i < times.Length; i++)
            {
                if (times[i] < currentMax)
                {
                    index = i;
                    currentMax = times[i];
                }
            }
            return index;
        }
    }
}
