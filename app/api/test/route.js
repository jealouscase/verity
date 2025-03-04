// app/api/test/route.js
export async function GET(request) {
    console.log('Test route GET request received');
    return new Response(
        JSON.stringify({ message: 'Test route working!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}

export async function POST(request) {
    console.log('Test route POST request received');
    return new Response(
        JSON.stringify({ message: 'Test route working!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}