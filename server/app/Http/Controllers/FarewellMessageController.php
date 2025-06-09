<?php

namespace App\Http\Controllers;

use App\Models\FarewellMessage;
use Illuminate\Http\Request;

class FarewellMessageController extends Controller
{
    // List all messages (admin)
    public function index()
    {
        return FarewellMessage::all();
    }

    // Store a new message (admin)
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:255',
            'active' => 'sometimes|boolean',
        ]);

        $farewell = FarewellMessage::create([
            'message' => $request->message,
            'active' => $request->has('active') ? $request->active : true,
        ]);

        return response()->json($farewell, 201);
    }

    // Show a single message (optional, admin)
    public function show($id)
    {
        $farewell = FarewellMessage::findOrFail($id);
        return response()->json($farewell);
    }

    // Update a message (admin)
    public function update(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string|max:255',
            'active' => 'sometimes|boolean',
        ]);

        $farewell = FarewellMessage::findOrFail($id);
        $farewell->update([
            'message' => $request->message,
            'active' => $request->has('active') ? $request->active : $farewell->active,
        ]);

        return response()->json($farewell);
    }

    // Delete a message (admin)
    public function destroy($id)
    {
        $farewell = FarewellMessage::findOrFail($id);
        $farewell->delete();

        return response()->json(null, 204);
    }

    // Get a random active message (public, for POS use)
    public function random()
    {
        $farewell = FarewellMessage::where('active', 1)->inRandomOrder()->first();
        if (!$farewell) {
            return response()->json([
                'error' => true,
                'message' => 'No active farewell messages found.'
            ], 404);
        }
        return response()->json($farewell);
    }
}
