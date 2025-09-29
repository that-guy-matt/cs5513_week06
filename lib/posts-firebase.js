import { db } from './firebase';  
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';

// Fetch all posts from Firestore and return a lightweight summary list
export async function getSortedPostsData() {
    // Reference to the "posts" collection in Firestore
    const myCollectionRef = collection(db, "posts");

    // Query Firestore to get all documents in the collection
    const querySnapshot = await getDocs(myCollectionRef);

    // Convert Firestore documents into plain JS objects
    const jsonObj = querySnapshot.docs.map(doc => ({
        id: doc.id,        // Document ID
        ...doc.data()      // All other fields from the document
    }));

    // Sort posts alphabetically by title
    jsonObj.sort(function (a, b) {
        return a.title.localeCompare(b.title);
    });

    // Return a lightweight summary (id, title, date) for each post
    return jsonObj.map(item => {
        return {
            id: item.id.toString(),
            title: item.title,
            date: item.date,
        }
    });
}

// Get all post IDs in a format that Next.js `getStaticPaths` expects
export async function getAllPostIds() {
    // Reference to the "posts" collection
    const myCollectionRef = collection(db, "posts");

    // Query Firestore for all posts
    const querySnapshot = await getDocs(myCollectionRef);

    // Extract only the document IDs
    const jsonObj = querySnapshot.docs.map(doc => ({
        id: doc.id
    }));
    
    // Next.js requires IDs to be nested like: { params: { id: "123" } }
    return jsonObj.map(item => {
        return {
            params: {
                id: item.id.toString(),
            }
        }
    });
}

// Fetch a single post from Firestore by its document ID
export async function getPostData(id) {
    // Reference to the "posts" collection
    const myCollectionRef = collection(db, "posts");

    // Build a Firestore query to find the document by its ID
    const searchQuery = query(
        myCollectionRef,
        where(documentId(), "==", id)
    );

    // Execute the query
    const querySnapshot = await getDocs(searchQuery);
    
    // Convert query results into a JS object
    const jsonObj = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    // If no document is found, return a placeholder object
    if (jsonObj.length === 0) {
        return {
            id: '',
            title: 'Not Found',
            date: '',
            description: 'Not found',
            ingredients: '',
            instructions: '',
        }
    } else {
        // Otherwise, return the first (and only) matched post
        return jsonObj[0];
    }
}
