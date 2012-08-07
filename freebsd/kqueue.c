#include <sys/types.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/event.h>
#include <sys/time.h>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>

int printer_ready;
char * printer;
char * queue_dir;
char * trigger;
#define BUFLEN 50
char queue_dir_new[BUFLEN];
char trigger_cmd[BUFLEN];

int open_and_subscribe(struct kevent * change, const char * path)
{
	int f;
	f = open(path, O_RDONLY);
	if (f == -1) {
		perror("open");
		return -1;
	}

	EV_SET(change, f, EVFILT_VNODE,
	                  EV_ADD | EV_ENABLE | EV_ONESHOT,
	                  NOTE_DELETE | NOTE_EXTEND |
	                  NOTE_WRITE | NOTE_ATTRIB,
	       0, 0);
}

int check_printer_status(){
	struct stat buf;
	//printf("%s\n", printer);
	int r = stat(printer, &buf);
	if (r<0) {
		if (printer_ready != 0) {
			printf("Printer offline\n");
		}
		printer_ready = 0;
		if (errno == ENOENT) {
			printf("Printer not detected\n");
		} else {
			perror("stat");
			return -1;
		}
	} else {
		if (printer_ready != 1) {
			printf("Printer online\n");
			print_loop(printer, queue_dir);
		}
		printer_ready = 1;
	}
	return 0;
}

int print_loop()
{
	FILE * p;
	int status;
	char buf[BUFLEN];
	printf("Print loop\n");
	p = popen(trigger_cmd, "r");
	if (p == NULL)
		perror("popen");
	while (fgets(buf, BUFLEN, p) != NULL)
		printf("%s", buf);
	status = pclose(p);
	if (status != 0) {
		printf("Trigger exited with status %d\n", status);
	}
	return status;
}

int main(int argc, const char * argv[])
{
	int fd, fq, kq, nev;
	struct kevent change;
	struct kevent event;

	int len;

	if (argc != 4) {
		fprintf(stderr, "usage: %s printer queue_dir trigger\n", argv[0]);
		return -1;
	}
	printer = strdup(argv[1]);
	queue_dir = strdup(argv[2]);
	trigger = strdup(argv[3]);

	len = snprintf(trigger_cmd, BUFLEN, "%s %s %s", trigger, printer, queue_dir);
	if (len >= BUFLEN - 1) {
		printf("Buffer too small\n");
		return -1;
	}

	len = snprintf(queue_dir_new, BUFLEN, "%s/new", queue_dir);
	if (len >= BUFLEN - 1) {
		printf("Buffer too small\n");
		return -1;
	}

	printer_ready = 0;

	kq = kqueue();
	if (kq == -1)
		perror("kqueue");

	fq = open_and_subscribe(&change, queue_dir_new);

	struct timespec timeout;
	timeout.tv_sec = 5;
	timeout.tv_nsec = 0;

	check_printer_status();
	for (;;) {
		nev = kevent(kq, &change, 1, &event, 1, &timeout);
		if (nev == -1)
			perror("kevent");
		if (nev == 0) { // timeout
			check_printer_status();
		} else if (nev > 0) {
			if (event.fflags & NOTE_DELETE) {
				continue;
			}
			printf("Got event for %d\n", event.ident);
			if (printer_ready) {
				print_loop(printer, queue_dir, trigger);
			}
		}
	}

	close(kq);
	close(fq);
	close(fd);
	return EXIT_SUCCESS;
}
