//initializes/defines pin connections
int inputpin= 0;
//sets ground pin to LOW and input pin to HIGH
void setup()
{
 Serial.begin(9600);
}

//main loop- Reads the raw value from the output pin and prints it out
void loop()
{
 int rawvalue= analogRead(inputpin);
 Serial.println(rawvalue);
 delay(100);
}

