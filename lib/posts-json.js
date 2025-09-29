import fs from 'fs';         // Node.js module to interact with the file system
import path from 'path';     // Node.js module to handle and transform file paths

// Define the path to the "data" directory (from project root)
const dataDir = path.join(process.cwd(), 'data');

// --- Helper function: Read and parse JSON data from posts.json ---
export function readJsonData(dataDir) {
    // Build absolute path to the posts.json file
    const filePath = path.join(dataDir, 'posts.json');
    // Read the file contents as a UTF-8 string
    const jsonString = fs.readFileSync(filePath, 'utf8');
    // Parse JSON string into a JavaScript object/array
    const jsonObj = JSON.parse(jsonString);
    return jsonObj;
}

// --- Function: Return sorted list of posts (id, title, date) ---
export function getSortedPostsData() {
    const jsonObj = readJsonData(dataDir);

    // Sort posts alphabetically by title
    jsonObj.sort(function (a, b) {
        return a.title.localeCompare(b.title);
    });

    // Map posts to only include id, title, and date (lightweight summary)
    return jsonObj.map(item => {
        return {
            id: item.id.toString(),
            title: item.title,
            date: item.date,
        }
    });
}

// --- Function: Return all post IDs (for Next.js dynamic routing) ---
export function getAllPostIds() {
    const jsonObj = readJsonData(dataDir);

    // Next.js requires IDs to be nested inside { params: { id: ... } }
    return jsonObj.map(item => {
        return {
            params: {
                id: item.id.toString(),
            }
        }
    });
}

// --- Function: Return full post data by ID ---
export function getPostData(id) {
    const jsonObj = readJsonData(dataDir);

    // Filter posts to find the one matching the given ID
    const objReturned = jsonObj.filter(obj => {
        return obj.id.toString() === id;
    });

    // If no match, return a placeholder "empty" object
    if (objReturned.length === 0) {
        return {
            id: '',
            title: '',
            date: '',
            description: '',
            ingredients: '',
            instructions: '',
        }
    } else {
        // Otherwise, return the first (and only) matched post
        return objReturned[0];
    }
}
