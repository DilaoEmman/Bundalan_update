<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'rating',
        'feedback',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
