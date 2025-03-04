// app/api/env-test/route.js
export async function GET() {
    return new Response(
        JSON.stringify({
            openaiKeyExists: !!process.env.OPENAI_API_KEY,
            neo4jUriExists: !!process.env.NEO4J_URI,
            neo4jUserExists: !!process.env.NEO4J_USER,
            neo4jPasswordExists: !!process.env.NEO4J_PASSWORD
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}