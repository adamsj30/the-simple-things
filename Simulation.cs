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

	public void simulate(){
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

	public void first_come_first_serve(){
		
	}

	public void shortest_job_first_non_preemptive(){
		int number_of_processes = data_for_simulation.Length;
		LinkedList<int[]> cpu;
		LinkedList<int[]> io;
	}

	public void shortest_job_first_preemptive(){

	}

	public void round_robin(){

	}

	public void feedback(){

	}

	static void Main(){
		
	}
}