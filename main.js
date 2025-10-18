var current_gen = 0
var current_power_price = 2
var current_credits = 100
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

var areas = ["factory_floor", "laboratory", "management", "dashboard", "admin"]

var creditHistory = []
var powerHistory = []
var creditChart
var powerChart
//var space_max = 100;

// Initializes the game state and UI elements when the page loads.
function load(){
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

    if (document.getElementById('creditChart') && document.getElementById('powerChart')) {
        var creditCtx = document.getElementById('creditChart').getContext('2d');
        creditChart = new Chart(creditCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Credits',
                    data: creditHistory,
                    borderColor: 'gold',
                    fill: false
                }]
            }
        });

        var powerCtx = document.getElementById('powerChart').getContext('2d');
        powerChart = new Chart(powerCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Power',
                    data: powerHistory,
                    borderColor: 'cyan',
                    fill: false
                }]
            }
        });
    }
}

// Calculates and updates the player's credits based on power generation and costs.
function getCredits(){
    current_per_hour = (current_power_price * current_gen) - work_cost_per_hour
    current_per_hour = fixFloat(current_per_hour)
    current_credits = current_credits + current_per_hour
    current_credits = fixFloat(current_credits)
    document.getElementById("current_credits").innerHTML = current_credits
    document.getElementById("current_per_hour").innerHTML = current_per_hour;
};

// Shows the selected game area and hides the others.
function show_area(area){
    console.log("Showing area: " + area);
    console.log(areas);
    for (i = 0; i < areas.length; i++){
        document.getElementById(areas[i]).style.display = "none";
    }
    document.getElementById(area).style.display = "block";
}

// A helper function to round a number to one decimal place.
function fixFloat(number){
    return parseFloat(number.toFixed(1))
}

// Calculates the total power generation from all sources.
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

// Purchases a new worker.
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
    // Price progression: 10% increase per machine
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

// Upgrades the efficiency of all pedal machines.
function upgradePedalMachine(){
    // Price progression: 10% increase per level, based on current efficiency
    p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1));
    if(current_credits >= p_mech_prototype_cost){
        current_credits -= p_mech_prototype_cost;

        if(Math.random() < p_mech_upgrade_chance){
            p_mech_eff = fixFloat(p_mech_eff + 0.2);
            p_mech_eff2 = p_mech_eff;
            p_mech_level++;
            getCurrentGen();

            // Recalculate cost for the next level
            p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1));

            // Update UI
            document.getElementById("p_mech_prototype_cost").innerHTML = p_mech_prototype_cost;
            document.getElementById("p_mech_eff").innerHTML = p_mech_eff;
            document.getElementById("p_mech_eff2").innerHTML = p_mech_eff2;
        }

        current_credits = fixFloat(current_credits);
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

function updateChart(){
    if (creditChart) {
        creditHistory.push(current_credits);
        creditChart.data.labels.push("");
        if(creditHistory.length > 20){
            creditHistory.shift();
            creditChart.data.labels.shift();
        }
        creditChart.update();
    }

    if (powerChart) {
        powerHistory.push(current_gen);
        powerChart.data.labels.push("");
        if(powerHistory.length > 20){
            powerHistory.shift();
            powerChart.data.labels.shift();
        }
        powerChart.update();
    }
}

window.setInterval(function(){
    if(managers > 0 && manager_enabled){
        document.getElementById("manager_status").innerHTML = "Active";
        for(var i = 0; i < managers; i++){
            for(var j = 0; j < manager_actions_per_tick; j++){
                document.getElementById("manager_status").innerHTML = "Buying...";
                if(autobuy_worker && workers < p_mechs){
                    document.getElementById("manager_status").innerHTML = "Buying Worker";
                    buyWorker(1)
                }
                else if(autobuy_pedal_machine){
                    document.getElementById("manager_status").innerHTML = "Buying Pedal Machine";
                    buyPedalMachine()
                }
                else if(autobuy_solar_panel){
                    document.getElementById("manager_status").innerHTML = "Buying Solar Panel";
                    buySolarPanel()
                }
                else if(autobuy_wind_turbine){
                    document.getElementById("manager_status").innerHTML = "Buying Wind Turbine";
                    buyWindTurbine()
                }
                else if(autobuy_nuclear_reactor){
                    document.getElementById("manager_status").innerHTML = "Buying Nuclear Reactor";
                    buyNuclearReactor()
                } else {
                    document.getElementById("manager_status").innerHTML = "Idle";
                }
            }
        }
    } else if(managers > 0){
        document.getElementById("manager_status").innerHTML = "Disabled";
    }
    if(negotiate_cooldown > 0){
        negotiate_cooldown = negotiate_cooldown - 1
        document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
    }
    if(negotiate_timer > 0){
        negotiate_timer = negotiate_timer - 1
        document.getElementById("negotiate_timer").innerHTML = negotiate_timer;
    }
    getCredits()
    if (document.getElementById("current_credits")) {
        document.getElementById("current_credits").innerHTML = current_credits;
    }
    updateChart();
}, 1000);

function runSimulationTest(){
    // Reset the game state to ensure a clean test run
    resetGameStateForTest();
    let initial_power = current_gen;
    document.getElementById("sim_test_result").innerHTML = "Running...";

    let steps = 0;
    const max_steps = 300; // 3 seconds worth of steps

    var sim_interval = setInterval(function(){
        if(steps >= max_steps){
            clearInterval(sim_interval);

            // The test passes if power generation has increased
            if(current_gen > initial_power){
                document.getElementById("sim_test_result").innerHTML = `Passed (Power increased from ${initial_power} to ${current_gen})`;
            } else {
                document.getElementById("sim_test_result").innerHTML = `Failed (Power did not increase)`;
            }

            // Reset for a clean slate
            resetGameStateForTest();
            load();
            return;
        }

        // More advanced purchasing logic for the simulation
        if(workers < p_mechs){
            buyWorker(1);
        } else if (current_credits > solar_panel_cost * 1.5) { // Be a bit more aggressive with solar
            buySolarPanel();
        } else {
            buyPedalMachine();
        }

        getCredits();
        steps++;
    }, 10);
}
