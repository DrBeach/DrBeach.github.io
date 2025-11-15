# Idle Power Generation Game

## Description

This is an incremental idle game where you take on the role of a power magnate. Your goal is to build a power empire from the ground up, starting with simple pedal-powered machines and growing to manage a massive network of advanced power sources.

## How to Play

The core of the game revolves around generating power, selling it for credits, and reinvesting those credits to expand your operations. You'll hire workers, purchase new and more efficient power generators, and research upgrades to boost your output.

As you progress, you can hire managers to automate tasks, allowing you to focus on strategy and long-term growth. The game continues to run in the background, so you can return to see the fruits of your automated labor.

### Factory Floor

This is where you start. You can hire workers and purchase power generators like:

- **Pedal Machines**: The most basic power source, requiring workers to operate.
- **Solar Panels**: A more advanced option that generates power passively.
- **Wind Turbines**: Even more powerful, but also more expensive.

### Laboratory

Here, you can invest in research to upgrade your equipment, increasing its power output. Upgrades have a chance to fail, but you can increase the odds of success by hiring engineers.

### Management

Once you've accumulated enough wealth, you can hire managers to automate the purchasing of workers and equipment. You can also unlock special abilities, like negotiating power prices for a temporary income boost.

### Engineers

Hiring engineers will passively increase the success chance of your upgrades over time, making them a crucial investment for long-term growth.

### Dashboard

Keep an eye on your progress with graphs that track your credit and power generation history, giving you a visual representation of your empire's growth.

### Admin

For those who want to speed things up, the Admin panel offers a couple of cheat buttons to add extra credits, as well as a slider to control the game speed.

## File Structure

- `index.html`: The main entry point of the game, containing the structure of the user interface.
- `interface.css`: The stylesheet for the game, defining the look and feel of the UI.
- `main.js`: The heart of the game, containing all the game logic, including calculations, upgrades, and automation.

## World Simulation

A significant component of this game is the interactions of systems. Many of the world and transmission variables are interconnected, creating a dynamic and emergent gameplay experience. Here are some of the key relationships:

- **Time of Day**: The time of day affects the temperature and the price of power, with both peaking in the middle of the day.
- **Temperature**: The temperature is influenced by the time of day, but it also has its own random fluctuations. It directly impacts the efficiency of your power lines, with hotter temperatures leading to greater power loss. It also affects the power demand, with extreme temperatures (both hot and cold) increasing the demand for power.
- **Society's Well-being**: This is a measure of how happy your citizens are. It's affected by the temperature, with citizens preferring a comfortable 22°C. It also has a small impact on the price of power, with a happier populace being willing to pay a little more.
- **Households**: The number of households you're supplying power to affects the power demand. More households mean more demand, but they also put a greater strain on your power lines, leading to a decrease in efficiency.

## Development Roadmap

### Version 0.1.3 (Current)
- Updated documentation to reflect all current features.
- Updated game version to 0.1.3.

### Version 0.1.2
- Added Wind Turbines as a new power source.
- Introduced Engineers, who provide a passive boost to upgrade chances.
- Added a dynamic game speed controller to the Admin panel.

### Version 0.1.1
- Added Solar Panels as a new power source.
- Implemented Manager Controls for automation.
- Added Manager Upgrades to unlock new abilities.

### Version 0.1.0
- Initial release of the game.

## Future Development

This game is an ongoing project. Future updates may include:

- New types of power generators (e.g., nuclear reactors).
- More complex upgrade paths and research trees.
- A more dynamic market for power prices.
- Achievements and milestones to reward progress.

All of these variables will be in the top section, the idea being it being a mega dashboard of variables that are moving around and when you start the game you can't really do a lot to modify them, but as you progress, open more tabs, get more upgrades, you can start changing the nature of the very world around you.