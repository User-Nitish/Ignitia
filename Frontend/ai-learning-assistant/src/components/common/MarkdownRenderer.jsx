import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
    return (
        <div className="text-neutral-700">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-3 mb-2" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-base font-semibold mt-3 mb-1 text-slate-800" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed text-slate-700" {...props} />,
                    a: ({ node, ...props }) => <a className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2 transition-colors font-medium" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1 text-slate-700" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-700" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                    em: ({ node, ...props }) => <em className="italic text-slate-600" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-indigo-200 bg-indigo-50/30 px-4 py-2 italic text-slate-600 my-6 rounded-r-lg" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <div className="my-6 rounded-xl overflow-hidden border border-slate-200/60">
                                <SyntaxHighlighter
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, padding: '1.5rem' }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="bg-slate-100 px-1.5 py-0.5 rounded-md font-mono text-xs text-indigo-700 font-semibold" {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ node, ...props }) => <pre className="bg-transparent p-0 m-0" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
export default MarkdownRenderer;