import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { connectToDatabase, closeDatabaseConnection } from "../shared/database";
import { initializeDatabase } from "../shared/database";
export async function deleteStudentById(request: HttpRequest, context: InvocationContext):
    Promise<HttpResponseInit> {
    // Initialize the database and models
    await initializeDatabase();
    // Retrieve the StudentId from the route parameters
    const studentId = request.params.StudentId;
    if (!studentId) {
        return { status: 400, body: "Student ID is required." };
    }
    let pool;
    try {
        pool = await connectToDatabase();
        const result = await pool.request()
            .input("StudentId", studentId)
            .query("DELETE FROM Students WHERE StudentId = @StudentId");
        if (result.rowsAffected[0] === 0) {
            return { status: 404, body: "Student not found." };
        }
        return { status: 200, body: "Student deleted successfully." };
    } catch (err) {
        context.log(`Error: ${err}`);
        return { status: 500, body: "An error occurred while deleting the student." };
    } finally {
        if (pool) {
            await closeDatabaseConnection(pool);
        }
    }
}
app.http('deleteStudentById', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'students/{StudentId}',
    handler: deleteStudentById
});