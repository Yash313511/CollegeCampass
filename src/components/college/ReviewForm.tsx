"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquarePlus, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ReviewItem } from "@/types";

export interface ReviewFormProps {
  collegeId: string;
  onReviewSubmitted?: (review: ReviewItem) => void;
}

export function ReviewForm({ collegeId, onReviewSubmitted }: ReviewFormProps) {
  const sessionRes = useSession();
  const session = sessionRes?.data;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!session?.user) {
    return (
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-center space-y-3">
        <MessageSquarePlus className="h-6 w-6 text-slate-400 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-900">
          Share your experience with this college
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Sign in to your student account to write a review and help fellow students make better decisions.
        </p>
        <a href={`/auth/login?redirect=/colleges/${collegeId}`}>
          <Button variant="outline" size="sm" className="mt-1">
            Sign in to Review
          </Button>
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      setError("Please fill in both a title and review comment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/colleges/${collegeId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      const json = await res.json();
      setSuccess(true);
      setTitle("");
      setComment("");
      onReviewSubmitted?.(json.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit review";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <MessageSquarePlus className="h-4 w-4 text-blue-600" />
          <span>Write a Review</span>
        </h4>
        <span className="text-xs text-slate-500">
          Posting as <strong className="text-slate-800">{session.user.name || "Student"}</strong>
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Review submitted successfully! Thank you for sharing your feedback.</span>
        </div>
      )}

      {/* Star Rating Picker */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Your Rating
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <Star
                className={`h-6 w-6 ${
                  (hoverRating || rating) >= star
                    ? "text-amber-500 fill-amber-500"
                    : "text-slate-200"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-slate-700">
            {rating} of 5 Stars
          </span>
        </div>
      </div>

      {/* Review Title */}
      <Input
        label="Review Headline"
        placeholder="e.g. Great faculty and strong placement support"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Review Comment */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700">
          Your Detailed Experience
        </label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details about academic curriculum, campus life, faculty, hostel, or placements..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="sm"
        isLoading={isSubmitting}
        className="w-full sm:w-auto"
      >
        Submit Review
      </Button>
    </form>
  );
}
