1. Game Concept & Core Loop
Concept: A tense, timing-based arcade game where the player must move a character by tapping the screen only when the doll's head is turned away ("Green Light"). If the player taps while the doll is looking ("Red Light"), or fails to reach the goal within the time limit, they are eliminated. The goal is to travel as far as possible to achieve a high score.

Core Loop:

Player taps "Play."

The doll appears at the top of the screen. Its head begins to rotate.

Player taps to move their character forward only when the doll's head is turned away.

If the player moves during a "Red Light," they are caught and the game ends.

The player must reach a checkpoint before a timer runs out to proceed to the next, harder level.

Upon failure, their final distance is calculated as their score. They can then view their high score, share it, or play again.

2. Game Mechanics & Rules
The Doll:

Has two states: "Green Light" (head rotated away, back turned) and "Red Light" (head rotated forward, looking at the player).

The animation cycle is random but gets faster and the "Green Light" duration gets shorter as levels progress.

A distinct audio cue (e.g., a pleasant chime for Green, a sharp, alarming sound for Red) accompanies each state change.

The Player Character:

Moves forward a fixed amount with each successful tap during a "Green Light."

If the player taps during a "Red Light":

A "CAUGHT!" animation/effect plays.

The game ends immediately.

The character's movement is a simple translation along the Y-axis (from the bottom to the top of the screen).

The Timer & Levels:

Each "level" is a segment of the track, ending at a checkpoint.

A visible progress bar or countdown timer at the top of the screen shows the time left to reach the next checkpoint.

If the timer reaches zero before the player reaches the checkpoint, the game ends ("TIME'S UP!").

Successfully reaching a checkpoint:

Resets the timer for the next level.

Slightly increases the doll's rotation speed.

Slightly decreases the duration of "Green Light" phases.

The next checkpoint is placed further away.

Scoring:

The player's score is the total distance traveled in meters/units.

A bonus multiplier is applied for consecutive levels completed without failing (e.g., Level 1: 1x, Level 2: 1.1x, Level 3: 1.3x, etc.).

The High Score is saved locally on the device and is associated with the player's account (via Reddit auth).

5. UI/UX Flow
Main Menu:

Game Title

"Play" Button

"Leaderboard" Button (shows top scores from Reddit users)

"Login with Reddit" Button (if not authenticated)

Game Screen:

The doll at the top.

The player character at the bottom.

A timer/progress bar.

Current score and level indicator.

Game Over Screen:

"GAME OVER" header.

"Score: [score]"

"High Score: [high score]"

"Share Your Score" Button (generates and downloads/share the image).

"Play Again" Button.

"Main Menu" Button.