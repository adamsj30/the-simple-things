using System;
using System.Collections.Generic;
//Runs all of the algorithms for the Scheduler
class Simulation{

	int sim_id;
	int[][] data_for_simulation;
	const int FCFS = 0;
	const int SJFNP = 1;
	const int SJFP = 2;
	const int RR = 3;
	const int FB = 4;
	const int ALL = 5;

	public Simulation(int id, int[][] data){
		sim_id = id;
		data_for_simulation = data;
	}

	private void simulate(){
		switch(sim_id){
			case FCFS:
				first_come_first_serve();
				break;
			case SJFNP:
				shortest_job_first_non_preemptive();
				break;
			case SJFP:
				shortest_job_first_preemptive();
				break;
			case RR:
				round_robin();
				break;
			case FB:
				feedback();
				break;
			case ALL:
				break;
		}
	}

	private void first_come_first_serve(){
		// Number of processes for easier refrencing
		int number_of_processes = data_for_simulation.Length;
		// Putting arrival times into arrival_times[]
		int arrival_times = new int[number_of_processes];
		for(int i = 0; i < number_of_processes; i++){
			arrival_times[i] = data_for_simulation[i][0];
		}
		// Putting wait times and initilizing them to zero (used for calculations)
		int wait_times = new int[number_of_processes];
		for(int i = 0; i < number_of_processes; i++){
			wait_times[i] = 0;
		}
		
		LinkedList<int[]> cpu;
		LinkedList<int[]> io;

		for(int i = 0; i < number_of_processes; i++){
			
		}
	}

	private void shortest_job_first_non_preemptive(){
		
	}

	private void shortest_job_first_preemptive(){

	}

	private void round_robin(){

	}

	private void feedback(){

	}

	// Gets the index of the shorest start time
	private int getFirstArrival(int[] times){
		int index = 0;
		int currentMax = Int32.MaxValue;
		for(int i = 0; i < times.Length; i++){
			if(times[i] < currentMax){
				index = i;
				currentMax = times[i];
			}
		}
		return index;
	}

	static void Main(){
		
	}
}