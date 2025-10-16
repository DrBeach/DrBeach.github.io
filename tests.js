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
