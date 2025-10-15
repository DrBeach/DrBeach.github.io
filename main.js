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
var negotiate_cooldown = 0
var base_power_price = 2

var areas = ["factory_floor", "laboratory", "management", "dashboard", "admin"]

var creditHistory = []
var powerHistory = []
var resourceChart
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

    var ctx = document.getElementById('resourceChart').getContext('2d');
    resourceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Credits',
                data: creditHistory,
                borderColor: 'gold',
                fill: false
            }, {
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
    var max_utility = Math.max(p_mechs, workers) - (Math.max(p_mechs, workers) - Math.min(p_mechs, workers))
    current_gen = fixFloat(max_utility * p_mech_eff)
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
        p_mech_eff = fixFloat(p_mech_eff + 0.2)
        p_mech_eff2 = p_mech_eff
        p_mech_level = p_mech_level + 1
        current_credits = current_credits - p_mech_prototype_cost
        current_credits = fixFloat(current_credits)
        getCurrentGen()
        p_mech_prototype_cost = fixFloat(Math.pow(1.1,p_mech_level) * 10  * p_mech_eff * 2 * (60*1))
        document.getElementById("p_mech_prototype_cost").innerHTML = p_mech_prototype_cost
        document.getElementById("p_mech_eff").innerHTML = p_mech_eff
        document.getElementById("p_mech_eff2").innerHTML = p_mech_eff2
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
    }
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
        current_power_price = current_power_price * 2
        document.getElementById("current_power_price").innerHTML = current_power_price;
        negotiate_cooldown = 60
        document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
        setTimeout(function(){
            current_power_price = base_power_price
            document.getElementById("current_power_price").innerHTML = current_power_price;
        }, 10000)
    }
}

function updateChart(){
    creditHistory.push(current_credits)
    powerHistory.push(current_gen)
    resourceChart.data.labels.push("")
    if(creditHistory.length > 20){
        creditHistory.shift()
        powerHistory.shift()
        resourceChart.data.labels.shift()
    }
    resourceChart.update()
}

window.setInterval(function(){
    if(managers > 0){
        for(var i = 0; i < manager_efficiency; i++){
            buyWorker(1)
            buyPedalMachine()
        }
    }
    if(negotiate_cooldown > 0){
        negotiate_cooldown = negotiate_cooldown - 1
        document.getElementById("negotiate_cooldown").innerHTML = negotiate_cooldown;
    }
    getCredits()
    updateChart()
    document.getElementById("current_credits").innerHTML = current_credits;
}, 1000);

function runSimulationTest(){
    var initial_credits = current_credits;
    var sim_interval = setInterval(function(){
        buyWorker(1);
        buyPedalMachine();
        getCredits();
    }, 10);

    setTimeout(function(){
        clearInterval(sim_interval);
        if(current_credits > initial_credits){
            document.getElementById("sim_test_result").innerHTML = "Passed";
        } else {
            document.getElementById("sim_test_result").innerHTML = "Failed";
        }
    }, 3000);
}
