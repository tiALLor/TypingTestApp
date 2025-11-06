# Typing Test Application

A web-based typing test application to measure and improve your typing speed and accuracy.

## Features

- Real-time typing speed measurement
- Accuracy calculation
- Timer functionality
- Word generation system
- History tracking of previous attempts
- Clean and intuitive user interface

## Project Structure

```
├── main.html          # Main HTML file
├── css/
│   └── main.css      # Styling for the application
└── js/
    ├── config.js     # Configuration settings
    ├── elements.js   # DOM element handling
    ├── evaluate.js   # Typing evaluation logic
    ├── handlers.js   # Event handlers
    ├── history.js    # Test history management
    ├── main.js       # Main application logic
    ├── timer.js      # Timer functionality
    ├── ui.js         # User interface updates
    └── words.js      # Word generation and management
```

## Getting Started

1. Clone this repository
2. Open `main.html` in your web browser
3. Start typing to begin the test

## How to Use

1. The test will begin automatically when you start typing
2. Type the displayed words as accurately as possible
3. Your typing speed (WPM) and accuracy will be calculated in real-time
4. View your history to track your progress

## Technical Details

The application is built using:

- HTML5
- CSS3
- Vanilla JavaScript (No external dependencies)

The codebase is modular and organized into separate JavaScript files for better maintainability:

- `config.js`: Contains configuration settings
- `elements.js`: Manages DOM element references
- `evaluate.js`: Handles typing evaluation logic
- `handlers.js`: Manages event handling
- `history.js`: Tracks and stores test history
- `main.js`: Core application logic
- `timer.js`: Manages timing functionality
- `ui.js`: Handles UI updates
- `words.js`: Manages word generation and display

## Contributing

Feel free to submit issues and enhancement requests.

## License

[MIT License](LICENSE)

## Author

tiALLor
