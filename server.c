

#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <ctype.h>
#include <stdbool.h>

#define PORTNUMBER 12344

int main() {
	//The list of some shell commands
	char currentDirectory[100];
	//char dosCommand[100];
	//char dosParams[100];
	char input[1024];
	char * command;
	char * params[1024];
	static char *commands[] = {"ls","rm","cp","mv","cat","cd","more", "mkdir","rmdir","clear"};
	int pid;

	char buf[1024];
    char d;
    int n, s, ns, len, nread;
    struct sockaddr_in name;

    printf("Starting Server ...\n");


    if ((s = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
            perror("socket");
            exit(1);
        }

    /*
     * Create the socket address of the server.
     */
    memset(&name, 0, sizeof(struct sockaddr_in)); /* Zero memory */

    name.sin_family = AF_INET;
    name.sin_port = htons(PORTNUMBER);
    len = sizeof(struct sockaddr_in);

    /*
     * For simplicity, use the IP address as the OS selects.
     * It is more preferable to set a specific IP address
     * which must be known to all clients...
     */
    n = INADDR_ANY; /* IP address is set by OS */
    memcpy(&name.sin_addr, &n, sizeof(long));

    /*
     * Bind the socket to the this IP address.
     */
    if (bind(s, (struct sockaddr *) &name, len) < 0) {
        perror("bind");
        exit(1);
    }

    /*
     * Prepare to listen for connection requests from clients.
     * Not more than 5 requests during short time interval
     */
    if (listen(s, 5) < 0) {
        perror("listen");
        exit(1);
    }
    while(1){
	    if ((ns = accept(s, (struct sockaddr *) &name, &len)) < 0) {
	        perror("accept");
	        exit(1);
	    }
		dup2(ns, 1);
		while(1){
			int p;
			for(p = 0; p < sizeof(currentDirectory); p++){
				currentDirectory[p] = 0;
			}
			getcwd(currentDirectory, sizeof(currentDirectory));
			//printf("%s $ ", currentDirectory);
			//char * d1 = strtok(currentDirectory,'\0');
			//char * d2 = malloc(strlen(currentDirectory) + 3);
			//strcpy(d2, d1);
			strcat(currentDirectory, " $");
			write(ns, currentDirectory, sizeof(currentDirectory));
			//gets command from client.c
	        n = recv(ns, buf, sizeof(buf), 0);

	        //Get current directory and print it to screen

			//Gets users command
			//fgets(input, sizeof(input), stdin);
			//input[strlen(input)-1] = '\0';
			command = strtok(buf,"' '<");
			int i;
			for(i = 0; command != NULL; command=strtok(NULL, "' '<")){
				params[i] = command;
				i++;
			}
			params[i] = 0;

			//Creating a child process
			pid = fork();
			if(pid == 0){
				if(strncmp(params[0],"dir",100) == 0){
					execvp(commands[0], params);
				} else if(strncmp(params[0],"del",100) == 0){
					execvp(commands[1], params);
				} else if(strncmp(params[0],"copy",100) == 0){
					execvp(commands[2], params);
				} else if(strncmp(params[0],"move",100) == 0){
					execvp(commands[3], params);
				} else if(strncmp(params[0],"rename",100) == 0){
					execvp(commands[3], params);
				} else if(strncmp(params[0],"type",100) == 0){
					execvp(commands[4], params);
				} else if(strncmp(params[0],"cd",100) == 0){
					int ret;
					if(strncmp(params[1],"~",100) == 0){
						char * home = strtok(currentDirectory,"/");
						char * root = malloc(strlen(home) + 2);
						strcpy(root, "/");
						strcat(root, home);
						ret = chdir(root);
					} else{
						ret = chdir(params[1]);
						if(ret < 0){
							//printf("Invald directory.\n");
						}
					}
				} else if(strncmp(params[0],"more",100) == 0){
					execvp(commands[6], params);
				} else if(strncmp(params[0],"md",100) == 0){
					execvp(commands[7], params);
				} else if(strncmp(params[0],"rd",100) == 0){
					execvp(commands[8], params);
				} else if(strncmp(params[0],"cls",100) == 0){
					execvp(commands[9], params);
				} else if(strncmp(params[0],".",100) == 0){
				 	break;
				} else if(strncmp(params[0],"upload",100) == 0){
				 	FILE *file;
				 	file = fopen(params[1], "wb");
				 	n = recv(ns, buf, sizeof(buf), 0);
				 	fwrite(buf, sizeof(char), sizeof(buf), file);
				 	fclose(file);
				} else if(strncmp(params[0],"download",100) == 0){
				 	FILE *uf = fopen(params[1], "r");
            		if(uf < 0){
                		printf("File does not exist\n");
            		} else {
                		if((nread = fread(buf, 1, sizeof(buf), uf)) > 0){
                    		write(ns, &buf, nread);
                		}
            		}
            		fclose(uf);
				} else {
					execvp(params[0], params);
				}
				//printf ("%s: Not a valid command.\n", params[0]);
			} else {
				//The parent waits for the child to finish
				wait(0);
			}
		}
		close(ns);
	}
	close(s);
}