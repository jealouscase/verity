// pages/search.js
import SearchResults from '../../components/SearchResults';
import { Suspense } from 'react';

export default function Search() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto py-10">
                <Suspense fallback={<div>Loading...</div>}>
                    <SearchResults />
                </Suspense>
            </main>

            <footer className="py-6 bg-white border-t">
                <div className="container mx-auto text-center text-gray-500 text-sm">
                    Verity &copy; {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
}