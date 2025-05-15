import { type ActionFunctionArgs } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "~/lib/utils"; // your custom parser
import { ID } from "appwrite";
import { appwriteConfig, database } from "~/lib/appwrite/client";


export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const {
      country,
      numberOfDays,
      travelStyle,
      interests,
      budget,
      groupType,
      userId,
    } = await request.json();

    console.log("Received trip request:");
    console.log({ country, numberOfDays, travelStyle, interests, budget, groupType, userId });

    if (
      !country ||
      !numberOfDays ||
      !travelStyle ||
      !interests ||
      !budget ||
      !groupType ||
      !userId
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

    console.log("GEMINI_API_KEY:", geminiApiKey ? "Loaded ✅" : "❌ MISSING");
    console.log("UNSPLASH_ACCESS_KEY:", unsplashApiKey ? "Loaded ✅" : "❌ MISSING");

    if (!geminiApiKey) throw new Error("GEMINI_API_KEY not set");
    if (!unsplashApiKey) throw new Error("UNSPLASH_ACCESS_KEY not set");

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
Budget: '${budget}'
Interests: '${interests}'
TravelStyle: '${travelStyle}'
GroupType: '${groupType}'
Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
{
  "name": "A descriptive title for the trip",
  "description": "A brief description of the trip and its highlights not exceeding 100 words",
  "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
  "duration": ${numberOfDays},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": ${interests},
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "🌸 Season (from month to month): reason to visit",
    "☀️ Season (from month to month): reason to visit",
    "🍁 Season (from month to month): reason to visit",
    "❄️ Season (from month to month): reason to visit"
  ],
  "weatherInfo": [
    "☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)",
    "🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)",
    "🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)",
    "❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)"
  ],
  "location": {
    "city": "name of the city or region",
    "coordinates": [latitude, longitude],
    "openStreetMap": "link to open street map"
  },
  "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        { "time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk" },
        { "time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour" },
        { "time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine" }
      ]
    }
    // Repeat for other days
  ]
}
Respond only with valid JSON. Do not include any explanations or markdown formatting.`;


    

    console.log("Sending prompt to Gemini...");
    const textResult = await genAI
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([prompt]);

    const rawText = textResult.response.text();
    console.log("Raw response from Gemini:", rawText.slice(0, 300), "...");

    let trip;
    try {
      trip = parseMarkdownToJson(rawText);
      console.log("Parsed trip data:", trip);
    } catch (parseError) {
      console.error("❌ Failed to parse AI response JSON:", parseError);
      throw new Error("AI response is not valid JSON");
    }

    // Fetch Unsplash images
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      country + " " + interests + " " + travelStyle
    )}&client_id=${unsplashApiKey}`;

    console.log("Fetching Unsplash images from:", unsplashUrl);
    const imageResponse = await fetch(unsplashUrl);

    if (!imageResponse.ok) {
      console.error("❌ Unsplash API error:", imageResponse.status, imageResponse.statusText);
      throw new Error(`Unsplash API error: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageData = await imageResponse.json();
    const imageUrls = imageData.results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null)
      .filter(Boolean);

    console.log("Image URLs from Unsplash:", imageUrls);

    const result = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripCollectionId,
      ID.unique(),
      {
        tripDetail: JSON.stringify(trip),
        createdAt: new Date().toISOString(),
        imageUrls,
        userId,
      }
    );

    console.log("✅ Trip document created with ID:", result.$id);

    return new Response(JSON.stringify({ id: result.$id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("🔥 Error generating travel plan:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate trip" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
