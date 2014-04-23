
/**
 *
 * @author Colin
 */
import java.util.*;
class FCFS
{
    public static void main(String args[]){
        Scanner in=new Scanner(System.in);
        int p;
        float t1=0,t2=0;
        System.out.println("Enter number of processes");
        p=in.nextInt();
        int bt[]=new int[p];
        
        //create random arrival times
        int at[] = putRandoms(bt, "at");

        
        //create random burst times
        int bursts[] = new int[p];
        bursts = putRandoms(bursts, "bt");

        
        System.out.println("Process\t Arrival Time\t Burst time");
        
        for(int i=0;i<p;i++){
            System.out.println("P"+(i+1)+"\t  "+at[i]+"\t          "+bursts[i]);
        }
        
        int wt[]=new int[p];
        //initialize wait times to Zero
        for(int i=0; i<wt.length; i++){
            wt[i]=0;
        }
        
        int duparr[] = at;
        boolean fla = true;
        int wait = 0;
        int startTime = 0;
        int waitCheck = 0;
        int totTime = 0;
        int curTime = 0;
        
        System.out.println();
        System.out.println("GANTT CHART");
        for(int i=0; i<p;i++){
        System.out.print("-------------");
        }
        boolean zeroCheck = false;
        for(int i=0;i<p;i++){
        	if(at[i]==0){
        		zeroCheck = true;
        		break;
        	}
        }
        if(zeroCheck==false){
        	System.out.print("-------------");
        }
        
        System.out.println();
        System.out.print("|");
        
        int nonusedCPU = 0;
        LinkedList<Integer> bottomChart = new LinkedList<Integer>();

            for(int i=0; i<p; i++){
                int temp[] = getLow(duparr);
                
                
                if(fla == true){
                    wt[temp[1]] = 0;
                    wait = bursts[temp[1]];
                    waitCheck = bursts[temp[1]]+at[temp[1]];
                    startTime = at[temp[1]];
                    if(at[temp[1]]!=0){
                    	System.out.print("  Empty"+ "-->" +at[temp[1]]+" |");
                    	nonusedCPU += at[temp[1]];
                    	bottomChart.add(at[temp[1]]);
                    	totTime += at[temp[1]];
                    	
                    }
                    	totTime += bursts[temp[1]];                
                    fla = false;
                }else{

                    if(at[temp[1]]<=waitCheck){
                    	wt[temp[1]] = (waitCheck-at[temp[1]]);
                    	waitCheck = waitCheck+bursts[temp[1]];
                    }else{
                    	System.out.print("  Empty"+ "-->" +(at[temp[1]]-waitCheck)+" |");
                    	nonusedCPU += (at[temp[1]]-waitCheck);
                    	totTime += at[temp[1]]-waitCheck;
                    	bottomChart.add(totTime);
                    }
                    totTime += bursts[temp[1]];
                }
                
                System.out.print("   P"+(temp[1]+1)+ "-->" +bursts[temp[1]]+"   |");
                bottomChart.add(totTime);
                duparr[temp[1]] = Integer.MAX_VALUE;
            }
            
            System.out.println();


            System.out.print("0");
            for(int i=0; i<bottomChart.size(); i++){
            	System.out.print("------------" + bottomChart.get(i));
            }
            System.out.println();
            System.out.println();
            
            System.out.println("CPU UTILIZATION");
            System.out.println("---------------");
            double cpUtil = (((double)bottomChart.getLast()-(double)nonusedCPU)/(double)bottomChart.getLast())*100;
            System.out.println(cpUtil);
            System.out.println();
            
            System.out.println("WAIT TIMES");
            System.out.println("----------");
            for(int i=0; i<p; i++){
            	System.out.println("P"+(i+1)+ ": "+ wt[i]);
            }
            
            double totWait = 0.0;
            for(int i=0; i<p; i++){
            	totWait += wt[i];
            }
            double avW = (double)totWait/(double)p;
            System.out.println("AVERAGE: " + avW);
           
            double addTimes = 0.0;
            for(int i=0; i<p; i++){
            	addTimes = addTimes+bursts[i]+wt[i];
            }
            
            double avTa = addTimes/(double)p;
            
            System.out.println("");
            System.out.println("AVERAGE TURN AROUND TIME");
            System.out.println("------------------------");
            System.out.println(avTa);
            
        
}
    
    private static int[] putRandoms(int[] arTime, String check){

        Random r = new Random();
        if(check.equals("at")){
        for(int i=0; i<arTime.length; i++){
            arTime[i] = (r.nextInt(10));
        }
        return arTime;
        }
        else{
        for(int i=0; i<arTime.length; i++){
           arTime[i] = (r.nextInt(10)+1);
        }
        return arTime;
        }
    }
    
    private static int[] getLow(int arr[]){
        
        int holder = Integer.MAX_VALUE;
        int place = 0;
        for(int i=0; i<arr.length; i++){
            if(arr[i]<holder){
                holder = arr[i];
                place = i;
            }
        }
        int ret[] = {holder, place};
        return ret;
    }
}
