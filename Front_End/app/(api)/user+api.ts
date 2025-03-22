import { clerk } from "@clerk/clerk-expo/dist/provider/singleton";
import { neon } from "@neondatabase/serverless";

// Function to handle POST requests
export async function POST(requset: Request) {
  try {
    // Initialize the Neon SQL client with the database connection string
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Parse the JSON body of the request to extract required fields
    const { name, email, clerk_id } = await requset.json();

    // Validate that all required fields are present
    if (!name || !email || !clerk_id) {
      return Response.json(
        { error: "Missing required fields" }, // Return an error if any field is missing
        { status: 400 } // HTTP 400 Bad Request
      );
    }

    // Execute an SQL query to insert the user data into the database
    const result = await sql`
      INSERT INTO users (name, email, clerk_id)
      VALUES (${name}, ${email}, ${clerk_id})`;

    // Return a success response with the result of the query
    return new Response(JSON.stringify({ data: result }), { status: 201 }); // HTTP 201 Created
  } catch (error) {
    // Log the error for debugging purposes
    console.log(error);

    // Return an error response in case of an exception
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500, // HTTP 500 Internal Server Error
    });
  }
}
