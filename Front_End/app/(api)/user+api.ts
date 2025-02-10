import { clerk } from "@clerk/clerk-expo/dist/provider/singleton";
import { neon } from "@neondatabase/serverless";

export async function POST(requset: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerk_id } = await requset.json();
    if (!name || !email || !clerk_id) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const result = await sql`
      INSERT INTO users (name, email, clerk_id)
      VALUES (${name}, ${email}, ${clerk_id})`;
    return new Response(JSON.stringify({ data: result }), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
