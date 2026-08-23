<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealLog extends Model
{
    protected $fillable = ['user_id', 'food_item_id', 'meal_type', 'quantity_grams', 'logged_at'];

    protected function casts(): array
    {
        return [
            'quantity_grams' => 'decimal:2',
            'logged_at' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function foodItem(): BelongsTo
    {
        return $this->belongsTo(FoodItem::class);
    }
}
