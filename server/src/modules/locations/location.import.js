require("dotenv").config();

const connectDatabase = require("../../config/database");
const Location = require("./location.model");

const API_URL =
    "https://api.data.gov.in/resource/71818d1a-c114-46cb-aa9b-56ed70d4bc4a";

const LIMIT = 1000;

const fetchLocations = async (offset) => {
    const url = new URL(API_URL);

    url.searchParams.set("api-key", process.env.DATA_GOV_API_KEY);
    url.searchParams.set("format", "json");
    url.searchParams.set("offset", offset.toString());
    url.searchParams.set("limit", LIMIT.toString());

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `LGD API request failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
};

const importLocations = async () => {
    try {
        await connectDatabase();

        console.log("Fetching LGD location data...");

        let offset = 0;
        let totalImported = 0;

        while (true) {
            const data = await fetchLocations(offset);
            const records = data.records || [];

            if (records.length === 0) {
                break;
            }

            const operations = records.map((record) => ({
                updateOne: {
                    filter: {
                        localBodyCode: record.localBodyCode,
                        pincode: String(record.pincode),
                    },
                    update: {
                        $set: {
                            stateCode: record.stateCode,
                            stateName: record.stateNameEnglish,
                            localBodyCode: record.localBodyCode,
                            localBodyName: record.localBodyNameEnglish,
                            localBodyType: record.localBodyTypeName,
                            pincode: String(record.pincode),
                        },
                    },
                    upsert: true,
                },
            }));

            await Location.bulkWrite(operations);

            totalImported += records.length;

            console.log(
                `Imported ${totalImported} / ${data.total} records`
            );

            offset += records.length;

            if (offset >= data.total) {
                break;
            }
        }

        console.log("LGD location import completed successfully.");
        console.log(`Total records processed: ${totalImported}`);

        process.exit(0);
    } catch (error) {
        console.error("LGD location import failed:", error.message);
        process.exit(1);
    }
};

importLocations();