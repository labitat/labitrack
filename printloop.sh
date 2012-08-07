#!/bin/sh

printer="/dev/labelprinter"
queuedir=queue

print_queue(){
	for job in $(ls -1 "$queuedir/new"); do
		./trigger.sh "$printer" "$queuedir"
	done
}

print_queue
while inotifywait --quiet --timeout 30 "$queuedir/new"; do
	print_queue
done
