# Game Development Prompt: Cat and Mice

## 1. Overview

Create a 2D game where a player-controlled cat tries to catch mice. Mice try to reach safe houses.

## 2. Game Entities

* **Cat (🐈):**
    * Player-controlled.
    * Moves in four directions (up, down, left, right) based on keyboard arrow key input.
    * Moves one tile at a time with each keypress. The cat cannot enter any houses.
* **Mice (🐁):**
    * AI-controlled.
    * Move automatically when the cat moves.
    * There are three mice on the board. They will automatically move one step closer to the nearest available house, but only on **every other move** the cat makes.
    * Their goal is to reach an empty house.
    * If caught by the cat (i.e., cat occupies the same position), they disappear from the game.
* **Houses (🏠):**
    * Static locations on the game map.
    * Each house can shelter only one mouse.
    * Once a mouse enters a house, it is safe and cannot be caught.
    * There are three houses.
    * When a mouse enters a house, the house's icon changes (🏡) and it develops a glow to show it's occupied.

## 3. Game Mechanics

* **Player Control:**
    * The player controls the cat using the arrow keys (Up, Down, Left, Right).
* **Mouse Movement:**
    * Whenever the cat moves one step, each active mouse (not caught and not in a house) also moves one step.
    * The mice should move intelligently towards the nearest available (unoccupied) house. You can use a simple pathfinding algorithm (e.g., A* or a basic distance heuristic) to guide their movement.
    * If multiple houses are equidistant, the mouse can choose one randomly or based on a predefined priority.
* **Collision Detection:**
    * **Cat and Mouse:** If the cat's new position is the same as a mouse's position, the mouse is "caught" and should be removed from the game.
    * **Mouse and House:** If a mouse's new position is the same as an empty house's position, the mouse enters the house. It is now safe and no longer moves. That house becomes occupied.
* **House Occupancy:**
    * A house can only hold one mouse. Mice should not target or attempt to enter occupied houses.

## 4. Game State & Objectives

* **Initial State:**
    * The cat, mice, and houses are placed at predefined starting positions on the game grid/map. Ensure they don't start on top of each other.
* **Game Continues As Long As:**
    * There are mice that are not caught and not in a house.
* **Possible End Conditions (Define winning/losing if desired, or simply state when the game ends):**
    * **All Mice Safe:** All 3 mice have reached houses. (Player/Cat loses or game ends)
    * **All Mice Caught:** All 3 mice have been caught by the cat. (Player/Cat wins or game ends)
    * **No More Moves Possible:** If a state is reached where remaining mice cannot reach remaining empty houses (e.g., cat blocks paths indefinitely - this might be more complex to implement, consider if essential).
*   **Winning:** You win if you catch all three mice by moving onto their tiles.
*   **Losing:** You lose if all three mice make it safely into houses.

## 5. Visuals & Interface

* Represent entities with following shapes
    *   **The Cat (🐈):** 
    *   **The Mice (🐁):**
    *   **The Houses (🏠):** When a mouse enters a house, the house's icon changes (🏡) and it develops a glow to show it's occupied.
* Display the game on a grid.
* Display a counter for caught mice and safe mice.


## 6. Technical Considerations (Optional - for the AI)

* The game can be implemented using a simple grid-based system.
* Define the size of the game grid.
* Consider edge cases (e.g., what happens if a mouse has no path to any house?).

## Features

* **Randomized Layout:** The cat, mice, and houses are placed in random positions at the start of every game.
* **Visual Feedback:** The game uses emojis for all characters and provides clear visual cues, such as glowing "lights on" for occupied houses.
* **Reset Button:** After the game ends, a "Play Again" button will appear, allowing you to start a new round with a fresh, random layout.


## 7. Example Scenario Flow

1.  Game starts. Cat, 3 Mice, 3 Houses are on the grid.
2.  Player presses the 'Right Arrow' key.
3.  The cat moves one position to the right.
4.  Simultaneously, each of the 3 active mice moves one position closer to their respective nearest empty house.
5.  Check for collisions:
    * If the cat landed on a mouse, that mouse is removed.
    * If a mouse landed on an empty house, that mouse is now safe, and the house is occupied.
6.  Repeat from step 2.


Built with HTML, CSS, and vanilla JavaScript.