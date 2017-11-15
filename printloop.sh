#!/bin/sh

printer="/dev/labelprinter"
queuedir=queue

print_queue(){
	./trigger.sh "$printer" "$queuedir"
}

print_queue
while true; do
	inotifywait --quiet --timeout 30 "$queuedir/new"
	print_queue
done
