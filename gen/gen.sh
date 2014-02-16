#! /bin/bash

words=`cat words.txt`;
index=0;
outDir=`date`
mkdir "${outDir}"

while [ "$words" != "" ]; do 
	word=`echo $words | sed 's/\([^ ]*\) *.*/\1/'`;
	words=`echo $words | sed 's/[^ ]* *\(.*\)/\1/'`;
	echo Synthesizing $word ...;
	echo $word | text2wave -eval temp.scm -scale 1.8 -o "${outDir}/word_${index}_1.wav";
	sox "${outDir}/word_${index}_1.wav" "${outDir}/word_${index}_1t.wav" tempo -s 1.7;
	sox "${outDir}/word_${index}_1.wav" "${outDir}/word_${index}_2.wav" tempo -s 0.85;
	sox "${outDir}/word_${index}_1.wav" "${outDir}/word_${index}_3.wav" tempo -s 0.566;
	sox "${outDir}/word_${index}_1.wav" "${outDir}/word_${index}_4.wav" tempo -s 0.425;
	sox "${outDir}/word_${index}_1.wav" "${outDir}/word_${index}_5.wav" tempo -s 0.34;
	rm "${outDir}/word_${index}_1.wav";
	mv "${outDir}/word_${index}_1t.wav" "${outDir}/word_${index}_1.wav";
	lame -q 2 -m m "${outDir}/word_${index}_1.wav" "${outDir}/word_${index}_1.mp3";
	lame -q 2 -m m "${outDir}/word_${index}_2.wav" "${outDir}/word_${index}_2.mp3";
	lame -q 2 -m m "${outDir}/word_${index}_3.wav" "${outDir}/word_${index}_3.mp3";
	lame -q 2 -m m "${outDir}/word_${index}_4.wav" "${outDir}/word_${index}_4.mp3";
	lame -q 2 -m m "${outDir}/word_${index}_5.wav" "${outDir}/word_${index}_5.mp3";
	oggenc "${outDir}/word_${index}_1.wav";
	oggenc "${outDir}/word_${index}_2.wav";
	oggenc "${outDir}/word_${index}_3.wav";
	oggenc "${outDir}/word_${index}_4.wav";
	oggenc "${outDir}/word_${index}_5.wav";
	rm "${outDir}/word_${index}_1.wav";
	rm "${outDir}/word_${index}_2.wav";
	rm "${outDir}/word_${index}_3.wav";
	rm "${outDir}/word_${index}_4.wav";
	rm "${outDir}/word_${index}_5.wav";
	index=$[$index+1];
done
