#!/bin/sh

printer="$1"
queue_dir="$2"
printed_dir=$queue_dir/printed/

mkdir -p $printed_dir

printqueue(){
	ls $queue_dir/new/* 2>/dev/null
}

queuedepth=$(printqueue | wc -l)

if [ ! -c "$printer" ] ; then
	printf "labelprinter is offline, there are %d jobs in queue\n" $queuedepth >&2
	exit 1
fi

for file in $(printqueue); do
	echo printing $file
	./ql570/ql570 $printer $file
	status=$?
	if [ $status -ne 0 ] ; then
		exit $status
	fi
	mv $file $printed_dir
done

exit 0
