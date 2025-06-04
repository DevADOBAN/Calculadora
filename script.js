// Variáveis globais
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;
let history = [];

// Elementos DOM
const currentOperationScreen = document.getElementById('currentOperation');
const previousOperationScreen = document.getElementById('previousOperation');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');
const clearHistoryBtn = document.getElementById('clearHistory');

// Botões
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => appendNumber(button.textContent));
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => chooseOperation(button.dataset.operation));
});

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
themeToggle.addEventListener('click', toggleTheme);
clearHistoryBtn.addEventListener('click', clearHistory);

// Adicionar suporte ao teclado
document.addEventListener('keydown', handleKeyboardInput);

// Funções da calculadora
function appendNumber(number) {
    if (currentOperand === '0' || shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    
    // Evitar múltiplos pontos decimais
    if (number === '.' && currentOperand.includes('.')) return;
    
    currentOperand += number;
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        evaluate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    
    updateDisplay();
}

function evaluate() {
    if (operation === null || shouldResetScreen) return;
    
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                computation = 'Erro!';
            } else {
                computation = prev / current;
            }
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }
    
    // Salvar no histórico
    const historyEntry = {
        expression: `${previousOperand} ${operation} ${currentOperand}`,
        result: computation
    };
    
    history.unshift(historyEntry);
    updateHistory();
    
    // Atualizar display
    currentOperand = computation.toString();
    operation = null;
    previousOperand = '';
    shouldResetScreen = true;
    
    updateDisplay();
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    updateDisplay();
}

function deleteNumber() {
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') currentOperand = '0';
    updateDisplay();
}

function updateDisplay() {
    currentOperationScreen.textContent = formatDisplayNumber(currentOperand);
    
    if (operation !== null) {
        previousOperationScreen.textContent = `${formatDisplayNumber(previousOperand)} ${getOperationSymbol(operation)}`;
    } else {
        previousOperationScreen.textContent = '';
    }
}

function formatDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('pt-BR', {
            maximumFractionDigits: 0
        });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function getOperationSymbol(operation) {
    switch (operation) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        case '%': return '%';
        default: return operation;
    }
}

// Funções de histórico
function updateHistory() {
    historyList.innerHTML = '';
    
    // Limitar histórico a 10 itens
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        const expressionSpan = document.createElement('span');
        expressionSpan.className = 'history-expression';
        expressionSpan.textContent = item.expression + ' =';
        
        const resultSpan = document.createElement('span');
        resultSpan.className = 'history-result';
        resultSpan.textContent = item.result;
        
        historyItem.appendChild(expressionSpan);
        historyItem.appendChild(resultSpan);
        
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    history = [];
    updateHistory();
}

// Função de tema
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Função para lidar com entrada do teclado
function handleKeyboardInput(e) {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
        chooseOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        evaluate();
    } else if (e.key === 'Escape') {
        clear();
    } else if (e.key === 'Backspace') {
        deleteNumber();
    }
}

// Inicializar display
updateDisplay();