# Idle Power Generation Game

## Description

This is an incremental idle game where you take on the role of a power magnate. Your goal is to build a power empire from the ground up, starting with simple pedal-powered machines and growing to manage a massive network of advanced power sources.

## Core Game Mechanics

This section provides a technical breakdown of the core formulas and systems that govern the game's simulation.

### Power Generation

Power generation is the primary driver of the game. The total power generated (`current_gen`) is the sum of the power produced by all active generator types.

#### Pedal Machines

The most basic power source, requiring one worker per machine for optimal output.

-   **Power Formula:**
    ```
    Power = min(Workers, Machines) * Efficiency * (1 + Level / 10)
    ```
-   **Description:** The power output is limited by the lesser of the number of workers or machines. Efficiency and level are increased through upgrades.

#### Solar Panels

A passive power source that generates a consistent amount of power.

-   **Power Formula:**
    ```
    Power = Panels * Efficiency * (1 + Upgrades / 10)
    ```
-   **Description:** A straightforward formula where output scales linearly with the number of panels and their upgrade level.

#### Wind Turbines

A more advanced and powerful passive generator.

-   **Power Formula:**
    ```
    Power = Turbines * Efficiency * (1 + Upgrades / 10)
    ```
-   **Description:** Similar to solar panels, but with a higher base efficiency and cost.

### Upgrades

Upgrades are a core progression mechanic, allowing you to increase the efficiency of your generators. All upgrades are probabilistic.

#### Upgrade Chance

The success chance of an upgrade is determined by a base chance, a diminishing return bonus from previous successful upgrades, and a bonus from hired engineers.

-   **Generic Upgrade Formula:**
    ```
    Success Chance = BaseChance + (DiminishingFactor * Upgrades) / (Upgrades + Constant) + EngineerBonus
    ```
-   **Description:** The diminishing return component ensures that stacking upgrades becomes progressively less effective, encouraging investment in engineers for a more reliable long-term bonus. The `EngineerBonus` is accumulated over time based on the number of engineers. Upon a successful upgrade, the `EngineerBonus` for that specific generator is reset to zero.

#### Upgrade Cost

The cost of an upgrade attempt is always deducted, but the cost for the *next* upgrade only increases upon a successful roll.

-   **Generic Cost Formula:**
    ```
    NextUpgradeCost = CurrentUpgradeCost * Multiplier
    ```
-   **Description:** Successful upgrades for Solar Panels and Wind Turbines increase the next attempt's cost by 80% (`Multiplier = 1.8`). Pedal Machine upgrade costs are calculated differently based on their level and current efficiency.

### Economics

The in-game economy is centered around generating power, selling it for credits, and reinvesting those credits.

#### Income

Income is calculated per game tick (5 minutes of in-game time) and is based on the amount of power sold.

-   **Income Formula:**
    ```
    Income = SoldPower * PowerPrice * PriceMultiplier
    ```
-   **Sold Power:** `SoldPower` is the lesser of power generated (after transmission losses) and total power demand.
-   **Power Price:** The `PowerPrice` fluctuates based on a day/night cycle, society's well-being, and a random drift.
-   **Price Multiplier:** A temporary bonus that can be activated via the "Negotiate Price" feature.

#### Asset Costs

The cost of purchasing new assets (generators, workers, managers) increases with each purchase to create a scaling challenge.

-   **Generator Cost Formula:**
    ```
    Cost = BaseCost * (GrowthFactor ^ Count) + (Count * (TierFactor ^ Tier))
    ```
-   **Description:** The cost follows an exponential curve based on the `GrowthFactor`. Additionally, a "Tiered Growth" component adds a significant cost increase when certain milestones (10, 25, 50, 100 units) are reached.
-   **Worker Cost:** Workers have no initial hiring cost, but incur a recurring upkeep cost per game tick.
-   **Manager Cost:** The purchase price for a Manager increases by 50% with each unit bought.

### World Simulation

The game features a simplified world simulation that creates a dynamic environment affecting gameplay.

#### Power Demand

The total power required by all households in the grid.

-   **Demand Formula:**
    ```
    Demand = Households * (BaseDemand + TimeOffset + TempBonus) * (0.5 + WellBeing * 0.5)
    ```
-   **Description:** Demand is driven by the number of households. It fluctuates with a day/night cycle (`TimeOffset`), increases during extreme temperatures (`TempBonus`), and is modified by the overall `WellBeing` of the society.

#### Transmission Efficiency

Represents power loss as it travels from the plant to the households.

-   **Powerline Efficiency Formula:**
    ```
    Efficiency = (0.99 ^ Households) - TempPenalty
    ```
-   **Description:** Efficiency decreases with the number of households (representing distance/load) and is negatively impacted by high temperatures (`TempPenalty`), which simulates line sag and resistance.

#### Temperature

The ambient temperature follows a daily cycle with some random variation.

-   **Temperature Formula:**
    ```
    Temp = Base + (Amplitude * cos(TimeOfDay)) + Drift
    ```
-   **Description:** Temperature follows a cosine wave, peaking midday. A random `Drift` is applied to create smooth, unpredictable fluctuations.

## Development Roadmap

This roadmap outlines planned features in a granular, task-oriented format. Each task is designed to be a self-contained unit of work.

### Version 0.2.0: Economic Overhaul

#### ECO-01: Worker Upkeep

-   **Description:** Implement a recurring cost for hired workers to create a more dynamic economic challenge.
-   **Tasks:**
    -   [x] Add a `worker_upkeep_cost` global variable (e.g., set to 0.1 credits per tick).
    -   [x] In the `getCredits` function, subtract `workers * worker_upkeep_cost` from `current_credits` each tick.
    -   [x] Rename `work_cost` to `worker_upkeep_cost` for clarity.
    -   [x] Update the UI to display the total upkeep cost per tick.

#### ECO-02: Salaried Managers

-   **Description:** Transition managers from a one-time purchase to a salaried position with a recurring upkeep cost.
-   **Tasks:**
    -   [ ] Add a `manager_upkeep_cost` global variable (e.g., set to 10 credits per tick).
    -   [ ] In the `getCredits` function, subtract `managers * manager_upkeep_cost` from `current_credits` each tick.
    -   [ ] Adjust the initial `manager_cost` to be lower to reflect the new upkeep mechanic.
    -   [ ] Update the UI to show the total manager salary per tick.

### Version 0.3.0: Advanced Simulation

#### SIM-01: Dynamic Power Price Modifiers

-   **Description:** Introduce more gameplay-driven factors that influence the price of power.
-   **Tasks:**
    -   [ ] Create a "Market Stability" variable that affects price volatility. Low stability = wider price swings.
    -   [ ] Add an upgrade path in the Laboratory to improve Market Stability.
    -   [ ] Link power grid reliability (e.g., avoiding brownouts) to Society's Well-being, which in turn affects the power price.

#### SIM-02: Demonic Portals

-   **Description:** Introduce a high-risk, high-reward upgrade path for Pedal Machines.
-   **Tasks:**
    -   [ ] Add a "Sacrifice Worker" button to the Pedal Machine section.
    -   [ ] Clicking the button consumes one worker for a chance to upgrade a Pedal Machine into a "Demonic Portal."
    -   [ ] Demonic Portals generate significantly more power but have a chance to randomly consume additional workers.

## File Structure

-   `index.html`: The main entry point of the game, containing the structure of the user interface.
-   `interface.css`: The stylesheet for the game, defining the look and feel of the UI.
-   `main.js`: The heart of the game, containing all the game logic, including calculations, upgrades, and automation.
