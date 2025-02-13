import React from 'react';
import { Link } from 'react-router-dom';

function Card({ title, summary, cover, createdAt, author, _id }) {
  const truncateText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="group relative w-64 overflow-hidden bg-slate-400 rounded-md shadow-md hover:shadow-xl transition-all duration-300 p-2">
      <Link to={`/post/${_id}`} className="block relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img 
          className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-500"
          src={`http://localhost:8000/${cover}`} 
          alt={title} 
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-slate-700 text-white text-xs px-2 py-1 rounded-full ">
          {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/post/${_id}`}>
          <h2 className="text-lg font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-200">
            {truncateText(title, 50)}
          </h2>
        </Link>
        
        <p className="mt-2 text-black text-sm lg:text-md leading-relaxed">
          {truncateText(summary, 80)}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {author.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-md font-medium text-black">
                {author.username}
              </p>
            </div>
          </div>
          
          <Link 
            to={`/post/${_id}`}
            className="text-black text-sm md:text-lg font-medium transition-colors duration-200"
          >
            Read →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
