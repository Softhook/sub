# Reactor Dive

A submarine exploration game with sonar-based navigation and MOD music.

## Features

- Navigate a submarine through procedurally generated caves
- Sonar-based navigation system to detect walls and enemies
- Shoot torpedoes to destroy enemy creatures
- MOD music background soundtrack
- Highscore system with online leaderboards
- Mobile-friendly controls

## How to Play

- WASD/Arrow Keys: Move the submarine
- Space: Fire torpedo
- Sonar: Automatically scans the environment
- Reach the reactor at the end of each level while destroying the required number of enemies

## MOD Music Implementation

The game features background music implemented using an AudioWorklet-based MOD player that:

- Plays MOD music files in the background
- Adjusts volume between game states
- Processes MOD audio in a separate thread for optimal performance
- Automatically resumes music after game state transitions

## Development

This game is developed with p5.js and uses the Web Audio API for sound effects and music playback.

### Running Locally

To run the game locally, start an HTTP server in the project directory:

```
python -m http.server 8000
```

Then open your browser to `http://localhost:8000`

## Credits

Created by Christian Nold 2025
