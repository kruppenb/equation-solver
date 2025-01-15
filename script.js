// Encouraging messages bank
const messages = {
    success: [
        "Great job! You're mastering these equations!",
        "Excellent work! Keep that mathematical momentum going!",
        "You're getting better at this with every solve!",
        "Mathematics is your friend, and you're proving it!",
        "That's the way to do it! Perfect solution!"
    ],
    attempt: [
        "Keep going! You're on the right track!",
        "Almost there! Don't give up!",
        "Practice makes perfect! Try another one!",
        "You're making progress! Keep it up!"
    ],
    help: [
        "Remember to check your equation format",
        "For linear equations, make sure to use 'x' or 'y' as variables",
        "Don't forget to include the equals sign in equations",
        "Need help? Check the example formats in the input placeholder"
    ]
};

// Main class for handling equations
class EquationSolver {
    constructor() {
        this.maxDecimalPlaces = 4;
    }

    // Main solve method that determines equation type and routes accordingly
    solve(input) {
        try {
            input = input.replace(/\s+/g, '').toLowerCase();
            
            if (input.includes('=')) {
                if (input.includes('y')) {
                    return this.solveTwoVariableSystem(input);
                } else if (input.includes('x')) {
                    return this.solveLinearEquation(input);
                }
            }
            
            return this.evaluateArithmetic(input);
        } catch (error) {
            throw new Error('Invalid equation format');
        }
    }

    // Handles basic arithmetic expressions
    evaluateArithmetic(expression) {
        const sanitizedExpr = this.sanitizeExpression(expression);
        const result = this.calculateExpression(sanitizedExpr);
        
        return {
            result: this.roundToMaxDecimals(result),
            steps: [`${expression} = ${result}`]
        };
    }

    // Solves linear equations with one variable (ax + b = c)
    solveLinearEquation(equation) {
        const [leftSide, rightSide] = equation.split('=');
        let steps = [];
        
        // Parse coefficients
        let a = 0, b = 0;
        leftSide.split(/(?=[-+])/g).forEach(term => {
            if (term.includes('x')) {
                a += parseFloat(term.replace('x', '') || '1');
            } else {
                b += parseFloat(term);
            }
        });
        
        const c = parseFloat(rightSide);
        
        steps.push(`Original equation: ${equation}`);
        steps.push(`Rearranging to standard form: ${a}x + ${b} = ${c}`);
        steps.push(`Subtracting ${b} from both sides: ${a}x = ${c - b}`);
        
        const solution = this.roundToMaxDecimals((c - b) / a);
        steps.push(`Dividing both sides by ${a}: x = ${solution}`);
        
        return {
            result: `x = ${solution}`,
            steps: steps
        };
    }

    // Solves system of two linear equations
    solveTwoVariableSystem(equations) {
        // This is a simplified version that expects one equation
        // In a full implementation, we would parse multiple equations
        throw new Error('Two-variable equation solving will be implemented in a future update');
    }

    // Safely evaluates arithmetic expressions
    calculateExpression(expr) {
        // Security measure: only allow safe mathematical expressions
        if (!/^[0-9+\-*/.() ]+$/.test(expr)) {
            throw new Error('Invalid characters in expression');
        }
        
        try {
            // Using Function instead of eval for better security
            return Function(`'use strict'; return (${expr})`)();
        } catch (error) {
            throw new Error('Invalid arithmetic expression');
        }
    }

    // Sanitizes input expression
    sanitizeExpression(expr) {
        return expr
            .replace(/[^0-9+\-*/.() ]/g, '')
            .replace(/\s+/g, '');
    }

    // Rounds number to maximum decimal places
    roundToMaxDecimals(num) {
        return Number(Math.round(num + 'e' + this.maxDecimalPlaces) + 'e-' + this.maxDecimalPlaces);
    }
}

// UI Handler
class UIHandler {
    constructor() {
        this.solver = new EquationSolver();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const equationInput = document.getElementById('equation');
        const solveButton = document.getElementById('solve');
        const clearButton = document.getElementById('clear');

        if (equationInput && solveButton && clearButton) {
            solveButton.addEventListener('click', () => this.handleSolve());
            clearButton.addEventListener('click', () => this.handleClear());
            equationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSolve();
                }
            });
        } else {
            console.error('Required DOM elements not found');
        }
    }

    handleSolve() {
        try {
            const equationInput = document.getElementById('equation');
            const solutionArea = document.getElementById('solution');
            const stepsArea = document.getElementById('steps');
            const messageArea = document.getElementById('message');
            const errorArea = document.getElementById('error');

            if (!equationInput || !solutionArea || !stepsArea || !messageArea || !errorArea) {
                console.error('Required DOM elements not found');
                return;
            }

            const input = equationInput.value.trim();

            // Clear previous results
            solutionArea.textContent = '';
            stepsArea.textContent = '';
            messageArea.textContent = '';
            errorArea.textContent = '';

            if (!input) {
                this.showError('Please enter an equation');
                return;
            }

            const solution = this.solver.solve(input);
            
            if (solution.result) {
                solutionArea.textContent = solution.result;
            }
            
            if (solution.steps && solution.steps.length > 0) {
                stepsArea.innerHTML = solution.steps
                    .map(step => `<div>${step}</div>`)
                    .join('');
            }
            
            this.showSuccessMessage();
        } catch (error) {
            console.error('Error solving equation:', error);
            this.showError(error.message || 'An error occurred while solving the equation');
            this.showHelpMessage();
        }
    }

    handleClear() {
        document.getElementById('equation').value = '';
        document.getElementById('solution').textContent = '';
        document.getElementById('steps').textContent = '';
        document.getElementById('message').textContent = '';
        document.getElementById('error').textContent = '';
    }

    showError(message) {
        const errorArea = document.getElementById('error');
        errorArea.textContent = message;
    }

    showSuccessMessage() {
        const messageArea = document.getElementById('message');
        const randomMessage = messages.success[Math.floor(Math.random() * messages.success.length)];
        messageArea.textContent = randomMessage;
    }

    showHelpMessage() {
        const messageArea = document.getElementById('message');
        const randomMessage = messages.help[Math.floor(Math.random() * messages.help.length)];
        messageArea.textContent = randomMessage;
    }
}

// Initialize the application
window.addEventListener('load', () => {
    new UIHandler();
});
