var version = "0.1.3"
var price_multiplier = 1
var current_gen = 0
var current_power_price = 2
var current_credits = 500
var current_per_hour = 0
var work_cost = 0.1
var work_cost_per_hour = 0
var workers = 0
var p_mechs = 0
var p_mech_eff = 0.5
var p_mech_eff2 = p_mech_eff
var init_p_mach_cost = 40
var p_mech_level = 1

var p_mech_prototype_cost = 0
var p_mech_upgrade_chance = 0.1

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

var engineering_manager_enabled = false;
var autobuy_pedal_machine_upgrade = false;
var autobuy_solar_panel_upgrade = false;
var autobuy_wind_turbine_upgrade = false;
var engineering_manager_threshold = 50;

var negotiate_cooldown = 0;
var negotiate_bonus_duration = 0;
var solar_panels = 0;
var solar_panel_cost = 500;
var solar_panel_eff = 2;
var solar_panel_upgrade_cost = 1000;
var solar_panel_upgrade_chance = 0.1;
var wind_turbines = 0;
var wind_turbine_cost = 2500;
var wind_turbine_eff = 10;
var wind_turbine_upgrade_cost = 5000;
var wind_turbine_upgrade_chance = 0.1;
var nuclear_reactors = 0;
var nuclear_reactor_eff = 50;

var engineers = 0;
var engineer_cost = 3000;
var engineer_bonus_pm = 0;
var engineer_bonus_sp = 0;
var engineer_bonus_wt = 0;

var areas = ["factory_floor", "laboratory", "management", "engineers", "dashboard", "admin"]

var creditChart;
var powerChart;
var creditHistory = Array(100).fill(0);
var powerHistory = Array(100).fill(0);
//var space_max = 100;

function load(){
    if (document.getElementById("version")) {
        document.getElementById("version").innerHTML = version
    }
    if (document.getElementById("current_gen")) {
        document.getElementById("current_gen").innerHTML = current_gen
    }
    if (document.getElementById("current_power_price")) {
        document.getElementById("current_power_price").innerHTML = current_power_price
    }
    if (document.getElementById("current_credits")) {
        document.getElementById("current_credits").innerHTML = current_credits
    }
    if (document.getElementById("current_per_hour")) {
        document.getElementById("current_per_hour").innerHTML = current_per_hour
    }
    if (document.getElementById("work_cost")) {
        document.getElementById("work_cost").innerHTML = work_cost
    }
    if (document.getElementById("workers")) {
        document.getElementById("workers").innerHTML = workers
    }
    if (document.getElementById("p_mechs")) {
        document.getElementById("p_mechs").innerHTML = p_mechs
    }
    if (document.getElementById("p_mech_eff")) {
        document.getElementById("p_mech_eff").innerHTML = p_mech_eff
    }
    if (document.getElementById("p_mech_eff2")) {
        document.getElementById("p_mech_eff2").innerHTML = p_mech_eff2
    }
    if (document.getElementById("solar_panels")) {
        document.getElementById("solar_panels").innerHTML = solar_panels;
    }
    if (document.getElementById("solar_panel_cost")) {
        document.getElementById("solar_panel_cost").innerHTML = solar_panel_cost;
    }
    if (document.getElementById("solar_panel_eff")) {
        document.getElementById("solar_panel_eff").innerHTML = solar_panel_eff;
    }
    if (document.getElementById("solar_panel_eff2")) {
        document.getElementById("solar_panel_eff2").innerHTML = solar_panel_eff;
    }
    if (document.getElementById("solar_panel_upgrade_cost")) {
        document.getElementById("solar_panel_upgrade_cost").innerHTML = solar_panel_upgrade_cost;
    }
    if (document.getElementById("solar_panel_upgrade_chance")) {
        document.getElementById("solar_panel_upgrade_chance").innerHTML = solar_panel_upgrade_chance;
    }
    if (document.getElementById("managers")) {
        document.getElementById("managers").innerHTML = managers;
    }
    if (document.getElementById("manager_cost")) {
        document.getElementById("manager_cost").innerHTML = manager_cost;
    }

    if (document.getElementById("engineers_count")) {
        document.getElementById("engineers_count").innerHTML = engineers;
    }
    if (document.getElementById("engineer_cost")) {
        document.getElementById("engineer_cost").innerHTML = engineer_cost;
    }
    if (document.getElementById("engineer_prob_pm")) {
        document.getElementById("engineer_prob_pm").innerHTML = ((p_mech_upgrade_chance + engineer_bonus_pm) * 100).toFixed(2);
    }
    if (document.getElementById("engineer_prob_sp")) {
        document.getElementById("engineer_prob_sp").innerHTML = ((solar_panel_upgrade_chance + engineer_bonus_sp) * 100).toFixed(2);
    }
    if (document.getElementById("engineer_prob_wt")) {
        document.getElementById("engineer_prob_wt").innerHTML = ((wind_turbine_upgrade_chance + engineer_bonus_wt) * 100).toFixed(2);
    }

    if (document.getElementById("wind_turbines")) {
        document.getElementById("wind_turbines").innerHTML = wind_turbines;
    }
    if (document.getElementById("wind_turbine_cost")) {
        document.getElementById("wind_turbine_cost").innerHTML = wind_turbine_cost;
    }
    if (document.getElementById("wind_turbine_eff")) {
        document.getElementById("wind_turbine_eff").innerHTML = wind_turbine_eff;
    }
    if (document.getElementById("wind_turbine_eff2")) {
        document.getElementById("wind_turbine_eff2").innerHTML = wind_turbine_eff;
    }
    if (document.getElementById("wind_turbine_upgrade_cost")) {
        document.getElementById("wind_turbine_upgrade_cost").innerHTML = wind_turbine_upgrade_cost;
    }
    if (document.getElementById("wind_turbine_upgrade_chance")) {
        document.getElementById("wind_turbine_upgrade_chance").innerHTML = wind_turbine_upgrade_chance;
    }

    p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1))
    if (document.getElementById("p_mech_prototype_cost")) {
        document.getElementById("p_mech_prototype_cost").innerHTML = p_mech_prototype_cost
    }
    if (document.getElementById("p_mech_upgrade_chance")) {
        document.getElementById("p_mech_upgrade_chance").innerHTML = p_mech_upgrade_chance
    }
    
    //fix
    if (document.getElementById("p_mach_cost")) {
        document.getElementById("p_mach_cost").innerHTML = Math.floor(init_p_mach_cost * Math.pow(1.1,p_mechs));
    }

}

function getCredits(){
    current_per_hour = (current_power_price * price_multiplier * current_gen) - work_cost_per_hour
    current_per_hour = fixFloat(current_per_hour)
    current_credits = current_credits + current_per_hour
    current_credits = fixFloat(current_credits)
    document.getElementById("current_credits").innerHTML = current_credits
    document.getElementById("current_per_hour").innerHTML = current_per_hour;
};

function show_area(area){
    for (i = 0; i < areas.length; i++){
        document.getElementById(areas[i]).style = "display: None;"
    }
    document.getElementById(area).style = "display: Block;"

    if(area === 'dashboard'){
        initCharts();
    }
}

function buyWindTurbine(){
    // Price progression: 20% increase per turbine
    if(current_credits >= wind_turbine_cost){
        wind_turbines++;
        current_credits -= wind_turbine_cost;
        wind_turbine_cost = Math.floor(wind_turbine_cost * 1.2);

        getCurrentGen();

        document.getElementById("wind_turbines").innerHTML = wind_turbines;
        document.getElementById("wind_turbine_cost").innerHTML = wind_turbine_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

// Upgrades the efficiency of all wind turbines.
function upgradeWindTurbine(){
    // Price progression: 80% increase per upgrade
    if(current_credits >= wind_turbine_upgrade_cost){
        current_credits -= wind_turbine_upgrade_cost;

        if(Math.random() < wind_turbine_upgrade_chance + engineer_bonus_wt){
            wind_turbine_eff = fixFloat(wind_turbine_eff + 5);
            wind_turbine_upgrade_cost = Math.floor(wind_turbine_upgrade_cost * 1.8);
            engineer_bonus_wt = 0;
            document.getElementById("wind_turbine_eff").innerHTML = wind_turbine_eff;
            document.getElementById("wind_turbine_eff2").innerHTML = wind_turbine_eff;
            getCurrentGen();
            document.getElementById("wind_turbine_upgrade_cost").innerHTML = wind_turbine_upgrade_cost;
        }

        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

function initCharts(){
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

function fixFloat(number){
    return parseFloat(number.toFixed(1))
}

function getCurrentGen(){
    //p_mech gen
    var max_utility = Math.max(p_mechs, workers) - (Math.max(p_mechs, workers) - Math.min(p_mechs, workers));
    var p_mech_power = max_utility * p_mech_eff;

    //solar panel gen
    var solar_power = solar_panels * solar_panel_eff;

    //wind turbine gen
    var wind_power = wind_turbines * wind_turbine_eff;

    //nuclear reactor gen
    var nuclear_power = nuclear_reactors * nuclear_reactor_eff;

    current_gen = fixFloat(p_mech_power + solar_power + wind_power + nuclear_power);
    document.getElementById("current_gen").innerHTML = current_gen;
}

function buyWorker(number){
    workers = workers + number;
    getCurrentGen()
    document.getElementById("workers").innerHTML = workers;
    var work_cost_temp = work_cost * workers;
    work_cost_temp = fixFloat(work_cost_temp)
    work_cost_per_hour = work_cost_temp
    document.getElementById("work_cost").innerHTML = work_cost_per_hour;
};

function buyPedalMachine(){
    var p_mech_cost = Math.floor(init_p_mach_cost * Math.pow(1.1,p_mechs));
    if(current_credits >= p_mech_cost){
        p_mechs = p_mechs + 1
        current_credits = current_credits - p_mech_cost
        current_credits = fixFloat(current_credits)
        getCurrentGen()
        document.getElementById("current_credits").innerHTML = current_credits;
        document.getElementById("p_mechs").innerHTML = p_mechs;
    };
    var nextCost = Math.floor(init_p_mach_cost * Math.pow(1.1,p_mechs));
    document.getElementById("p_mach_cost").innerHTML = nextCost;
};

function upgradePedalMachine(){
    p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1))
    if(current_credits >= p_mech_prototype_cost){
        current_credits -= p_mech_prototype_cost;
        if(Math.random() < p_mech_upgrade_chance + engineer_bonus_pm){
            p_mech_eff = fixFloat(p_mech_eff + 0.2);
            p_mech_eff2 = p_mech_eff;
            p_mech_level++;
            engineer_bonus_pm = 0;
            getCurrentGen();
            p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1));
            document.getElementById("p_mech_prototype_cost").innerHTML = p_mech_prototype_cost;
            document.getElementById("p_mech_eff").innerHTML = p_mech_eff;
            document.getElementById("p_mech_eff2").innerHTML = p_mech_eff2;
        }
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

function negotiatePowerPrice(){
    if(negotiate_cooldown === 0){
        price_multiplier = 2;
        negotiate_cooldown = 60;
        negotiate_bonus_duration = 50; // 50 ticks * 200ms = 10 seconds
        document.getElementById("negotiate_button").disabled = true;
    }
}

// Purchases a new solar panel.
function buySolarPanel(){
    // Price progression: 20% increase per panel
    if(current_credits >= solar_panel_cost){
        solar_panels++;
        current_credits -= solar_panel_cost;
        solar_panel_cost = Math.floor(solar_panel_cost * 1.2);

        getCurrentGen();

        document.getElementById("solar_panels").innerHTML = solar_panels;
        document.getElementById("solar_panel_cost").innerHTML = solar_panel_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

// Upgrades the efficiency of all solar panels.
function upgradeSolarPanel(){
    // Price progression: 80% increase per upgrade
    if(current_credits >= solar_panel_upgrade_cost){
        current_credits -= solar_panel_upgrade_cost;

        if(Math.random() < solar_panel_upgrade_chance + engineer_bonus_sp){
            solar_panel_eff = fixFloat(solar_panel_eff + 1);
            solar_panel_upgrade_cost = Math.floor(solar_panel_upgrade_cost * 1.8);
            engineer_bonus_sp = 0;
            document.getElementById("solar_panel_eff").innerHTML = solar_panel_eff;
            document.getElementById("solar_panel_eff2").innerHTML = solar_panel_eff;
            getCurrentGen();
            document.getElementById("solar_panel_upgrade_cost").innerHTML = solar_panel_upgrade_cost;
        }

        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

// Upgrades the manager's capabilities to allow auto-buying of new resources.
function upgradeManager(type){
    switch(type){
        case 'solar':
            if(current_credits >= manager_upgrade_solar_cost){
                current_credits -= manager_upgrade_solar_cost;
                manager_autobuy_unlocked.solar = true;
                document.getElementById("autobuy_solar_panel").disabled = false;
                manager_upgrade_solar_cost = 0; // One-time purchase
                document.getElementById("manager_upgrade_solar_cost").innerHTML = "Unlocked";
            }
            break;
        case 'wind':
            if(current_credits >= manager_upgrade_wind_cost){
                current_credits -= manager_upgrade_wind_cost;
                manager_autobuy_unlocked.wind = true;
                document.getElementById("autobuy_wind_turbine").disabled = false;
                manager_upgrade_wind_cost = 0; // One-time purchase
                document.getElementById("manager_upgrade_wind_cost").innerHTML = "Unlocked";
            }
            break;
    }
    document.getElementById("current_credits").innerHTML = current_credits;
}

// Purchases a new manager.
function buyManager(){
    if(current_credits >= manager_cost){
        managers = managers + 1
        current_credits = current_credits - manager_cost
        document.getElementById("managers").innerHTML = managers;
        document.getElementById("current_credits").innerHTML = current_credits;
        manager_cost = Math.floor(manager_cost * 1.5)
        document.getElementById("manager_cost").innerHTML = manager_cost;

        if(managers > 0){
            document.getElementById("manager_controls").style.display = "block";
            document.getElementById("manager_upgrades").style.display = "block";
            document.getElementById("engineering_manager_controls").style.display = "block";
        }
    }
}

// Toggles the auto-buy feature for a specific resource.
function toggleAutoBuy(resource){
    switch(resource){
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

// Toggles the master manager automation on and off.
function toggleManager(){
    manager_enabled = !manager_enabled;
}

function toggleEngineeringManager(){
    engineering_manager_enabled = !engineering_manager_enabled;
}

function setUpgradeThreshold(){
    engineering_manager_threshold = parseInt(document.getElementById("upgrade_threshold").value);
}

function toggleAutoUpgrade(resource){
    switch(resource){
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

function buyEngineer(){
    if(current_credits >= engineer_cost){
        engineers++;
        current_credits -= engineer_cost;
        engineer_cost = Math.floor(engineer_cost * 1.1);
        document.getElementById("engineers_count").innerHTML = engineers;
        document.getElementById("engineer_cost").innerHTML = engineer_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

// Adds 500 credits to the player's account for testing purposes.
function cheat(){
    current_credits += 500;
    if (document.getElementById("current_credits")) {
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

// Adds 50,000 credits to the player's account for testing purposes.
function cheat50k(){
    current_credits += 50000;
    if (document.getElementById("current_credits")) {
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

var gameLoopInterval;
var gameSpeed = 1;

function setGameSpeed(speed) {
    gameSpeed = speed;
    document.getElementById('gameSpeedDisplay').innerHTML = speed;
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 200 / gameSpeed);
}

function gameLoop(){
    // Price fluctuation: Adjust price by a random amount between -0.1 and 0.1
    var price_change = (Math.random() * 0.2) - 0.1;
    current_power_price += price_change;

    // Clamp the price to a reasonable range (e.g., 0.5 to 5)
    if(current_power_price < 0.5){
        current_power_price = 0.5;
    } else if(current_power_price > 5){
        current_power_price = 5;
    }
    current_power_price = fixFloat(current_power_price);

    if (document.getElementById("current_power_price")) {
        document.getElementById("current_power_price").innerHTML = fixFloat(current_power_price * price_multiplier);
    }

    if(engineers > 0){
        engineer_bonus_pm = Math.min(1 - p_mech_upgrade_chance, engineer_bonus_pm + (engineers * 0.0001));
        engineer_bonus_sp = Math.min(1 - solar_panel_upgrade_chance, engineer_bonus_sp + (engineers * 0.00005));
        engineer_bonus_wt = Math.min(1 - wind_turbine_upgrade_chance, engineer_bonus_wt + (engineers * 0.00002));
    }

    if (document.getElementById("engineer_prob_pm")) {
        document.getElementById("engineer_prob_pm").innerHTML = ((p_mech_upgrade_chance + engineer_bonus_pm) * 100).toFixed(2);
    }
    if (document.getElementById("engineer_prob_sp")) {
        document.getElementById("engineer_prob_sp").innerHTML = ((solar_panel_upgrade_chance + engineer_bonus_sp) * 100).toFixed(2);
    }
    if (document.getElementById("engineer_prob_wt")) {
        document.getElementById("engineer_prob_wt").innerHTML = ((wind_turbine_upgrade_chance + engineer_bonus_wt) * 100).toFixed(2);
    }

    if (document.getElementById("p_mech_upgrade_chance")) {
        document.getElementById("p_mech_upgrade_chance").innerHTML = ((p_mech_upgrade_chance + engineer_bonus_pm) * 100).toFixed(2) + "%";
    }
    if (document.getElementById("solar_panel_upgrade_chance")) {
        document.getElementById("solar_panel_upgrade_chance").innerHTML = ((solar_panel_upgrade_chance + engineer_bonus_sp) * 100).toFixed(2) + "%";
    }
    if (document.getElementById("wind_turbine_upgrade_chance")) {
        document.getElementById("wind_turbine_upgrade_chance").innerHTML = ((wind_turbine_upgrade_chance + engineer_bonus_wt) * 100).toFixed(2) + "%";
    }

    //buyWorker(p_mechs)
    getCredits()
    if (document.getElementById("current_credits")) {
        document.getElementById("current_credits").innerHTML = current_credits;
    }
    if(negotiate_cooldown > 0){
        negotiate_cooldown = negotiate_cooldown - 1
        if (document.getElementById("negotiate_cooldown")) {
            document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
        }
        if(negotiate_cooldown === 0){
            document.getElementById("negotiate_button").disabled = false;
        }
    }

    if(negotiate_bonus_duration > 0){
        negotiate_bonus_duration--;
        if(document.getElementById("negotiate_bonus_duration")){
            document.getElementById("negotiate_bonus_duration").innerHTML = (negotiate_bonus_duration * 0.2).toFixed(1);
        }
        if(negotiate_bonus_duration === 0){
            price_multiplier = 1;
        }
    }

    if(managers > 0 && manager_enabled){
        if (document.getElementById("manager_status")) {
            document.getElementById("manager_status").innerHTML = "Active";
        }
        for(var i = 0; i < managers; i++){
            for(var j = 0; j < manager_actions_per_tick; j++){
                // Manager AI: Smarter purchasing decisions

                // 1. Prioritize hiring workers until pedal machines are fully staffed.
                if(autobuy_worker && workers < p_mechs){
                    if (document.getElementById("manager_status")) {
                        document.getElementById("manager_status").innerHTML = "Buying Worker";
                    }
                    buyWorker(1);
                    continue; // Skip to the next manager action
                }

                // 2. If workers are staffed, find the most cost-effective generator to buy.
                var best_buy = { name: "none", efficiency: 0 };
                var p_mech_current_cost = Math.floor(init_p_mach_cost * Math.pow(1.1, p_mechs));

                // A. Calculate efficiency for Pedal Machines (kW/h per credit)
                if (autobuy_pedal_machine && current_credits >= p_mech_current_cost) {
                    var p_mech_kwh_per_dollar = p_mech_eff / p_mech_current_cost;
                    if (p_mech_kwh_per_dollar > best_buy.efficiency) {
                        best_buy = { name: "pedal_machine", efficiency: p_mech_kwh_per_dollar };
                    }
                }

                // B. Calculate efficiency for Solar Panels (kW/h per credit)
                if (autobuy_solar_panel && current_credits >= solar_panel_cost) {
                    var solar_panel_kwh_per_dollar = solar_panel_eff / solar_panel_cost;
                    if (solar_panel_kwh_per_dollar > best_buy.efficiency) {
                        best_buy = { name: "solar_panel", efficiency: solar_panel_kwh_per_dollar };
                    }
                }

                // C. Calculate efficiency for Wind Turbines (kW/h per credit)
                if (autobuy_wind_turbine && current_credits >= wind_turbine_cost) {
                    var wind_turbine_kwh_per_dollar = wind_turbine_eff / wind_turbine_cost;
                    if (wind_turbine_kwh_per_dollar > best_buy.efficiency) {
                        best_buy = { name: "wind_turbine", efficiency: wind_turbine_kwh_per_dollar };
                    }
                }

                // 3. Execute the best purchase decision.
                switch (best_buy.name) {
                    case "pedal_machine":
                        if (document.getElementById("manager_status")) {
                            document.getElementById("manager_status").innerHTML = "Buying Pedal Machine";
                        }
                        buyPedalMachine();
                        break;
                    case "solar_panel":
                        if (document.getElementById("manager_status")) {
                            document.getElementById("manager_status").innerHTML = "Buying Solar Panel";
                        }
                        buySolarPanel();
                        break;
                    case "wind_turbine":
                        if (document.getElementById("manager_status")) {
                            document.getElementById("manager_status").innerHTML = "Buying Wind Turbine";
                        }
                        buyWindTurbine();
                        break;
                    default:
                        if (document.getElementById("manager_status")) {
                            document.getElementById("manager_status").innerHTML = "Idle";
                        }
                        break;
                }
            }
        }

        if(engineering_manager_enabled){
            if(autobuy_pedal_machine_upgrade && (p_mech_upgrade_chance + engineer_bonus_pm) >= (engineering_manager_threshold / 100)){
                upgradePedalMachine();
            }
            if(autobuy_solar_panel_upgrade && (solar_panel_upgrade_chance + engineer_bonus_sp) >= (engineering_manager_threshold / 100)){
                upgradeSolarPanel();
            }
            if(autobuy_wind_turbine_upgrade && (wind_turbine_upgrade_chance + engineer_bonus_wt) >= (engineering_manager_threshold / 100)){
                upgradeWindTurbine();
            }
        }
    } else if(managers > 0){
        if (document.getElementById("manager_status")) {
            document.getElementById("manager_status").innerHTML = "Disabled";
        }
    }

    creditHistory.push(current_credits);
    creditHistory.shift();
    powerHistory.push(current_gen);
    powerHistory.shift();

    if (document.getElementById('dashboard').style.display.toLowerCase() === 'block') {
        updateChart();
    }
}

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
