
//sets ground pin to LOW and input pin to HIGH
void setup()
{
 Serial.begin(9600);
}

int getIndexOfMaximumValue(int* array, int size){
 int maxIndex = 0;
 int max = array[maxIndex];
 for (int i=1; i<size; i++){
   if (max<array[i]){
     max = array[i];
     maxIndex = i;
   }
 }
 return maxIndex;
}


bool isIncreasing;
int lastHighestIndex;
unsigned long lastTimeMeasured;

void loop()
{
  unsigned long now = millis();

  int values[4];
  values[0] = analogRead(0);
  values[1] = analogRead(1);
  values[2] = analogRead(2);
  values[3] = analogRead(3);

  int maxIndex = getIndexOfMaximumValue(values, 4);
  if (values[maxIndex] > 600 && maxIndex != lastHighestIndex) {

    if (maxIndex == lastHighestIndex + 1 || (lastHighestIndex == 3 && maxIndex == 0)) {
      isIncreasing = true;
    } else if (maxIndex + 1 == lastHighestIndex || (lastHighestIndex == 0 && maxIndex == 3)) {
      isIncreasing = false;
    }

   lastHighestIndex = maxIndex; 
   lastTimeMeasured = now;

//    Serial.print("Found idx: ");
//    Serial.print(lastHighestIndex);
//    Serial.print(", val:  ");
//    Serial.print(values[maxIndex]);
//    Serial.print(", increasing:  ");
//    Serial.println(isIncreasing);
  }
  if (now - lastTimeMeasured > 300) {
    int foundSlot = (lastHighestIndex * 2) +1;

    if (values[lastHighestIndex] < 575 && isIncreasing == true) {
      foundSlot = foundSlot + 1;
    } else if (values[lastHighestIndex] < 575 && isIncreasing == false) {
      foundSlot = foundSlot - 1;
    }
   Serial.print("Last highest: ");
   Serial.print(lastHighestIndex );
   Serial.print(", curr val: ");
   Serial.print(values[lastHighestIndex]);
   Serial.print(", found slot: ");
   Serial.println(foundSlot);
  }
  /*
   Serial.print(values[0]);
   Serial.print(" - ");
   Serial.print(values[1]);
   Serial.print(" - ");
   Serial.print(values[2]);
   Serial.print(" - ");
   Serial.print(values[3]);
   Serial.println();
  */
 
 delay(100);
}

