// Helper function for assertions
function assertEquals(expected, actual, message) {
    if (expected !== actual) {
        throw new Error(`${message}: Expected ${expected}, but got ${actual}`);
    }
}

function runUnitTests() {
    let results = [];
    let passed = 0;
    let failed = 0;

    // Test Suite
    const tests = [
        {
            name: "buyWorker should increase worker count",
            test: function() {
                resetGameStateForTest();
                let initial_workers = workers;
                buyWorker(1);
                assertEquals(initial_workers + 1, workers, "Worker count did not increase by 1");
            }
        },
        {
            name: "buyPedalMachine should increase machine count and decrease credits",
            test: function() {
                resetGameStateForTest();
                let initial_mechs = p_mechs;
                let cost = Math.floor(init_p_mach_cost * Math.pow(1.1, p_mechs));
                current_credits = cost; // Set credits to exact cost
                buyPedalMachine();
                assertEquals(initial_mechs + 1, p_mechs, "Machine count did not increase by 1");
                assertEquals(0, current_credits, "Credits were not deducted correctly");
            }
        },
        {
            name: "buyPedalMachine should fail with insufficient credits",
            test: function() {
                resetGameStateForTest();
                let initial_mechs = p_mechs;
                current_credits = 0; // Insufficient credits
                buyPedalMachine();
                assertEquals(initial_mechs, p_mechs, "Machine count should not have changed");
            }
        },
        {
            name: "buyManager should increase manager count and decrease credits",
            test: function() {
                resetGameStateForTest();
                let initial_managers = managers;
                current_credits = manager_cost; // Set credits to exact cost
                buyManager();
                assertEquals(initial_managers + 1, managers, "Manager count did not increase by 1");
                assertEquals(0, current_credits, "Credits were not deducted correctly for manager");
            }
        },
        {
            name: "buySolarPanel should increase solar panel count and decrease credits",
            test: function() {
                resetGameStateForTest();
                let initial_panels = solar_panels;
                current_credits = solar_panel_cost; // Set credits to exact cost
                buySolarPanel();
                assertEquals(initial_panels + 1, solar_panels, "Solar panel count did not increase by 1");
                assertEquals(0, current_credits, "Credits were not deducted correctly for solar panel");
            }
        },
        {
            name: "buyWindTurbine should increase wind turbine count and decrease credits",
            test: function() {
                resetGameStateForTest();
                let initial_turbines = wind_turbines;
                current_credits = wind_turbine_cost; // Set credits to exact cost
                buyWindTurbine();
                assertEquals(initial_turbines + 1, wind_turbines, "Wind turbine count did not increase by 1");
                assertEquals(0, current_credits, "Credits were not deducted correctly for wind turbine");
            }
        },
        {
            name: "buyNuclearReactor should increase nuclear reactor count and decrease credits",
            test: function() {
                resetGameStateForTest();
                let initial_reactors = nuclear_reactors;
                current_credits = nuclear_reactor_cost; // Set credits to exact cost
                buyNuclearReactor();
                assertEquals(initial_reactors + 1, nuclear_reactors, "Nuclear reactor count did not increase by 1");
                assertEquals(0, current_credits, "Credits were not deducted correctly for nuclear reactor");
            }
        }
    ];

    // Run all tests
    tests.forEach(t => {
        try {
            t.test();
            results.push(`${t.name}: Passed`);
            passed++;
        } catch (e) {
            results.push(`${t.name}: Failed - ${e.message}`);
            failed++;
        }
    });

    // Display results
    let result_string = `Passed: ${passed}, Failed: ${failed}. Details: ${results.join('; ')}`;
    document.getElementById("unit_test_result").innerHTML = result_string;
}
