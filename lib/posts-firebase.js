import { db } from './firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';

export async function readDbData() {
    const myCollectionRef = collection(db, "posts");
    const querySnapshot = await getDocs(myCollectionRef);
    const jsonObj = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return jsonObj;
}

export async function getSortedPostsData() {
    const jsonObj = await readDbData();
    
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

export async function getAllPostsId() {

}

export async function getPostdata(id) {

}