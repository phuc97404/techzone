import React from 'react';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  // In a real app, this would use a Markdown renderer or dangerouslySetInnerHTML with sanitization
  return (
    <div 
      className="prose prose-lg max-w-none prose-blue 
      text-slate-900
      prose-headings:font-bold prose-headings:text-slate-900
      prose-p:text-slate-700 prose-p:leading-relaxed
      prose-img:rounded-2xl prose-img:shadow-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
