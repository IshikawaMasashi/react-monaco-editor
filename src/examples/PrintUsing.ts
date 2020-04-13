export const PRINTUSING = `
X = 1234567890
Y = 1234
Z = 123

PRINT USING "#,###,###,###"; X 
PRINT USING "#,###,###,###"; Y
PRINT USING "#,###,###,###"; Z

P=3.141592
Q = 2 * P
R = 0.5
PRINT USING "#.###"; P

PRINT USING "#.### #.##"; P;Q

PRINT USING "#.###"; R

data =  123.456
PRINT USING "###.###^^^^"; data 

data = 123456789123456789123456789123456789
PRINT USING "###.###^^^^"; data  

data = 0.12345
PRINT USING "###.####^^^^"; data  
`;
