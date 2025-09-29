// Import shared layout wrapper for consistent page structure
import Layout from '../../components/layout';

// Import helper functions to fetch data from JSON
import { getAllPostIds, getPostData } from '../../lib/posts-firebase';

// Import Next.js <Head> for setting metadata (title, etc.)
import Head from 'next/head';

// Import custom Date component to format dates
import Date from '../../components/date';

// Import CSS module for scoped styling
import utilStyles from '../../styles/utils.module.css';


// --- Next.js data fetching: getStaticProps ---
// Runs at build time to fetch data for a single post based on the route parameter
export async function getStaticProps({ params }) {
    // Fetch the full data for the post with the given id
    const postData = await getPostData(params.id);
    return {
        props: {
            postData, // Passed as a prop to the page component
        },
    };
}


// --- Next.js data fetching: getStaticPaths ---
// Tells Next.js which dynamic routes to pre-render at build time
export async function getStaticPaths() {
    // Get all post IDs from JSON
    const paths = await getAllPostIds();
    return {
        paths,          // List of routes: e.g. [{ params: { id: '1' } }, ...]
        fallback: false // Any path not returned here will 404
    };
}


// --- Page Component: Post ---
// Renders an individual blog post page
export default function Post({ postData }) {
    return (
        <Layout>
            <Head>
                {/* Set the HTML <title> dynamically */}
                <title>{postData.title}</title>
            </Head>
            <article>
                {/* Post Title */}
                <h1 className={utilStyles.headingX1}>{postData.title}</h1>

                {/* Post Date (formatted via custom Date component) */}
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>

                {/* Post Body Content */}
                <div>
                    {/* Short description/summary */}
                    <p>{postData.description}</p>

                    {/* Ingredients list */}
                    <h2>Ingredients</h2>
                    <ul>
                        {postData.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>

                    {/* Step-by-step instructions */}
                    <h2>Instructions</h2>
                    <ol>
                        {postData.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </div>
            </article>
        </Layout>
    );
}
