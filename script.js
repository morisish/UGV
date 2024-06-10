let gamepadIndex;

const buttonNames = {
    0: 'A',
    1: 'B',
    2: 'X',
    3: 'Y',
    4: 'Left Bumper',
    5: 'Right Bumper',
    6: 'Left Trigger',
    7: 'Right Trigger',
    8: 'Back',
    9: 'Start',
    10: 'Left Stick',
    11: 'Right Stick',
    12: 'D-Pad Up',
    13: 'D-Pad Down',
    14: 'D-Pad Left',
    15: 'D-Pad Right',
    16: 'Home'
};

const ws = new WebSocket('ws://193.219.75.91:8001');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (message) => {
    console.log('Received:', message.data);
};

function sendGamepadData(gamepad) {
    const data = {
        axes: gamepad.axes,
        buttons: gamepad.buttons.map(button => button.pressed)
    };
    ws.send(JSON.stringify(data));
}

function updateStatus() {
    const status = document.getElementById('status');
    const axes = document.getElementById('axes');
    const buttons = document.getElementById('buttons');

    if (gamepadIndex !== undefined) {
        const gamepad = navigator.getGamepads()[gamepadIndex];

        if (gamepad) {
            status.textContent = `Gamepad connected: ${gamepad.id}`;

            // Display axes
            axes.innerHTML = '';
            gamepad.axes.forEach((axis, index) => {
                axes.innerHTML += `Axis ${index}: ${axis.toFixed(2)}<br>`;
            });

            // Display buttons
            buttons.innerHTML = '';
            gamepad.buttons.forEach((button, index) => {
                const buttonName = buttonNames[index] || `Button ${index}`;
                buttons.innerHTML += `${buttonName}: ${button.pressed ? 'Pressed' : 'Released'}<br>`;
            });

            // Send gamepad data to server
            sendGamepadData(gamepad);
        } else {
            status.textContent = 'No gamepad connected.';
            axes.innerHTML = '-';
            buttons.innerHTML = '-';
        }
    } else {
        status.textContent = 'No gamepad connected.';
    }

    requestAnimationFrame(updateStatus);
}

window.addEventListener('gamepadconnected', (event) => {
    gamepadIndex = event.gamepad.index;
    console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
        event.gamepad.index, event.gamepad.id,
        event.gamepad.buttons.length, event.gamepad.axes.length);
    updateStatus();
});

window.addEventListener('gamepaddisconnected', (event) => {
    console.log('Gamepad disconnected from index %d: %s',
        event.gamepad.index, event.gamepad.id);
    gamepadIndex = undefined;
    updateStatus();
});

updateStatus();
