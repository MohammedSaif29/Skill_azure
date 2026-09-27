function recommendStorage({
    workloadType,
    requestsPerSecond,
    readPercentage,
    writePercentage,
    latencyRequirement,
    accessFrequency,
    costSensitivity
}) {

    let standardScore = 0;
    let premiumScore = 0;

    const reasons = [];

    // Request rate
    if (requestsPerSecond >= 1000) {
        premiumScore += 3;
        reasons.push("Very high request rate");
    } 
    else if (requestsPerSecond >= 500) {
        premiumScore += 2;
        reasons.push("High request rate");
    } 
    else {
        standardScore += 2;
        reasons.push("Moderate request rate");
    }

    // Latency requirement
    if (latencyRequirement === "low") {
        premiumScore += 3;
        reasons.push("Low latency requirement");
    } 
    else if (latencyRequirement === "medium") {
        premiumScore += 1;
        reasons.push("Moderate latency requirement");
    } 
    else {
        standardScore += 2;
        reasons.push("Latency requirement is not strict");
    }

    // Access frequency
    if (accessFrequency === "very_high") {
        premiumScore += 2;
        reasons.push("Very frequent data access");
    } 
    else if (accessFrequency === "high") {
        premiumScore += 1;
        reasons.push("Frequent data access");
    } 
    else {
        standardScore += 1;
        reasons.push("Lower access frequency");
    }

    // Read/write validation
    if (readPercentage + writePercentage !== 100) {
        return {
            error: "Read percentage + Write percentage must equal 100"
        };
    }

    // Write intensive
    if (writePercentage >= 40) {
        premiumScore += 1;
        reasons.push("Write-intensive workload");
    }

    // Read intensive
    if (readPercentage >= 80) {
        reasons.push("Read-intensive workload");
    }

    // Cost sensitivity
    if (costSensitivity === "high") {
        standardScore += 3;
        reasons.push("High cost sensitivity");
    } 
    else if (costSensitivity === "medium") {
        standardScore += 1;
        reasons.push("Moderate cost sensitivity");
    }

    // Workload type
    if (
        workloadType === "transaction_processing" ||
        workloadType === "real_time_application" ||
        workloadType === "high_performance_computing"
    ) {
        premiumScore += 2;
        reasons.push("Performance-sensitive workload");
    } 
    else if (
        workloadType === "backup" ||
        workloadType === "archive" ||
        workloadType === "document_storage"
    ) {
        standardScore += 2;
        reasons.push("Cost-oriented storage workload");
    }

    // Final recommendation
    const recommendation =
        premiumScore > standardScore
            ? "Premium"
            : "Standard";

    return {
        recommendation,
        standardScore,
        premiumScore,
        reasons
    };
}

module.exports = {
    recommendStorage
};