// app/api/debug-db/route.js
import { executeQuery } from '../../../services/neo4jsService';

export async function GET() {
    try {
        // Check if environment variables are set
        const neo4jUri = process.env.NEO4J_URI;
        const neo4jUser = process.env.NEO4J_USER;
        const neo4jPassword = process.env.NEO4J_PASSWORD;
        
        const envStatus = {
            uriSet: !!neo4jUri,
            userSet: !!neo4jUser,
            passwordSet: !!neo4jPassword,
            allSet: !!neo4jUri && !!neo4jUser && !!neo4jPassword
        };
        
        let dbStatus = 'Not tested';
        let dbResults = null;
        
        // Only try connecting if environment variables are set
        if (envStatus.allSet) {
            try {
                // Simple test query
                const results = await executeQuery('MATCH (s:Scrap) RETURN s LIMIT 5');
                dbStatus = 'Connected successfully';
                dbResults = results.length;
            } catch (dbError) {
                dbStatus = `Connection failed: ${dbError.message}`;
            }
        }
        
        return new Response(
            JSON.stringify({
                environment: envStatus,
                database: {
                    status: dbStatus,
                    results: dbResults
                }
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Debug database error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}