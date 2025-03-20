const ScrapModal = ({ scrap, onClose }) => {
    if (!scrap) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[16px] w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Scrap Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-5 overflow-y-auto max-h-[calc(80vh-64px)]">
                    <div className="mb-6">
                        <h3 className="text-sm uppercase text-gray-500 mb-1">Content</h3>
                        <p className="text-lg">{scrap.content}</p>
                    </div>

                    {scrap.tags && scrap.tags.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm uppercase text-gray-500 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {scrap.tags.map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {scrap.metadata && Object.keys(scrap.metadata).length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm uppercase text-gray-500 mb-2">Metadata</h3>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {Object.entries(scrap.metadata).map(([key, value]) => (
                                    <div key={key} className="col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                                        <dd className="mt-1">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    <div className="text-xs text-gray-500 mt-6">
                        ID: {scrap.id}
                    </div>
                </div>
                <div className="p-5 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default ScrapModal;