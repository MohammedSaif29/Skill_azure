import os
import time
import csv
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient

load_dotenv()

connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_CONTAINER_NAME")

if not connection_string:
    raise ValueError("Azure connection string not found in .env")

blob_service = BlobServiceClient.from_connection_string(
    connection_string
)

container = blob_service.get_container_client(container_name)

blobs = [
    "workload_1MB.txt",
    "workload_10MB.txt",
    "workload_100MB.txt"
]

results = []

print("\nAZURE STORAGE PERFORMANCE BENCHMARK")
print("=" * 65)

for blob_name in blobs:

    blob = container.get_blob_client(blob_name)

    properties = blob.get_blob_properties()
    size_bytes = properties.size
    size_mb = size_bytes / (1024 * 1024)

    print(f"\nTesting: {blob_name}")
    print(f"File size: {size_mb:.2f} MB")

    start = time.perf_counter()

    stream = blob.download_blob(
        max_concurrency=4
    )

    total_bytes = 0

    for chunk in stream.chunks():
        total_bytes += len(chunk)

    end = time.perf_counter()

    download_time = end - start
    throughput = (total_bytes / (1024 * 1024)) / download_time

    print(f"Downloaded: {total_bytes / (1024 * 1024):.2f} MB")
    print(f"Download time: {download_time:.4f} seconds")
    print(f"Throughput: {throughput:.2f} MB/s")

    results.append({
        "file": blob_name,
        "size_mb": round(size_mb, 2),
        "download_time_sec": round(download_time, 4),
        "throughput_mb_s": round(throughput, 2)
    })

with open("benchmark_results.csv", "w", newline="") as file:

    writer = csv.DictWriter(
        file,
        fieldnames=[
            "file",
            "size_mb",
            "download_time_sec",
            "throughput_mb_s"
        ]
    )

    writer.writeheader()
    writer.writerows(results)

print("\n" + "=" * 65)
print("Benchmark completed.")
print("Results saved to benchmark_results.csv")