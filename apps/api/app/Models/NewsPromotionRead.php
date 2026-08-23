<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsPromotionRead extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'news_promotion_id', 'read_at'];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
}
