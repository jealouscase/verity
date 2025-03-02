// services/neo4jService.js
import neo4j from 'neo4j-driver';

let driver;

export function getDriver() {
    if (!driver) {
        const uri = process.env.NEO4J_URI;
        const user = process.env.NEO4J_USER;
        const password = process.env.NEO4J_PASSWORD;

        if (!uri || !user || !password) {
            throw new Error(
                'Neo4j environment variables are missing. Make sure NEO4J_URI, NEO4J_USER, and NEO4J_PASSWORD are set.'
            );
        }

        driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    }
    return driver;
}

export async function executeQuery(cypher, params = {}) {
    const session = getDriver().session();
    try {
        const result = await session.run(cypher, params);
        return result.records.map(record => {
            return record.keys.reduce((obj, key) => {
                // Handle Neo4j types and convert to JavaScript types
                const value = record.get(key);

                // If it's a Neo4j Node, extract properties
                if (value && value.properties) {
                    obj[key] = {
                        ...value.properties,
                        labels: value.labels,
                        identity: value.identity.toString()
                    };

                    // Parse metadata if it's a JSON string
                    if (obj[key].metadata && typeof obj[key].metadata === 'string') {
                        try {
                            obj[key].metadata = JSON.parse(obj[key].metadata);
                        } catch (e) {
                            // Keep as string if not valid JSON
                        }
                    }
                } else {
                    // For primitive values or relationships
                    obj[key] = value;
                }

                return obj;
            }, {});
        });
    } finally {
        await session.close();
    }
}

export async function getScrapById(id) {
    const query = `
    MATCH (s:Scrap {id: $id})
    RETURN s
  `;

    const result = await executeQuery(query, { id });

    if (result.length === 0) {
        return null;
    }

    return result[0].s;
}

export async function getRelatedScraps(id) {
    const query = `
    MATCH (s:Scrap {id: $id})-[r:RELATED_TO]->(related:Scrap)
    RETURN related, r.type as relationType, r.strength as relationStrength, r.aiReasoning as reasoning
  `;

    return await executeQuery(query, { id });
}

export async function executePromptQuery(cypherQuery) {
    try {
        return await executeQuery(cypherQuery);
    } catch (error) {
        console.error('Error executing generated Cypher query:', error);
        throw new Error(`Failed to execute the generated query: ${error.message}`);
    }
}

export async function searchScraps(query = '') {
    // Simple search by content or tags
    const searchQuery = `
    MATCH (s:Scrap)
    WHERE toLower(s.content) CONTAINS toLower($query)
       OR ANY(tag IN s.tags WHERE toLower(tag) CONTAINS toLower($query))
    RETURN s
    LIMIT 20
  `;

    return await executeQuery(searchQuery, { query });
}

export async function closeDriver() {
    if (driver) {
        await driver.close();
        driver = null;
    }
}