<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'customer_id' => 'nullable|exists:customers,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $feedback = Feedback::create($validated);

        return response()->json(['message' => 'Feedback saved', 'feedback' => $feedback], 201);
    }

    public function stats()
    {
        $average = Feedback::avg('rating');
        $count = Feedback::count();
        $distribution = Feedback::selectRaw('rating, count(*) as count')->groupBy('rating')->orderBy('rating')->get();

        return response()->json([
            'average' => $average,
            'count' => $count,
            'distribution' => $distribution,
        ]);
    }

    public function index()
    {
        return response()->json([
            'feedback' => Feedback::latest()->take(30)->get()
        ]);
    }
}
