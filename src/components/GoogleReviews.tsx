'use client';

import { useState, useEffect } from 'react';

// A simple star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-[#fbbc04]">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const I18N = {
  tr: {
    months: 'ay önce',
    weeks: 'hafta önce',
    days: 'gün önce',
    years: 'yıl önce',
    review: 'değerlendirme',
  },
  en: {
    months: 'months ago',
    weeks: 'weeks ago',
    days: 'days ago',
    years: 'years ago',
    review: 'reviews',
  }
};

interface Review {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export default function GoogleReviews({ locale = 'tr' }: { locale?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const t = I18N[locale as keyof typeof I18N] || I18N.tr;

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.result && data.result.reviews) {
          // Filter 4 and 5 stars
          setReviews(data.result.reviews.filter((r: Review) => r.rating >= 4));
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Yorumlar yüklenemedi.');
        setLoading(false);
      });
  }, []);

  const translateTime = (timeDesc: string) => {
    if (locale !== 'tr') return timeDesc;
    
    let translated = timeDesc;
    translated = translated.replace('a month ago', '1 ay önce');
    translated = translated.replace('months ago', t.months);
    translated = translated.replace('a week ago', '1 hafta önce');
    translated = translated.replace('weeks ago', t.weeks);
    translated = translated.replace('a day ago', '1 gün önce');
    translated = translated.replace('days ago', t.days);
    translated = translated.replace('a year ago', '1 yıl önce');
    translated = translated.replace('years ago', t.years);
    return translated;
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-slate-200 rounded"></div><div className="h-4 bg-slate-200 rounded w-5/6"></div></div></div></div>;
  if (error || reviews.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review, i) => (
        <div key={i} className="bg-white border border-[#e8efe9] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <img src={review.profile_photo_url} alt={review.author_name} className="w-12 h-12 rounded-full" />
            <div>
              <h4 className="font-semibold text-slate-900">{review.author_name}</h4>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-slate-500">{translateTime(review.relative_time_description)}</span>
              </div>
            </div>
            <div className="ml-auto">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5 opacity-70" />
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 flex-grow">
            {review.text}
          </p>
        </div>
      ))}
    </div>
  );
}
