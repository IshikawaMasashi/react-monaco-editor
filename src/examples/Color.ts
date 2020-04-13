export const COLOR = `
'
' COLOR statement
' The statement COLOR allows you to change the color of the text.
' Once changed, all output will be in the new color until COLOR. 
' 
' COLOR [foreground],[background]
'
' The colors are designated by numbers
'
' ---------------------------------------------------------
' | 0 | Black	             |  8| 	Dark Grey (Light Black) | 
' | 1 | Blue	             |  9| 	Light Blue              | 
' | 2 | Green	             | 10| 	Light Green             | 
' | 3 | Cyan	             | 11| 	Light Cyan              | 
' | 4 | Red	               | 12| 	Light Red               | 
' | 5 | Purple	           | 13| 	Light Purple            | 
' | 6 | Brown       	     | 14| 	Yellow (Light Orange)   | 
' | 7 | Light Grey (White) | 15| 	White (Light White)     | 
' ----------------------------------------------------------

' Eample1)  Black(0) characters on white(15) screen
COLOR 0,15
PRINT 2^4

' Eample2)  Yellow(14) characters on Red(4) screen
COLOR 14,4
PRINT 10^4`;
