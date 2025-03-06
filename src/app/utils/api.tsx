// utils/api.tsx
export async function fetchHealthData() {
    const response = await fetch("http://localhost:8000/api/health-data/");
    if (!response.ok) {
      throw new Error("Failed to fetch health data");
    }
    return response.json();
  }