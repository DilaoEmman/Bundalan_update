<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\Order;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    // Store a new survey response
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:500',
        ]);

        // Prevent duplicate survey per order
        if (Survey::where('order_id', $validated['order_id'])->exists()) {
            return response()->json(['error' => 'Survey for this order already exists.'], 409);
        }

        $survey = Survey::create($validated);

        return response()->json(['message' => 'Thank you for your feedback!', 'survey' => $survey]);
    }

    // List all surveys (with related order info)
    public function index()
    {
        $surveys = Survey::with('order')->latest()->get();

        return response()->json([
            'error' => false,
            'surveys' => $surveys,
        ]);
    }
}
