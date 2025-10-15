# Idle Power Generation Game

This is a simple idle game where you manage a power generation facility. The goal is to generate power, sell it for credits, and expand your operation by hiring workers and purchasing new machinery.

## How to Play

1.  **Generate Power:** Your facility generates power, which is measured in kW/h. The amount of power you generate depends on the number of workers and pedal machines you have.
2.  **Earn Credits:** The power you generate is automatically sold at a set price. Your credits will increase over time.
3.  **Hire Workers:** In the "Factory floor" section, you can hire workers to operate your machines. Each worker has an hourly cost.
4.  **Buy Pedal Machines:** You can also purchase "Pedal Machine (tm)" to increase your power generation capacity. The cost of each new machine increases.
5.  **Upgrade Machinery:** In the "Laboratory" section, you can invest credits to upgrade the efficiency of your pedal machines, allowing them to generate more power.
6.  **Manage Your Facility:** Keep an eye on your power generation, credit flow, and hourly costs to optimize your facility's growth.

## Project Structure

*   `index.html`: This file contains the main structure of the game's interface, including all the buttons, text, and displays.
*   `interface.css`: This file styles the visual presentation of the game, including colors, fonts, and layout.
*   `main.js`: This file contains all the game's logic, such as calculating power generation, handling purchases, and updating the display.

## Revision History

### Version 0.1

*   **Managers:** You can now hire managers in the "Management" section to automate the process of buying workers and pedal machines.
*   **Power and Credit Graphs:** A new "Dashboard" section has been added, which displays graphs of your power generation and credit history over time.
*   **Manager Efficiency Upgrade:** In the "Laboratory," you can now upgrade the efficiency of your managers, allowing them to purchase more workers and machines at a time.
*   **Power Price Negotiation:** In the "Management" section, you can now negotiate the price of power, which will temporarily double the sale price. This ability has a cooldown period.

## Development Roadmap

Here is a brief outline of the planned features for the next five revisions:

*   **Revision 0.2 (In Progress):** Quality of Life & Testing
    *   Implement a testing framework with an admin panel.
    *   Add simulation and unit tests.
    *   Adjust UI elements for better user experience (e.g., resizing the graph).

*   **Revision 0.3:** Advanced Upgrades
    *   Introduce tiered upgrades for workers and machines.
    *   Add upgrades that unlock new abilities or game mechanics.

*   **Revision 0.4:** New Resource Management
    *   Introduce a new resource (e.g., "parts" or "research points") to add more strategic depth.

*   **Revision 0.5:** Prestige System
    *   Implement a prestige mechanic that allows players to reset their game for powerful, permanent boosts.

*   **Revision 0.6:** Expanded Content
    *   Add a new type of power generator or a new area to unlock and manage.
