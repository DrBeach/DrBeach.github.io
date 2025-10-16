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

var managers = 0
var manager_cost = 1000
var manager_efficiency = 1
var manager_efficiency_cost = 5000
var manager_upgrade_solar_cost = 10000
var manager_upgrade_wind_cost = 25000
var manager_upgrade_nuclear_cost = 100000

var autobuy_worker = false
var autobuy_pedal_machine = false
var autobuy_solar_panel = false
var autobuy_wind_turbine = false
var autobuy_nuclear_reactor = false

var negotiate_cooldown = 0
var negotiate_timer = 0
var base_power_price = 2

var solar_panels = 0
var solar_panel_cost = 500
var solar_panel_eff = 2
var solar_panel_upgrade_cost = 1000

var wind_turbines = 0
var wind_turbine_cost = 2000
var wind_turbine_eff = 10
var wind_turbine_upgrade_cost = 5000

var nuclear_reactors = 0
var nuclear_reactor_cost = 10000
var nuclear_reactor_eff = 50
var nuclear_reactor_upgrade_cost = 25000

var areas = ["factory_floor", "laboratory", "management", "dashboard", "admin"]

var creditHistory = []
var powerHistory = []
var creditChart
var powerChart
//var space_max = 100;

function load(){
    document.getElementById("current_gen").innerHTML = current_gen
    document.getElementById("current_power_price").innerHTML = current_power_price
    document.getElementById("current_credits").innerHTML = current_credits
    document.getElementById("current_per_hour").innerHTML = current_per_hour
    document.getElementById("work_cost").innerHTML = work_cost
    document.getElementById("workers").innerHTML = workers
    document.getElementById("p_mechs").innerHTML = p_mechs
    document.getElementById("p_mech_eff").innerHTML = p_mech_eff
    document.getElementById("p_mech_eff2").innerHTML = p_mech_eff2

    p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1))
    document.getElementById("p_mech_prototype_cost").innerHTML = p_mech_prototype_cost
    document.getElementById("p_mech_upgrade_chance").innerHTML = p_mech_upgrade_chance
    
    //fix
    document.getElementById("p_mach_cost").innerHTML = Math.floor(init_p_mach_cost * Math.pow(1.1,p_mechs));
    document.getElementById("managers").innerHTML = managers;
    document.getElementById("manager_cost").innerHTML = manager_cost;
    document.getElementById("manager_efficiency").innerHTML = manager_efficiency;
    document.getElementById("manager_efficiency_cost").innerHTML = manager_efficiency_cost;
    document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
    document.getElementById("negotiate_timer").innerHTML = negotiate_timer;

    document.getElementById("manager_upgrade_solar_cost").innerHTML = manager_upgrade_solar_cost;
    document.getElementById("manager_upgrade_wind_cost").innerHTML = manager_upgrade_wind_cost;
    document.getElementById("manager_upgrade_nuclear_cost").innerHTML = manager_upgrade_nuclear_cost;

    document.getElementById("solar_panels").innerHTML = solar_panels;
    document.getElementById("solar_panel_cost").innerHTML = solar_panel_cost;
    document.getElementById("solar_panel_eff").innerHTML = solar_panel_eff;
    document.getElementById("solar_panel_eff2").innerHTML = solar_panel_eff;
    document.getElementById("solar_panel_upgrade_cost").innerHTML = solar_panel_upgrade_cost;

    document.getElementById("wind_turbines").innerHTML = wind_turbines;
    document.getElementById("wind_turbine_cost").innerHTML = wind_turbine_cost;
    document.getElementById("wind_turbine_eff").innerHTML = wind_turbine_eff;
    document.getElementById("wind_turbine_eff2").innerHTML = wind_turbine_eff;
    document.getElementById("wind_turbine_upgrade_cost").innerHTML = wind_turbine_upgrade_cost;

    document.getElementById("nuclear_reactors").innerHTML = nuclear_reactors;
    document.getElementById("nuclear_reactor_cost").innerHTML = nuclear_reactor_cost;
    document.getElementById("nuclear_reactor_eff").innerHTML = nuclear_reactor_eff;
    document.getElementById("nuclear_reactor_eff2").innerHTML = nuclear_reactor_eff;
    document.getElementById("nuclear_reactor_upgrade_cost").innerHTML = nuclear_reactor_upgrade_cost;

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

function getCredits(){
    current_per_hour = (current_power_price * current_gen) - work_cost_per_hour
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

function buySolarPanel(){
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

function upgradeSolarPanel(){
    if(current_credits >= solar_panel_upgrade_cost){
        current_credits -= solar_panel_upgrade_cost;
        solar_panel_eff = fixFloat(solar_panel_eff + 1);
        solar_panel_upgrade_cost = Math.floor(solar_panel_upgrade_cost * 1.8);

        getCurrentGen();

        document.getElementById("solar_panel_eff").innerHTML = solar_panel_eff;
        document.getElementById("solar_panel_eff2").innerHTML = solar_panel_eff;
        document.getElementById("solar_panel_upgrade_cost").innerHTML = solar_panel_upgrade_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

function buyWindTurbine(){
    if(current_credits >= wind_turbine_cost){
        wind_turbines++;
        current_credits -= wind_turbine_cost;
        wind_turbine_cost = Math.floor(wind_turbine_cost * 1.3);

        getCurrentGen();

        document.getElementById("wind_turbines").innerHTML = wind_turbines;
        document.getElementById("wind_turbine_cost").innerHTML = wind_turbine_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

function upgradeWindTurbine(){
    if(current_credits >= wind_turbine_upgrade_cost){
        current_credits -= wind_turbine_upgrade_cost;
        wind_turbine_eff = fixFloat(wind_turbine_eff + 5);
        wind_turbine_upgrade_cost = Math.floor(wind_turbine_upgrade_cost * 1.9);

        getCurrentGen();

        document.getElementById("wind_turbine_eff").innerHTML = wind_turbine_eff;
        document.getElementById("wind_turbine_eff2").innerHTML = wind_turbine_eff;
        document.getElementById("wind_turbine_upgrade_cost").innerHTML = wind_turbine_upgrade_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

function buyNuclearReactor(){
    if(current_credits >= nuclear_reactor_cost){
        nuclear_reactors++;
        current_credits -= nuclear_reactor_cost;
        nuclear_reactor_cost = Math.floor(nuclear_reactor_cost * 1.4);

        getCurrentGen();

        document.getElementById("nuclear_reactors").innerHTML = nuclear_reactors;
        document.getElementById("nuclear_reactor_cost").innerHTML = nuclear_reactor_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

function upgradeNuclearReactor(){
    if(current_credits >= nuclear_reactor_upgrade_cost){
        current_credits -= nuclear_reactor_upgrade_cost;
        nuclear_reactor_eff = fixFloat(nuclear_reactor_eff + 25);
        nuclear_reactor_upgrade_cost = Math.floor(nuclear_reactor_upgrade_cost * 2);

        getCurrentGen();

        document.getElementById("nuclear_reactor_eff").innerHTML = nuclear_reactor_eff;
        document.getElementById("nuclear_reactor_eff2").innerHTML = nuclear_reactor_eff;
        document.getElementById("nuclear_reactor_upgrade_cost").innerHTML = nuclear_reactor_upgrade_cost;
        document.getElementById("current_credits").innerHTML = current_credits;
    }
}

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
        }
    }
}

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
        case 'nuclear_reactor':
            autobuy_nuclear_reactor = !autobuy_nuclear_reactor;
            break;
    }
}

function upgradeManager(type){
    switch(type){
        case 'solar':
            if(current_credits >= manager_upgrade_solar_cost){
                current_credits -= manager_upgrade_solar_cost;
                document.getElementById("autobuy_solar_panel").disabled = false;
                manager_upgrade_solar_cost = 0; // One-time purchase
                document.getElementById("manager_upgrade_solar_cost").innerHTML = "Unlocked";
            }
            break;
        case 'wind':
            if(current_credits >= manager_upgrade_wind_cost){
                current_credits -= manager_upgrade_wind_cost;
                document.getElementById("autobuy_wind_turbine").disabled = false;
                manager_upgrade_wind_cost = 0; // One-time purchase
                document.getElementById("manager_upgrade_wind_cost").innerHTML = "Unlocked";
            }
            break;
        case 'nuclear':
            if(current_credits >= manager_upgrade_nuclear_cost){
                current_credits -= manager_upgrade_nuclear_cost;
                document.getElementById("autobuy_nuclear_reactor").disabled = false;
                manager_upgrade_nuclear_cost = 0; // One-time purchase
                document.getElementById("manager_upgrade_nuclear_cost").innerHTML = "Unlocked";
            }
            break;
    }
    document.getElementById("current_credits").innerHTML = current_credits;
}

function upgradeManagerEfficiency(){
    if(current_credits >= manager_efficiency_cost){
        current_credits = current_credits - manager_efficiency_cost
        manager_efficiency = manager_efficiency + 1
        manager_efficiency_cost = Math.floor(manager_efficiency_cost * 2)
        document.getElementById("manager_efficiency").innerHTML = manager_efficiency;
        document.getElementById("manager_efficiency_cost").innerHTML = manager_efficiency_cost;
    }
}

function negotiatePowerPrice(){
    if(negotiate_cooldown == 0){
        current_power_price = current_power_price * 2;
        negotiate_cooldown = 60;
        negotiate_timer = 10;
        document.getElementById("current_power_price").innerHTML = current_power_price;
        document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
        document.getElementById("negotiate_timer").innerHTML = negotiate_timer;

        setTimeout(function(){
            current_power_price = base_power_price;
            document.getElementById("current_power_price").innerHTML = current_power_price;
        }, 10000);
    }
}

function cheat(){
    current_credits += 500;
    document.getElementById("current_credits").innerHTML = current_credits;
}

function updateMarketPrice(){
    // Fluctuate the base power price by a small random amount
    let fluctuation = (Math.random() - 0.5) * 0.2; // -0.1 to +0.1
    base_power_price = fixFloat(base_power_price + fluctuation);

    // Clamp the price to a reasonable range
    if(base_power_price < 1.5) base_power_price = 1.5;
    if(base_power_price > 2.5) base_power_price = 2.5;

    // Only update the current price if not in a negotiation
    if(negotiate_timer <= 0){
        current_power_price = base_power_price;
        document.getElementById("current_power_price").innerHTML = current_power_price;
    }
}

function updateChart(){
    // Update credit chart
    creditHistory.push(current_credits);
    creditChart.data.labels.push("");
    if(creditHistory.length > 20){
        creditHistory.shift();
        creditChart.data.labels.shift();
    }
    creditChart.update();

    // Update power chart
    powerHistory.push(current_gen);
    powerChart.data.labels.push("");
    if(powerHistory.length > 20){
        powerHistory.shift();
        powerChart.data.labels.shift();
    }
    powerChart.update();
}

window.setInterval(function(){
    if(managers > 0){
        for(var i = 0; i < manager_efficiency; i++){
            if(autobuy_worker && workers < p_mechs){
                buyWorker(1)
            }
            if(autobuy_pedal_machine){
                buyPedalMachine()
            }
            if(autobuy_solar_panel){
                buySolarPanel()
            }
            if(autobuy_wind_turbine){
                buyWindTurbine()
            }
            if(autobuy_nuclear_reactor){
                buyNuclearReactor()
            }
        }
    }
    if(negotiate_cooldown > 0){
        negotiate_cooldown = negotiate_cooldown - 1
        document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
    }
    if(negotiate_timer > 0){
        negotiate_timer = negotiate_timer - 1
        document.getElementById("negotiate_timer").innerHTML = negotiate_timer;
    }
    updateMarketPrice();
    getCredits()
    updateChart()
    document.getElementById("current_credits").innerHTML = current_credits;
}, 1000);

function runSimulationTest(){
    // Reset the game state to ensure a clean test run
    resetGameStateForTest();
    var initial_credits = current_credits;
    document.getElementById("sim_test_result").innerHTML = "Running...";

    var sim_interval = setInterval(function(){
        // More advanced purchasing logic for the simulation
        if(workers < p_mechs){
            buyWorker(1); // Prioritize workers if machines are available
        } else if (current_credits > solar_panel_cost * 2) {
            buySolarPanel(); // Invest in passive income if credits are high
        } else {
            buyPedalMachine(); // Default to pedal machines
        }

        getCredits();
    }, 10); // Run at an accelerated speed

    setTimeout(function(){
        clearInterval(sim_interval);
        // The test passes if credits have increased, indicating a profitable simulation
        if(current_credits > initial_credits){
            document.getElementById("sim_test_result").innerHTML = "Passed";
        } else {
            document.getElementById("sim_test_result").innerHTML = `Failed (Credits started at ${initial_credits} and ended at ${current_credits})`;
        }
        // It's good practice to reset the state again after the test
        resetGameStateForTest();
        load(); // Reload the UI to reflect the reset state
    }, 3000); // Run the simulation for 3 seconds
}

function resetGameStateForTest() {
    current_gen = 0;
    current_power_price = 2;
    current_credits = 100;
    work_cost_per_hour = 0;
    workers = 0;
    p_mechs = 0;
    p_mech_eff = 0.5;
    p_mech_level = 1;
    managers = 0;
    manager_cost = 1000;
    manager_efficiency = 1;
    manager_efficiency_cost = 5000;
    manager_upgrade_solar_cost = 10000;
    manager_upgrade_wind_cost = 25000;
    manager_upgrade_nuclear_cost = 100000;
    solar_panels = 0;
    solar_panel_cost = 500;
    solar_panel_eff = 2;
    solar_panel_upgrade_cost = 1000;
    wind_turbines = 0;
    wind_turbine_cost = 2000;
    wind_turbine_eff = 10;
    wind_turbine_upgrade_cost = 5000;
    nuclear_reactors = 0;
    nuclear_reactor_cost = 10000;
    nuclear_reactor_eff = 50;
    nuclear_reactor_upgrade_cost = 25000;
    negotiate_cooldown = 0;
    negotiate_timer = 0;
    base_power_price = 2;
}
