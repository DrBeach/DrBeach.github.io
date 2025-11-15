// Game version
var version = "0.1.3";

// Game state variables
var price_multiplier = 1;
var current_gen = 0;
var current_power_price = 2;
var current_credits = 500;
var time = 0;
var current_per_hour = 0;
var work_cost = 0.1;
var work_cost_per_hour = 0;
var workers = 0;
var p_mechs = 0;
var p_mech_eff = 0.5;
var p_mech_eff2 = p_mech_eff;
var init_p_mach_cost = 40;
var p_mech_level = 1;
var p_mech_upgrades = 0;
var solar_panel_upgrades = 0;
var wind_turbine_upgrades = 0;
var transformer_eff = 0.7;
var powerline_eff = 0.7;
var households = 4;
var power_demand = 0;
var base_household_demand = 0.5; // in kW
var temperature = 15.0;
var society_well_being = 0.8;
var temperature_drift = 0;
var price_drift = 0;

var p_mech_prototype_cost = 0;
var p_mech_upgrade_chance = 0.1;

// Manager variables
var managers = 0;
var manager_cost = 1000;
var manager_actions_per_tick = 1;
var autobuy_worker = false;
var autobuy_pedal_machine = false;
var autobuy_solar_panel = false;
var autobuy_wind_turbine = false;
var manager_enabled = false;
var manager_upgrade_solar_cost = 10000;
var manager_upgrade_wind_cost = 50000;
var manager_autobuy_unlocked = {
    solar: false,
    wind: false
};

// Engineering Manager variables
var engineering_manager_enabled = false;
var autobuy_pedal_machine_upgrade = false;
var autobuy_solar_panel_upgrade = false;
var autobuy_wind_turbine_upgrade = false;
var engineering_manager_threshold = 50;

// Cooldown and bonus variables
var negotiate_cooldown = 0;
var negotiate_bonus_duration = 0;

// Solar Panel variables
var solar_panels = 0;
var solar_panel_cost = 500;
var init_solar_panel_cost = 500;
var solar_panel_eff = 2;
var solar_panel_upgrade_cost = 1000;
var solar_panel_upgrade_chance = 0.1;

// Wind Turbine variables
var wind_turbines = 0;
var wind_turbine_cost = 2500;
var init_wind_turbine_cost = 2500;
var wind_turbine_eff = 10;
var wind_turbine_upgrade_cost = 5000;
var wind_turbine_upgrade_chance = 0.1;

// Nuclear Reactor variables
var nuclear_reactors = 0;
var nuclear_reactor_eff = 50;

// Engineer variables
var engineers = 0;
var engineer_cost = 3000;
var engineer_bonus_pm = 0;
var engineer_bonus_sp = 0;
var engineer_bonus_wt = 0;

// UI variables
var areas = ["factory_floor", "laboratory", "management", "engineers", "dashboard", "admin"];
var creditChart;
var powerChart;
var creditHistory = Array(100).fill(0);
var powerHistory = Array(100).fill(0);

// Game loop variables
var gameLoopInterval;
var gameSpeed = 1;


/**
 * Formats a number into a string with SI unit prefixes.
 * @param {number} value - The number to format.
 * @returns {string} The formatted string.
 */
function formatSI(value) {
    if (value >= 1e9) {
        return (value / 1e9).toFixed(2) + ' GW';
    }
    if (value >= 1e6) {
        return (value / 1e6).toFixed(2) + ' MW';
    }
    if (value >= 1e3) {
        return (value / 1e3).toFixed(2) + ' kW';
    }
    return value.toFixed(2) + ' W';
}

/**
 * Gets the tier of a generator based on its level.
 * @param {number} level - The level of the generator.
 * @returns {number} The tier of the generator.
 */
function getTier(level) {
    if (level > 100) {
        return 5;
    } else if (level > 50) {
        return 4;
    } else if (level > 25) {
        return 3;
    } else if (level > 10) {
        return 2;
    } else {
        return 1;
    }
}

/**
 * Initializes the game state and UI.
 */
function load() {
    updateUI();
    updateFormulas();
}

/**
 * Calculates and updates the player's credits.
 */
function getCredits() {
    var transmitted_power = current_gen * transformer_eff;
    var sold_power = Math.min(transmitted_power, power_demand);
    current_per_hour = (current_power_price * price_multiplier * sold_power) - work_cost_per_hour;
    current_per_hour = fixFloat(current_per_hour);
    current_credits = current_credits + current_per_hour;
    current_credits = fixFloat(current_credits);
};

/**
 * Shows a specific area of the UI and hides the others.
 * @param {string} area - The ID of the area to show.
 */
function show_area(area) {
    for (i = 0; i < areas.length; i++) {
        document.getElementById(areas[i]).style = "display: None;"
    }
    document.getElementById(area).style = "display: Block;"

    if (area === 'dashboard') {
        initCharts();
    }
}

/**
 * Buys a new wind turbine.
 */
function buyWindTurbine() {
    if (current_credits >= wind_turbine_cost) {
        wind_turbines++;
        current_credits -= wind_turbine_cost;
        wind_turbine_cost = Math.floor(init_wind_turbine_cost * Math.pow(1.08, wind_turbines) + wind_turbines * Math.pow(1.4, getTier(wind_turbines)));
        getCurrentGen();
        updateFormulas();
    }
}

/**
 * Upgrades the efficiency of all wind turbines.
 */
function upgradeWindTurbine() {
    if (current_credits >= wind_turbine_upgrade_cost) {
        current_credits -= wind_turbine_upgrade_cost;
        if (Math.random() < wind_turbine_upgrade_chance + (0.3 * wind_turbine_upgrades) / (wind_turbine_upgrades + 20) + engineer_bonus_wt) {
            wind_turbine_eff = fixFloat(wind_turbine_eff + 5);
            wind_turbine_upgrade_cost = Math.floor(wind_turbine_upgrade_cost * 1.8);
            wind_turbine_upgrades++;
            engineer_bonus_wt = 0;
            getCurrentGen();
            updateFormulas();
        }
    }
}

/**
 * Initializes the charts on the dashboard.
 */
function initCharts() {
    if (creditChart) {
        creditChart.destroy();
    }
    if (powerChart) {
        powerChart.destroy();
    }

    var creditCtx = document.getElementById('creditChart').getContext('2d');
    creditChart = new Chart(creditCtx, {
        type: 'line',
        data: {
            labels: Array(100).fill(""),
            datasets: [{
                label: 'Credits',
                data: creditHistory,
                borderColor: 'gold',
                fill: {
                    target: 'origin',
                    above: 'rgba(255, 215, 0, 0.2)',
                },
                tension: 0.4
            }]
        },
        options: {
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    var powerCtx = document.getElementById('powerChart').getContext('2d');
    powerChart = new Chart(powerCtx, {
        type: 'line',
        data: {
            labels: Array(100).fill(""),
            datasets: [{
                label: 'Power',
                data: powerHistory,
                borderColor: 'cyan',
                fill: {
                    target: 'origin',
                    above: 'rgba(0, 255, 255, 0.2)',
                },
                tension: 0.4
            }]
        },
        options: {
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Fixes a floating-point number to a specific number of decimal places.
 * @param {number} number - The number to fix.
 * @returns {number} The fixed number.
 */
function fixFloat(number) {
    return parseFloat(number.toFixed(1))
}

/**
 * Calculates and updates the total power generation.
 */
function getCurrentGen() {
    //p_mech gen
    var max_utility = Math.max(p_mechs, workers) - (Math.max(p_mechs, workers) - Math.min(p_mechs, workers));
    var p_mech_power = max_utility * p_mech_eff * (1 + p_mech_level / 10);

    //solar panel gen
    var solar_power = solar_panels * solar_panel_eff * (1 + solar_panel_upgrades / 10);

    //wind turbine gen
    var wind_power = wind_turbines * wind_turbine_eff * (1 + wind_turbine_upgrades / 10);

    //nuclear reactor gen
    var nuclear_power = nuclear_reactors * nuclear_reactor_eff;

    current_gen = fixFloat(p_mech_power + solar_power + wind_power + nuclear_power);
}

/**
 * Buys a new worker.
 * @param {number} number - The number of workers to buy.
 */
function buyWorker(number) {
    workers = workers + number;
    getCurrentGen()
    updateFormulas();
    var work_cost_temp = work_cost * workers;
    work_cost_temp = fixFloat(work_cost_temp)
    work_cost_per_hour = work_cost_temp
};

/**
 * Buys a new pedal machine.
 */
function buyPedalMachine() {
    var p_mech_cost = Math.floor(init_p_mach_cost * Math.pow(1.15, p_mechs) + p_mechs * Math.pow(1.2, getTier(p_mechs)));
    if (current_credits >= p_mech_cost) {
        p_mechs = p_mechs + 1
        current_credits = current_credits - p_mech_cost
        current_credits = fixFloat(current_credits)
        getCurrentGen()
        updateFormulas();
    };
};

/**
 * Upgrades the efficiency of all pedal machines.
 */
function upgradePedalMachine() {
    p_mech_prototype_cost = fixFloat(Math.pow(1.1, p_mech_level) * 10 * p_mech_eff * 2 * (60 * 1))
    if (current_credits >= p_mech_prototype_cost) {
        current_credits -= p_mech_prototype_cost;
        if (Math.random() < p_mech_upgrade_chance + (0.5 * p_mech_upgrades) / (p_mech_upgrades + 10) + engineer_bonus_pm) {
            p_mech_eff = fixFloat(p_mech_eff + 0.2);
            p_mech_eff2 = p_mech_eff;
            p_mech_level++;
            p_mech_upgrades++;
            engineer_bonus_pm = 0;
            getCurrentGen();
            updateFormulas();
        }
    }
}

/**
 * Negotiates a higher power price for a short period of time.
 */
function negotiatePowerPrice() {
    if (negotiate_cooldown === 0) {
        price_multiplier = 2;
        negotiate_cooldown = 60;
        negotiate_bonus_duration = 50; // 50 ticks * 200ms = 10 seconds
    }
}

/**
 * Buys a new solar panel.
 */
function buySolarPanel() {
    if (current_credits >= solar_panel_cost) {
        solar_panels++;
        current_credits -= solar_panel_cost;
        solar_panel_cost = Math.floor(init_solar_panel_cost * Math.pow(1.07, solar_panels) + solar_panels * Math.pow(1.3, getTier(solar_panels)));
        getCurrentGen();
        updateFormulas();
    }
}

/**
 * Upgrades the efficiency of all solar panels.
 */
function upgradeSolarPanel() {
    if (current_credits >= solar_panel_upgrade_cost) {
        current_credits -= solar_panel_upgrade_cost;
        if (Math.random() < solar_panel_upgrade_chance + (0.4 * solar_panel_upgrades) / (solar_panel_upgrades + 15) + engineer_bonus_sp) {
            solar_panel_eff = fixFloat(solar_panel_eff + 1);
            solar_panel_upgrade_cost = Math.floor(solar_panel_upgrade_cost * 1.8);
            solar_panel_upgrades++;
            engineer_bonus_sp = 0;
            getCurrentGen();
            updateFormulas();
        }
    }
}

/**
 * Upgrades the manager's capabilities to allow auto-buying of new resources.
 * @param {string} type - The type of upgrade to purchase.
 */
function upgradeManager(type) {
    switch (type) {
        case 'solar':
            if (current_credits >= manager_upgrade_solar_cost) {
                current_credits -= manager_upgrade_solar_cost;
                manager_autobuy_unlocked.solar = true;
                manager_upgrade_solar_cost = 0; // One-time purchase
            }
            break;
        case 'wind':
            if (current_credits >= manager_upgrade_wind_cost) {
                current_credits -= manager_upgrade_wind_cost;
                manager_autobuy_unlocked.wind = true;
                manager_upgrade_wind_cost = 0; // One-time purchase
            }
            break;
    }
}

/**
 * Updates the formulas displayed in the UI.
 */
function updateFormulas() {
    if (document.getElementById("p_mech_formula")) {
        document.getElementById("p_mech_formula").innerHTML = '<math><mrow><mi>min</mi><mo>(</mo><mi>Workers</mi><mo>,</mo><mi>Machines</mi><mo>)</mo><mo>&times;</mo><mi>Efficiency</mi><mo>&times;</mo><mrow><mo>(</mo><mn>1</mn><mo>+</mo><mfrac><mi>Level</mi><mn>10</mn></mfrac><mo>)</mo></mrow></mrow></math>';
    }
    if (document.getElementById("solar_panel_formula")) {
        document.getElementById("solar_panel_formula").innerHTML = '<math><mrow><mi>Panels</mi><mo>&times;</mo><mi>Efficiency</mi><mo>&times;</mo><mrow><mo>(</mo><mn>1</mn><mo>+</mo><mfrac><mi>Upgrades</mi><mn>10</mn></mfrac><mo>)</mo></mrow></mrow></math>';
    }
    if (document.getElementById("wind_turbine_formula")) {
        document.getElementById("wind_turbine_formula").innerHTML = '<math><mrow><mi>Turbines</mi><mo>&times;</mo><mi>Efficiency</mi><mo>&times;</mo><mrow><mo>(</mo><mn>1</mn><mo>+</mo><mfrac><mi>Upgrades</mi><mn>10</mn></mfrac><mo>)</mo></mrow></mrow></math>';
    }
}

/**
 * Buys a new manager.
 */
function buyManager() {
    if (current_credits >= manager_cost) {
        managers = managers + 1
        current_credits = current_credits - manager_cost
        manager_cost = Math.floor(manager_cost * 1.5)
    }
}

/**
 * Toggles the auto-buy feature for a specific resource.
 * @param {string} resource - The resource to toggle auto-buy for.
 */
function toggleAutoBuy(resource) {
    switch (resource) {
        case 'worker':
            autobuy_worker = !autobuy_worker;
            break;
        case 'pedal_machine':
            autobuy_pedal_machine = !autobuy_pedal_machine;
            break;
        case 'solar_panel':
            autobuy_solar_panel = !autobuy_solar_panel;
            break;
        case 'wind_turbine':
            autobuy_wind_turbine = !autobuy_wind_turbine;
            break;
    }
}

/**
 * Toggles the master manager automation on and off.
 */
function toggleManager() {
    manager_enabled = !manager_enabled;
}

/**
 * Toggles the engineering manager automation on and off.
 */
function toggleEngineeringManager() {
    engineering_manager_enabled = !engineering_manager_enabled;
}

/**
 * Sets the upgrade threshold for the engineering manager.
 */
function setUpgradeThreshold() {
    engineering_manager_threshold = parseInt(document.getElementById("upgrade_threshold").value);
}

/**
 * Toggles the auto-upgrade feature for a specific resource.
 * @param {string} resource - The resource to toggle auto-upgrade for.
 */
function toggleAutoUpgrade(resource) {
    switch (resource) {
        case 'pedal_machine':
            autobuy_pedal_machine_upgrade = !autobuy_pedal_machine_upgrade;
            break;
        case 'solar_panel':
            autobuy_solar_panel_upgrade = !autobuy_solar_panel_upgrade;
            break;
        case 'wind_turbine':
            autobuy_wind_turbine_upgrade = !autobuy_wind_turbine_upgrade;
            break;
    }
}

/**
 * Buys a new engineer.
 */
function buyEngineer() {
    if (current_credits >= engineer_cost) {
        engineers++;
        current_credits -= engineer_cost;
        engineer_cost = Math.floor(engineer_cost * 1.1);
    }
}

/**
 * Adds 500 credits to the player's account for testing purposes.
 */
function cheat() {
    current_credits += 500;
}

/**
 * Adds 50,000 credits to the player's account for testing purposes.
 */
function cheat50k() {
    current_credits += 50000;
}

/**
 * Sets the game speed.
 * @param {number} speed - The new game speed.
 */
function setGameSpeed(speed) {
    gameSpeed = speed;
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 200 / gameSpeed);
}

/**
 * Updates the game time.
 */
function updateTime() {
    time += 5;
}

/**
 * Updates the world stats.
 */
function updateWorldStats() {
    // Temperature Simulation
    var temp_amplitude = 10; // Fluctuation range
    var temp_base = 15; // Base temperature in Celsius
    var temp_offset = temp_amplitude * Math.cos(((time - (12 * 60)) / (24 * 60)) * 2 * Math.PI);
    temperature_drift += (Math.random() * 0.1) - 0.05;
    if (temperature_drift > 1) temperature_drift = 1;
    if (temperature_drift < -1) temperature_drift = -1;
    temperature = temp_base + temp_offset + temperature_drift;

    // Society Well-being Simulation
    var ideal_temp = 22;
    var temp_diff = Math.abs(temperature - ideal_temp);
    var well_being_penalty = Math.max(0, temp_diff - 5) * 0.02; // Penalty for temps far from ideal
    var target_well_being = 0.8 - well_being_penalty;
    var random_change = (Math.random() * 0.02) - 0.01; // +/- 0.01
    society_well_being += random_change;
    if (society_well_being > target_well_being) {
        society_well_being -= 0.005;
    } else {
        society_well_being += 0.005;
    }
    society_well_being = Math.max(0, Math.min(1, society_well_being)); // Clamp to 100%

    // Update Transformer Efficiency (random fluctuation)
    transformer_eff += (Math.random() * 0.002) - 0.001; // very small change +/- 0.001
    if (transformer_eff > 0.725) transformer_eff = 0.725;
    if (transformer_eff < 0.675) transformer_eff = 0.675;

    // Update Powerline Efficiency (impacted by temperature and households)
    var temp_penalty = Math.max(0, temperature - 20) * 0.005; // Efficiency drops above 20C
    var household_penalty = Math.pow(0.99, households);
    powerline_eff = household_penalty - temp_penalty;
    powerline_eff = Math.max(0.1, powerline_eff); // Ensure it doesn't go below 10%

    // Update Power Demand (impacted by time, temperature, and well-being)
    var demand_amplitude = base_household_demand * 0.5; // 50% fluctuation
    var demand_offset = demand_amplitude * Math.cos(((time - (18 * 60)) / (24 * 60)) * 2 * Math.PI); // Peak in the evening
    var temp_demand_bonus = Math.max(0, temp_diff - 10) * 0.1; // Higher demand for extreme temps
    power_demand = households * (base_household_demand + demand_offset + temp_demand_bonus) * (0.5 + society_well_being * 0.5) * 1000; // in W
}

/**
 * Updates the power price.
 */
function updatePowerPrice() {
    // Day-night cycle using a cosine wave
    var base_price = 3;
    var amplitude = 2;
    var period = 24 * 60; // 24 hours in minutes
    var price_offset = amplitude * Math.cos(((time - (12 * 60)) / period) * 2 * Math.PI);

    price_drift += (Math.random() * 0.08) - 0.04;
    if (price_drift > 0.2) price_drift = 0.2;
    if (price_drift < -0.2) price_drift = -0.2;

    // Society well being affects the price of power
    var well_being_bonus = (society_well_being - 0.5) * 0.2;
    current_power_price = base_price + price_offset + price_drift + well_being_bonus;

    // Clamp the price to a reasonable range (e.g., 0.5 to 5)
    if (current_power_price < 0.5) {
        current_power_price = 0.5;
    } else if (current_power_price > 5) {
        current_power_price = 5;
    }
}

/**
 * Updates the upgrade probabilities for all generators.
 */
function updateUpgradeProbabilities() {
    if (engineers > 0) {
        engineer_bonus_pm = Math.min(1 - p_mech_upgrade_chance, engineer_bonus_pm + (engineers * 0.0001));
        engineer_bonus_sp = Math.min(1 - solar_panel_upgrade_chance, engineer_bonus_sp + (engineers * 0.00005));
        engineer_bonus_wt = Math.min(1 - wind_turbine_upgrade_chance, engineer_bonus_wt + (engineers * 0.00002));
    }
}

/**
 * Updates the UI with the latest game state.
 */
function updateUI() {
    // Update all the UI elements with the latest game state
    var p_mech_power = (Math.max(p_mechs, workers) - (Math.max(p_mechs, workers) - Math.min(p_mechs, workers))) * p_mech_eff * (1 + p_mech_level / 10);
    var solar_power = solar_panels * solar_panel_eff * (1 + solar_panel_upgrades / 10);
    var wind_power = wind_turbines * wind_turbine_eff * (1 + wind_turbine_upgrades / 10);

    document.getElementById("p_mech_total").innerHTML = formatSI(p_mech_power);
    document.getElementById("solar_panel_total").innerHTML = formatSI(solar_power);
    document.getElementById("wind_turbine_total").innerHTML = formatSI(wind_power);

    document.getElementById("version").innerHTML = version;
    document.getElementById("current_gen").innerHTML = formatSI(current_gen);
    document.getElementById("current_power_price").innerHTML = fixFloat(current_power_price * price_multiplier);
    document.getElementById("current_credits").innerHTML = current_credits;
    document.getElementById("current_per_hour").innerHTML = current_per_hour;
    document.getElementById("work_cost").innerHTML = work_cost_per_hour;
    document.getElementById("workers").innerHTML = workers;
    document.getElementById("p_mechs").innerHTML = p_mechs;
    document.getElementById("p_mech_eff").innerHTML = p_mech_eff;
    document.getElementById("p_mech_eff2").innerHTML = p_mech_eff2;
    document.getElementById("p_mech_eff_next").innerHTML = fixFloat(p_mech_eff + 0.2);
    document.getElementById("solar_panels").innerHTML = solar_panels;
    document.getElementById("solar_panel_cost").innerHTML = solar_panel_cost;
    document.getElementById("solar_panel_eff").innerHTML = solar_panel_eff;
    document.getElementById("solar_panel_eff2").innerHTML = solar_panel_eff;
    document.getElementById("solar_panel_eff_next").innerHTML = fixFloat(solar_panel_eff + 1);
    document.getElementById("solar_panel_upgrade_cost").innerHTML = solar_panel_upgrade_cost;
    document.getElementById("solar_panel_upgrade_chance").innerHTML = ((solar_panel_upgrade_chance + (0.4 * solar_panel_upgrades) / (solar_panel_upgrades + 15) + engineer_bonus_sp) * 100).toFixed(2) + "%";
    document.getElementById("managers").innerHTML = managers;
    document.getElementById("manager_cost").innerHTML = manager_cost;
    document.getElementById("engineers_count").innerHTML = engineers;
    document.getElementById("engineer_cost").innerHTML = engineer_cost;
    document.getElementById("engineer_prob_pm").innerHTML = ((p_mech_upgrade_chance + engineer_bonus_pm) * 100).toFixed(2);
    document.getElementById("engineer_prob_sp").innerHTML = ((solar_panel_upgrade_chance + engineer_bonus_sp) * 100).toFixed(2);
    document.getElementById("engineer_prob_wt").innerHTML = ((wind_turbine_upgrade_chance + engineer_bonus_wt) * 100).toFixed(2);
    document.getElementById("wind_turbines").innerHTML = wind_turbines;
    document.getElementById("wind_turbine_cost").innerHTML = wind_turbine_cost;
    document.getElementById("wind_turbine_eff").innerHTML = wind_turbine_eff;
    document.getElementById("wind_turbine_eff2").innerHTML = wind_turbine_eff;
    document.getElementById("wind_turbine_eff_next").innerHTML = fixFloat(wind_turbine_eff + 5);
    document.getElementById("wind_turbine_upgrade_cost").innerHTML = wind_turbine_upgrade_cost;
    document.getElementById("wind_turbine_upgrade_chance").innerHTML = ((wind_turbine_upgrade_chance + (0.3 * wind_turbine_upgrades) / (wind_turbine_upgrades + 20) + engineer_bonus_wt) * 100).toFixed(2) + "%";
    p_mech_prototype_cost = fixFloat(Math.pow(1.1, p_mech_level) * 10 * p_mech_eff * 2 * (60 * 1))
    document.getElementById("p_mech_prototype_cost").innerHTML = p_mech_prototype_cost
    document.getElementById("p_mech_upgrade_chance").innerHTML = ((p_mech_upgrade_chance + (0.5 * p_mech_upgrades) / (p_mech_upgrades + 10) + engineer_bonus_pm) * 100).toFixed(2) + "%";
    var nextCost = Math.floor(init_p_mach_cost * Math.pow(1.15, p_mechs) + p_mechs * Math.pow(1.2, getTier(p_mechs)));
    document.getElementById("p_mach_cost").innerHTML = nextCost;
    document.getElementById("households").innerHTML = households;
    document.getElementById("power_demand").innerHTML = formatSI(power_demand);
    var hour = Math.floor(time / 60) % 24;
    var minute = time % 60;
    document.getElementById("time").innerHTML = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    document.getElementById("temperature").innerHTML = temperature.toFixed(1);
    document.getElementById("well_being").innerHTML = (society_well_being * 100).toFixed(0);
    document.getElementById("transformer_eff").innerHTML = (transformer_eff * 100).toFixed(2);
    document.getElementById("powerline_eff").innerHTML = (powerline_eff * 100).toFixed(2);
    document.getElementById("gameSpeedDisplay").innerHTML = gameSpeed;
    document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
    document.getElementById("negotiate_bonus_duration").innerHTML = (negotiate_bonus_duration * 0.2).toFixed(1);

    document.getElementById("negotiate_button").disabled = negotiate_cooldown > 0;
    document.getElementById("manager_controls").style.display = managers > 0 ? "block" : "none";
    document.getElementById("manager_upgrades").style.display = managers > 0 ? "block" : "none";
    document.getElementById("engineering_manager_controls").style.display = managers > 0 ? "block" : "none";

    document.getElementById("autobuy_solar_panel").disabled = !manager_autobuy_unlocked.solar;
    document.getElementById("autobuy_wind_turbine").disabled = !manager_autobuy_unlocked.wind;

    document.getElementById("manager_upgrade_solar_cost").innerHTML = manager_autobuy_unlocked.solar ? "Unlocked" : manager_upgrade_solar_cost;
    document.getElementById("manager_upgrade_wind_cost").innerHTML = manager_autobuy_unlocked.wind ? "Unlocked" : manager_upgrade_wind_cost;
}

/**
 * Runs the manager AI.
 */
function runManagerAI() {
    if (managers > 0 && manager_enabled) {
        document.getElementById("manager_status").innerHTML = "Active";
        for (var i = 0; i < managers; i++) {
            for (var j = 0; j < manager_actions_per_tick; j++) {
                // Manager AI: Smarter purchasing decisions
                if (autobuy_worker && workers < p_mechs) {
                    document.getElementById("manager_status").innerHTML = "Buying Worker";
                    buyWorker(1);
                    continue; // Skip to the next manager action
                }

                var best_buy = {
                    name: "none",
                    efficiency: 0
                };
                var p_mech_current_cost = Math.floor(init_p_mach_cost * Math.pow(1.15, p_mechs) + p_mechs * Math.pow(1.2, getTier(p_mechs)));

                if (autobuy_pedal_machine && current_credits >= p_mech_current_cost) {
                    var p_mech_kwh_per_dollar = p_mech_eff / p_mech_current_cost;
                    if (p_mech_kwh_per_dollar > best_buy.efficiency) {
                        best_buy = {
                            name: "pedal_machine",
                            efficiency: p_mech_kwh_per_dollar
                        };
                    }
                }

                if (autobuy_solar_panel && current_credits >= solar_panel_cost) {
                    var solar_panel_kwh_per_dollar = solar_panel_eff / solar_panel_cost;
                    if (solar_panel_kwh_per_dollar > best_buy.efficiency) {
                        best_buy = {
                            name: "solar_panel",
                            efficiency: solar_panel_kwh_per_dollar
                        };
                    }
                }

                if (autobuy_wind_turbine && current_credits >= wind_turbine_cost) {
                    var wind_turbine_kwh_per_dollar = wind_turbine_eff / wind_turbine_cost;
                    if (wind_turbine_kwh_per_dollar > best_buy.efficiency) {
                        best_buy = {
                            name: "wind_turbine",
                            efficiency: wind_turbine_kwh_per_dollar
                        };
                    }
                }

                switch (best_buy.name) {
                    case "pedal_machine":
                        document.getElementById("manager_status").innerHTML = "Buying Pedal Machine";
                        buyPedalMachine();
                        break;
                    case "solar_panel":
                        document.getElementById("manager_status").innerHTML = "Buying Solar Panel";
                        buySolarPanel();
                        break;
                    case "wind_turbine":
                        document.getElementById("manager_status").innerHTML = "Buying Wind Turbine";
                        buyWindTurbine();
                        break;
                    default:
                        document.getElementById("manager_status").innerHTML = "Idle";
                        break;
                }
            }
        }

        if (engineering_manager_enabled) {
            if (autobuy_pedal_machine_upgrade && (p_mech_upgrade_chance + engineer_bonus_pm) >= (engineering_manager_threshold / 100)) {
                upgradePedalMachine();
            }
            if (autobuy_solar_panel_upgrade && (solar_panel_upgrade_chance + engineer_bonus_sp) >= (engineering_manager_threshold / 100)) {
                upgradeSolarPanel();
            }
            if (autobuy_wind_turbine_upgrade && (wind_turbine_upgrade_chance + engineer_bonus_wt) >= (engineering_manager_threshold / 100)) {
                upgradeWindTurbine();
            }
        }
    } else if (managers > 0) {
        document.getElementById("manager_status").innerHTML = "Disabled";
    }
}

/**
 * Updates the cooldowns for the negotiate power price feature.
 */
function updateCooldowns() {
    if (negotiate_cooldown > 0) {
        negotiate_cooldown = negotiate_cooldown - 1
    }

    if (negotiate_bonus_duration > 0) {
        negotiate_bonus_duration--;
        if (negotiate_bonus_duration === 0) {
            price_multiplier = 1;
        }
    }
}

/**
 * Updates the history arrays for the charts.
 */
function updateHistory() {
    creditHistory.push(current_credits);
    creditHistory.shift();
    powerHistory.push(current_gen);
    powerHistory.shift();

    if (document.getElementById('dashboard').style.display.toLowerCase() === 'block') {
        updateChart();
    }
}

/**
 * The main game loop.
 */
function gameLoop() {
    updateTime();
    updateWorldStats();
    updatePowerPrice();
    updateUpgradeProbabilities();
    getCredits()
    runManagerAI();
    updateCooldowns();
    updateHistory();
    updateUI();
}

/**
 * Updates the charts on the dashboard.
 */
function updateChart() {
    if (creditChart) {
        creditChart.data.datasets[0].data = creditHistory;
        creditChart.update('none');
    }
    if (powerChart) {
        powerChart.data.datasets[0].data = powerHistory;
        powerChart.update('none');
    }
}

// Initial game start
setGameSpeed(1);