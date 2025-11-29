import { Text, View, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { APP_CONFIG } from '../config';

export default function Calculator() {
  const router = useRouter();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumberPress = (num: string) => {
    Vibration.vibrate(10);
    
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
    
    // Update equation display
    if (operator && currentValue) {
      setEquation(`${currentValue} ${operator} ${waitingForOperand ? num : (display === '0' ? num : display + num)}`);
    }
  };

  const handleOperatorPress = (nextOperator: string) => {
    Vibration.vibrate(10);
    const inputValue = display;

    if (currentValue === '') {
      setCurrentValue(inputValue);
      setEquation(`${inputValue} ${nextOperator}`);
    } else if (operator) {
      const currentVal = parseFloat(currentValue);
      const inputVal = parseFloat(inputValue);
      let result = currentVal;

      switch (operator) {
        case '+':
          result = currentVal + inputVal;
          break;
        case '-':
          result = currentVal - inputVal;
          break;
        case '×':
          result = currentVal * inputVal;
          break;
        case '÷':
          result = inputVal !== 0 ? currentVal / inputVal : 0;
          break;
      }

      setDisplay(String(result));
      setCurrentValue(String(result));
      setEquation(`${result} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    Vibration.vibrate(10);
    const inputValue = display;

    if (operator && currentValue !== '') {
      const currentVal = parseFloat(currentValue);
      const inputVal = parseFloat(inputValue);
      let result = currentVal;

      switch (operator) {
        case '+':
          result = currentVal + inputVal;
          break;
        case '-':
          result = currentVal - inputVal;
          break;
        case '×':
          result = currentVal * inputVal;
          break;
        case '÷':
          result = inputVal !== 0 ? currentVal / inputVal : 0;
          break;
      }

      // Check for unlock code pattern: UNLOCK_CODE + any_number
      const equation = `${currentValue}${operator}${inputValue}`;
      if (currentValue === APP_CONFIG.UNLOCK_CODE && operator === '+') {
        // Navigate to webview with the equation
        router.push(`/webview?unlock=${encodeURIComponent(equation)}`);
        return;
      }

      setDisplay(String(result));
      setCurrentValue('');
      setOperator('');
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    Vibration.vibrate(10);
    setDisplay('0');
    setEquation('');
    setCurrentValue('');
    setOperator('');
    setWaitingForOperand(false);
  };

  const handleDecimal = () => {
    Vibration.vibrate(10);
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handlePercentage = () => {
    Vibration.vibrate(10);
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleToggleSign = () => {
    Vibration.vibrate(10);
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const Button = ({ value, onPress, style, textStyle }: any) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <Button value="C" onPress={handleClear} style={styles.functionButton} />
          <Button value="±" onPress={handleToggleSign} style={styles.functionButton} />
          <Button value="%" onPress={handlePercentage} style={styles.functionButton} />
          <Button value="÷" onPress={() => handleOperatorPress('÷')} style={styles.operatorButton} />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <Button value="7" onPress={() => handleNumberPress('7')} />
          <Button value="8" onPress={() => handleNumberPress('8')} />
          <Button value="9" onPress={() => handleNumberPress('9')} />
          <Button value="×" onPress={() => handleOperatorPress('×')} style={styles.operatorButton} />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <Button value="4" onPress={() => handleNumberPress('4')} />
          <Button value="5" onPress={() => handleNumberPress('5')} />
          <Button value="6" onPress={() => handleNumberPress('6')} />
          <Button value="-" onPress={() => handleOperatorPress('-')} style={styles.operatorButton} />
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <Button value="1" onPress={() => handleNumberPress('1')} />
          <Button value="2" onPress={() => handleNumberPress('2')} />
          <Button value="3" onPress={() => handleNumberPress('3')} />
          <Button value="+" onPress={() => handleOperatorPress('+')} style={styles.operatorButton} />
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <Button value="0" onPress={() => handleNumberPress('0')} style={styles.zeroButton} />
          <Button value="." onPress={handleDecimal} />
          <Button value="=" onPress={handleEquals} style={styles.operatorButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 24,
  },
  displayText: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    width: 172,
    paddingLeft: 30,
    alignItems: 'flex-start',
  },
  functionButton: {
    backgroundColor: '#a5a5a5',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '400',
  },
});
