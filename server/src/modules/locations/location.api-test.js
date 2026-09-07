require("dotenv").config();

const testLocationApi = async () => {
    try {
        const url = new URL(
            "https://api.data.gov.in/resource/71818d1a-c114-46cb-aa9b-56ed70d4bc4a"
        );

        url.searchParams.set("api-key", process.env.DATA_GOV_API_KEY);
        url.searchParams.set("format", "json");
        url.searchParams.set("offset", "0");
        url.searchParams.set("limit", "5");

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();

        console.log("API connection successful");
        console.log("Total records:", data.total);
        console.log("Records received:", data.records?.length);
        console.log("Sample record:");
        console.log(data.records?.[0]);
    } catch (error) {
        console.error("Location API test failed:", error.message);
    }
};

testLocationApi();