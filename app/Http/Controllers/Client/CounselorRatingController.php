<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\CounselorRating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CounselorRatingController extends Controller
{
    public function store(Request $request, User $counselor)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'anonymous' => 'boolean',
            'counseling_session_id' => 'nullable|exists:counseling_sessions,id',
        ]);

        $user = Auth::user();

        // Check if counselor exists and is verified
        if (!$counselor->verified || $counselor->role !== 'counselor') {
            return back()->withErrors(['counselor' => 'Invalid counselor selected.']);
        }

        // Check if user already rated this counselor
        $existingRating = CounselorRating::where('counselor_id', $counselor->id)
            ->where('client_id', $user->id)
            ->first();

        if ($existingRating) {
            // Update existing rating
            $existingRating->update([
                'rating' => $request->rating,
                'review' => $request->review,
                'anonymous' => $request->boolean('anonymous', false),
                'counseling_session_id' => $request->counseling_session_id,
            ]);

            return back()->with('success', 'Rating updated successfully!');
        } else {
            // Create new rating
            CounselorRating::create([
                'counselor_id' => $counselor->id,
                'client_id' => $user->id,
                'rating' => $request->rating,
                'review' => $request->review,
                'anonymous' => $request->boolean('anonymous', false),
                'counseling_session_id' => $request->counseling_session_id,
            ]);

            return back()->with('success', 'Rating submitted successfully!');
        }
    }
}
