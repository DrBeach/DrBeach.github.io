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

var negotiate_cooldown = 0;
var solar_panels = 0;
var solar_panel_cost = 500;
var solar_panel_eff = 2;
var solar_panel_upgrade_cost = 1000;
var solar_panel_upgrade_chance = 0.1;
var wind_turbines = 0;
var wind_turbine_eff = 10;
var nuclear_reactors = 0;
var nuclear_reactor_eff = 50;

var areas = ["factory_floor", "laboratory", "management", "dashboard", "admin"]

var creditHistory = []
var powerHistory = []
var creditChart
var powerChart
//var space_max = 100;

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
    p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1))
    if(current_credits >= p_mech_prototype_cost){
        current_credits -= p_mech_prototype_cost;
        if(Math.random() < p_mech_upgrade_chance){
            p_mech_eff = fixFloat(p_mech_eff + 0.2);
            p_mech_eff2 = p_mech_eff;
            p_mech_level++;
            getCurrentGen();
            p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1));
            document.getElementById("p_mech_prototype_cost").innerHTML = p_mech_prototype_cost;
            document.getElementById("p_mech_eff").innerHTML = p_mech_eff;
            document.getElementById("p_mech_eff2").innerHTML = p_mech_eff2;
        }
        document.getElementById("current_credits").innerHTML = current_credits;
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

        if(Math.random() < solar_panel_upgrade_chance){
            solar_panel_eff = fixFloat(solar_panel_eff + 1);
            solar_panel_upgrade_cost = Math.floor(solar_panel_upgrade_cost * 1.8);

            document.getElementById("solar_panel_eff").innerHTML = solar_panel_eff;
            document.getElementById("solar_panel_eff2").innerHTML = solar_panel_eff;
            getCurrentGen();
            document.getElementById("solar_panel_upgrade_cost").innerHTML = solar_panel_upgrade_cost;
        }

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
    }
    updateChart();
}, 1000);
