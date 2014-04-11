/*
    Assignment 2
    Joshua Adams
    Broc Keifenheim
    Colin Ladd

    NOTES:
    To switch between the client and server commands, type "server" and "client". You also
    must be in the server mode in order to quit out with the "." command.
*/

#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <ctype.h>
#include <stdbool.h>

#define PORTNUMBER  12346 /* Port of the server */
#define IP "141.233.181.20"

//char request[]="ls -l";
char currentDirectory[100];
//char dosCommand[100];
//char dosParams[100];
char input[1024];
char * command;
char * params[1024];
bool server = true;
struct hostent *hp;
struct sockaddr_in name;

static char *commands[] = {"ls","rm","cp","mv","cat","cd","more", "mkdir","rmdir","clear"};
int pid;

int main(void)
{
    int n, s, len, nread;
    char buf[1024];
    char hostname[64];
    struct hostent *hp;
    struct sockaddr_in name;
    bool cyaLater = false;
    /*
     * Get our local host name and put it into hostname array.
     */
    if (gethostname(hostname, sizeof(hostname)) < 0) {
        perror("gethostname");
        exit(1);
    }

    /*
     * Look up our host's network address and put it into
     * the structure pointed by hp.
     * It is assumed that this is the IP address of the server,
     * if the server runs on the SAME host...
     */
    if ((hp = gethostbyname(hostname)) == NULL) {
        fprintf(stderr, "unknown host: %s.\n", hostname);
        exit(1);
    }

    /*
     * Create its own (client) socket in the INET
     * domain.
     */
    if ((s = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        perror("socket");
        exit(1);
    }

    /*
     * Create the address of the server in the structure name.
     */
    memset(&name, 0, sizeof(struct sockaddr_in)); /* Zeroing the structure */

    name.sin_family = AF_INET;
    name.sin_port = htons(PORTNUMBER);
    name.sin_addr.s_addr = inet_addr(IP);
    len = sizeof(struct sockaddr_in);

    /*
     * Now this client will connect to the server.
     */
    if (connect(s, (struct sockaddr *) &name, len) < 0) {
        perror("connect");
        exit(1);
    }

    /*
     * Read some text from some place and copy this
     * text to the socket as a request to the server.
     */


    while(1){
        int p;
        for(p = 0; p < sizeof(buf); p++){
                buf[p] = 0;
        }
        if(cyaLater)
            exit(0);
        else{
            if(server){
                //getcwd(currentDirectory, sizeof(currentDirectory));
                //printf("SERVER: ");
                n = recv(s, buf, sizeof(buf), 0);
                write(1, buf, n);
                //printf(" $");

                fgets(input, sizeof(input), stdin);
                input[strlen(input)-1] = '\0';
                //command = strtok(input,"' '<");
                //printf("%s ", input);
                strcpy(buf, input);
                command = strtok(input,"' '<");
                int i;
                for(i = 0; command != NULL; command=strtok(NULL, "' '<")){
                    params[i] = command;
                    i++;
                }
                params[i] = 0;
                
                //strcpy(buf, input);
                if (send(s, buf, n, 0) < 0)
                {
                    perror("send");
                    exit(1);
                }

                if((strncmp(params[0],".",100) == 0)) {
                    printf("Goodbye!\n");
                    cyaLater = true;
                } else if ((strncmp(params[0],"upload",100) == 0)){
                    FILE *uf = fopen(params[1], "r");
                    if(uf < 0){
                        printf("File does not exist\n");
                    } else {
                        if((nread = fread(buf, 1, sizeof(buf), uf)) > 0){
                            write(s, &buf, nread);
                        }
                    }
                    fclose(uf);
                } else if ((strncmp(params[0],"download",100) == 0)){
                    FILE *file;
                    file = fopen(params[1], "wb");
                    n = recv(s, buf, sizeof(buf), 0);
                    fwrite(buf, sizeof(char), sizeof(buf), file);
                    fclose(file);
                } else if ((strncmp(params[0],"client",100) == 0)){
                    server = false;
                } else if (!(strncmp(params[0],"cd",100) == 0)){
                    n = recv(s, buf, sizeof(buf), 0);
                    write(1, &buf, n);
                } 
            } else {
                getcwd(currentDirectory, sizeof(currentDirectory));
                printf("CLIENT: %s $ ", currentDirectory);

                //Gets users command
                fgets(input, sizeof(input), stdin);
                input[strlen(input)-1] = '\0';
                command = strtok(input,"' '<");
                int i;
                for(i = 0; command != NULL; command=strtok(NULL, "' '<")){
                    params[i] = command;
                    i++;
                }
                params[i] = 0;

                if(strncmp(params[0],"server",100) == 0)
                    server = true;
                else if(strncmp(params[0],"client",100) == 0)
                    printf("Already accessing client commands.\n");
                else {
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
                                    printf("Invald directory.\n");
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
                            printf("Must be using server to quit.\n");
                        } else {
                            execvp(params[0], params);
                        }
                        //printf ("%s: Not a valid command.\n", params[0]);
                    } else {
                        //The parent waits for the child to finish
                        wait(0);
                    }
                }
            }
        }
    }
    close(s);
    printf("Client Program Terminated...\n");
    exit(0);
 }