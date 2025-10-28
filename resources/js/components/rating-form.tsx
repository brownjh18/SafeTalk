import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';

interface RatingFormProps {
    counselorId: number;
    onSuccess?: () => void;
}

export default function RatingForm({ counselorId, onSuccess }: RatingFormProps) {
    const [hoveredRating, setHoveredRating] = useState<number>(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        review: '',
        anonymous: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/client/counselors/${counselorId}/rate`, {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* Star Rating */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Rating</Label>
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setData('rating', star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-1 hover:scale-110 transition-transform"
                            title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        >
                            <Star
                                className={`h-6 w-6 ${
                                    star <= (hoveredRating || data.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                        {data.rating} star{data.rating !== 1 ? 's' : ''}
                    </span>
                </div>
                {errors.rating && (
                    <p className="text-sm text-red-600">{errors.rating}</p>
                )}
            </div>

            {/* Review Text */}
            <div className="space-y-2">
                <Label htmlFor="review" className="text-sm font-medium">
                    Review (Optional)
                </Label>
                <Textarea
                    id="review"
                    placeholder="Share your experience with this counselor..."
                    value={data.review}
                    onChange={(e) => setData('review', e.target.value)}
                    rows={3}
                    className="resize-none"
                />
                {errors.review && (
                    <p className="text-sm text-red-600">{errors.review}</p>
                )}
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="anonymous"
                    checked={data.anonymous}
                    onCheckedChange={(checked) => setData('anonymous', !!checked)}
                />
                <Label
                    htmlFor="anonymous"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Submit anonymously
                </Label>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={processing}
                className="w-full"
            >
                {processing ? 'Submitting...' : 'Submit Rating'}
            </Button>
        </form>
    );
}