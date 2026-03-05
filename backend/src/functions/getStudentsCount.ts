import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { connectToDatabase, closeDatabaseConnection } from "../shared/database";
import * as sql from "mssql";
export async function getStudentsCount(request: HttpRequest, context: InvocationContext):
    Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    let pool: sql.ConnectionPool | undefined;
    try {
        pool = await connectToDatabase();
        const result = await pool.request().query("SELECT COUNT(*) AS count FROM Students");
        const count = result.recordset[0].count;
        const date = new Date().toLocaleDateString("en-AU", {
            year: "numeric", month: "long", day: "numeric"
        });
        return {
            body: `There are ${count} students as of ${date}.`,
            headers: { "Content-Type": "text/plain" }
        };
    } catch (err) {
        context.log(`Error: ${err}`);
        return { status: 500, body: "An error occurred while fetching student count." };
    } finally {
        // Close the database connection using the shared utility
        if (pool) {
            await closeDatabaseConnection(pool);
        }
    }
}
app.http('getStudentsCount', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'students/count',
    handler: getStudentsCount
});