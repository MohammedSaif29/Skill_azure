def recommend_storage(
    workload_type,
    requests_per_second,
    read_percentage,
    write_percentage,
    latency_requirement,
    access_frequency,
    cost_sensitivity
):

    standard_score = 0
    premium_score = 0

    reasons = []

    # Request rate
    if requests_per_second >= 1000:
        premium_score += 3
        reasons.append("Very high request rate")
    elif requests_per_second >= 500:
        premium_score += 2
        reasons.append("High request rate")
    else:
        standard_score += 2
        reasons.append("Moderate request rate")

    # Latency requirement
    if latency_requirement == "low":
        premium_score += 3
        reasons.append("Low latency requirement")
    elif latency_requirement == "medium":
        premium_score += 1
        reasons.append("Moderate latency requirement")
    else:
        standard_score += 2
        reasons.append("Latency requirement is not strict")

    # Access frequency
    if access_frequency == "very_high":
        premium_score += 2
        reasons.append("Very frequent data access")
    elif access_frequency == "high":
        premium_score += 1
        reasons.append("Frequent data access")
    else:
        standard_score += 1
        reasons.append("Lower access frequency")

    # Validate read/write percentages
    if read_percentage + write_percentage != 100:
        return {
            "error": "Read percentage + Write percentage must equal 100"
        }

    # Write-heavy workload
    if write_percentage >= 40:
        premium_score += 1
        reasons.append("Write-intensive workload")

    # Read-heavy workload
    if read_percentage >= 80:
        reasons.append("Read-intensive workload")

    # Cost sensitivity
    if cost_sensitivity == "high":
        standard_score += 3
        reasons.append("High cost sensitivity")
    elif cost_sensitivity == "medium":
        standard_score += 1
        reasons.append("Moderate cost sensitivity")

    # Workload type
    if workload_type in [
        "transaction_processing",
        "real_time_application",
        "high_performance_computing"
    ]:
        premium_score += 2
        reasons.append("Performance-sensitive workload")

    elif workload_type in [
        "backup",
        "archive",
        "document_storage"
    ]:
        standard_score += 2
        reasons.append("Cost-oriented storage workload")

    # Final recommendation
    if premium_score > standard_score:
        recommendation = "Premium"
    else:
        recommendation = "Standard"

    return {
        "recommendation": recommendation,
        "standard_score": standard_score,
        "premium_score": premium_score,
        "reasons": reasons
    }


# Test workload
result = recommend_storage(
    workload_type="real_time_application",
    requests_per_second=1000,
    read_percentage=80,
    write_percentage=20,
    latency_requirement="low",
    access_frequency="very_high",
    cost_sensitivity="medium"
)

print("\nAZURE STORAGE TIER RECOMMENDATION")
print("=" * 50)

print("Recommendation:", result["recommendation"])
print("Standard Score:", result["standard_score"])
print("Premium Score:", result["premium_score"])

print("\nReasons:")

for reason in result["reasons"]:
    print("✓", reason)