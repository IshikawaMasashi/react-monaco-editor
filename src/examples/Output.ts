export const OUTPUT = `
OPEN "SAMPLE2" FOR OUTPUT AS #1

FOR I = 0 TO 100
   PRINT #1,"This is the line of text number " ; I
NEXT I

SEEK #1, 50,0

FOR I = 0 TO 10
  PRINT #1,STR$(-I)
NEXT I

PRINT "Please see SAMPLE2";
`;
