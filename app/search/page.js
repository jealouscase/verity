// pages/search.js
import Head from 'next/head';
import SearchResults from '../components/SearchResults';

export default function Search() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Search Results | Writer's Inspiration Platform</title>
                <meta name="description" content="Search results for writing inspiration" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto py-10">
                <SearchResults />
            </main>

            <footer className="py-6 bg-white border-t">
                <div className="container mx-auto text-center text-gray-500 text-sm">
                    Writer's Inspiration Platform &copy; {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
}