// components/product/ProductStory.tsx
export default function ProductStory({ story }: { story?: string }) {
    if (!story) return <div className="py-20 text-center text-gray-400">No story content available.</div>;

    return (
        <div className="prose prose-lg max-w-none text-gray-800">
            {/* Simple rendering for now. In real app, use react-markdown */}
            {story.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-semibold mt-6 mb-2">{line.replace('### ', '')}</h3>;
                }
                if (line.trim() === '') {
                    return <br key={i} />;
                }
                return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
            })}
        </div>
    );
}
