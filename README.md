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

## Future Vision

The long-term vision for this game is to evolve it from a simple idle generator into a more complex power market simulation. The initial phase focuses on building up a power generation infrastructure. As the game progresses, the core mechanics will shift. Players will enter a competitive power market where simply producing more energy isn't enough to guarantee success. They will need to manage power distribution to different areas, navigate dynamic market prices, and even engage in political maneuvering—like lobbying or bribing local governments—to ensure their company is preferred over competitors.

## Development Roadmap

Here is a brief outline of the planned features for the next few revisions, aimed at building towards the future vision:

*   **Revision 0.3 (In Progress):** Bug Fixes & UI Improvements
    *   Fix the simulation test to prevent credits from going negative.
    *   Improve the graph by splitting it into two and adjusting the styling.
    *   Implement automated verification for the unit tests.

*   **Revision 0.4:** Introduction to the Power Market
    *   Introduce a dynamic market price for power that fluctuates.
    *   Add more advanced upgrades for generation and efficiency.

*   **Revision 0.5:** Power Distribution
    *   Unlock a new "City Map" area.
    *   Allow players to build power lines to different neighborhoods, each with unique power demands and rewards.

*   **Revision 0.6:** Political Influence
    *   Introduce a "City Hall" area.
    *   Players can spend credits on lobbying or other activities to gain advantages in the market.

*   **Revision 0.7:** AI Competitors
    *   Introduce AI-controlled companies that compete with the player in the power market, making the political and economic game more challenging.
